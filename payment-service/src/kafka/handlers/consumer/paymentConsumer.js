const prisma = require("../../../lib/prisma");
exports.createPaymentRecordInitialization = async (booking) => {
  try {
    const { id, total_price, orderIdGateway } = booking;

    await prisma.payment.create({
      data: {
        bookingId: id,
        amount: total_price,
        status: "PENDING",
        orderIdGateway: orderIdGateway,
      },
    });
  } catch (error) {
    console.error(
      `Error creating payment record for booking id ${booking.id}:`,
      error
    );
  }
};
exports.cancelPayment = async (booking) => {
  try {
    const { orderIdGateway } = booking;

    let existingPayment = await prisma.payment.findFirst({
      where: {
        orderIdGateway: orderIdGateway,
      },
    });

    if (existingPayment.status === "PENDING") {
      //call the payment for cancelling the payment.

      await prisma.payment.update({
        where: {
          id: existingPayment.id,
          orderIdGateway: orderIdGateway,
          status: {
            in: ["PENDING"],
          },
        },
        data: {
          status: "FAILED",
        },
      });
    } else if (existingPayment.status === "COMPLETED") {
      //REFUND

      await prisma.payment.update({
        where: {
          id: existingPayment.id,
          orderIdGateway: orderIdGateway,
        },
        data: {
          status: "REFUNDED",
        },
      });
    }
  } catch (error) {
    console.error(`Error `, error);
  }
};
