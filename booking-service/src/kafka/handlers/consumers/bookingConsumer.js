const prisma = require("../../../lib/prisma");
const { sendMessage } = require("../../producer");

exports.changeBookingStatusToConfirmed = async (payment) => {
  try {
    const { orderIdGateway } = payment;

    const existingBooking = await prisma.booking.findFirst({
      where: {
        orderIdGateway: orderIdGateway,
        status: {
          in: ["PENDING"],
        },
      },
    });

    if (!existingBooking) {
      return console.log("No such booking");
    }

    await prisma.booking.update({
      where: {
        id: existingBooking.id,
        orderIdGateway: orderIdGateway,
        status: {
          in: ["PENDING"],
        },
      },
      data: {
        status: "COMPLETED",
      },
    });
  } catch (error) {
    console.error(`Error updating booking`, error);
  }
};

exports.changeBookingStatusToCancelled = async (payment) => {
  try {
    const { orderIdGateway } = payment;

    const existingBooking = await prisma.booking.findFirst({
      where: {
        orderIdGateway: orderIdGateway,
        status: {
          in: ["PENDING"],
        },
      },
    });

    if (!existingBooking) {
      return console.log("No such booking");
    }

    await prisma.booking.update({
      where: {
        id: existingBooking.id,
        orderIdGateway: orderIdGateway,
        status: {
          in: ["PENDING"],
        },
      },
      data: {
        status: "CANCELLED",
      },
    });
  } catch (error) {
    console.error(`Error updating booking`, error);
  }
};

exports.changeBookingStatusDueToTTL = async (orderIdGateway) => {
  try {
    const existingBooking = await prisma.booking.findFirst({
      where: {
        orderIdGateway: orderIdGateway,
      },
    });

    if (!existingBooking) {
      return console.log("No such booking");
    }

    if (
      existingBooking.status === "COMPLETED" ||
      existingBooking.status === "PAST" ||
      existingBooking.status === "CANCELLED"
    ) {
      return;
    }
    await prisma.booking.update({
      where: {
        id: existingBooking.id,
        orderIdGateway: orderIdGateway,
        status: {
          in: ["PENDING"],
        },
      },
      data: {
        status: "CANCELLED",
      },
    });

    await sendMessage("booking-topic", {
      event: "booking-cancelled-due-to-ttl",
      booking: existingBooking,
    });
  } catch (error) {
    console.error(`Error updating booking`, error);
  }
};
