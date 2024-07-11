const prisma = require("../lib/prisma");
const { validationResult, matchedData } = require("express-validator");
const { acquireLock, releaseLock, setTTL } = require("../redis");
const { sendMessage } = require("../kafka/producer");

exports.createBooking = async (req, res) => {
  // const result = validationResult(req);

  // if (!result.isEmpty()) {
  //   return res.status(400).json({ errors: result.array() });
  // }

  const {
    propertyId,
    startDate,
    endDate,
    customerId,
    hostId,
    per_night_price,
    total_guests,
    total_price,
  } = req.body;

  const lockKey = `lock:booking:${propertyId}:${startDate}:${endDate}`;

  // so basically we are trying to lock using transaction and unique contraint check. since p-locking doesnt happen on insertion of new records,we are using transactions along with unique contraints check. two or more simultaneous transaction inserting same record , only one of them will be allowed to do so while others will be blocked until this completes. In our case when one transaction finishes and other starts, the other remaining are prevented from creating that same record because we have a unique contraint check here overlapping booking check.Thus managing concurrency.

  try {
    // Attempt to acquire the lock
    const lockAcquired = await acquireLock(lockKey, 300); // Lock for 5 minutes

    if (!lockAcquired) {
      return res
        .status(500)
        .json({ error: "Server is busy, please try again later." });
    }

    // Check if end date is after start date
    if (new Date(endDate) < new Date(startDate)) {
      await releaseLock(lockKey);
      return res.status(400).json({
        error: "End date must be after start date",
      });
    }

    // Check for overlapping bookings within the transaction
    const booking = await prisma.$transaction(async (prisma) => {
      const overlappingBooking = await prisma.booking.findFirst({
        where: {
          propertyId: propertyId,
          status: {
            in: ["PENDING", "COMPLETED"],
          },
          AND: [
            {
              OR: [
                {
                  // New booking overlaps with existing booking
                  startDate: {
                    lte: new Date(endDate).toISOString(),
                  },
                  endDate: {
                    gte: new Date(startDate).toISOString(),
                  },
                },
                {
                  // Existing booking overlaps with new booking
                  startDate: {
                    lte: new Date(startDate).toISOString(),
                  },
                  endDate: {
                    gte: new Date(endDate).toISOString(),
                  },
                },
                {
                  // New booking starts during an existing booking
                  startDate: {
                    lt: new Date(endDate).toISOString(),
                  },
                  endDate: {
                    gt: new Date(endDate).toISOString(),
                  },
                },
                {
                  // New booking ends during an existing booking
                  startDate: {
                    lt: new Date(startDate).toISOString(),
                  },
                  endDate: {
                    gte: new Date(startDate).toISOString(),
                  },
                },
              ],
            },
          ],
        },
      });

      if (overlappingBooking) {
        throw new Error("Booking overlaps with an existing booking");
      }

      const newBooking = await prisma.booking.create({
        data: {
          propertyId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          customerId,
          hostId,
          per_night_price,
          total_guests,
          total_price,
          status: "PENDING",
        },
      });

      return newBooking;
    });

    const ttlKey = `ttl:booking:${booking.orderIdGateway}`;
    await setTTL(ttlKey);

    // Release the lock
    await releaseLock(lockKey);

    await sendMessage("booking-topic", {
      event: "booking-initiated",
      booking: booking,
    });

    return res.status(201).json({ message: "ok", booking });
  } catch (error) {
    console.log("Error creating booking:", error);

    await releaseLock(lockKey);

    if (error.message === "Booking overlaps with an existing booking") {
      return res.status(409).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.markBookingPast = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty())
    return res.status(400).json({ errors: result.array() });

  const { id } = matchedData(req);

  try {
    const booking = await prisma.property.booking({
      where: { id },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await prisma.booking.update({
      where: { id },
      data: { status: "PAST" },
    });

    return res.status(200).json({ message: "Booking marked as past" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//create one for accepting the bookings
