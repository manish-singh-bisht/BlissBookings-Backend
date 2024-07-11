const prisma = require("../lib/prisma");
const { validationResult, matchedData } = require("express-validator");
const { sendMessage } = require("../kafka/producer");

exports.paymentCallback = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  const {
    method,
    transactionId,
    gatewaySignature,
    gatewayOrderId,
    payerEmail,
    payerName,
    payerId,
  } = matchedData(req);

  try {
    // Check if there's an existing payment record for the booking,which will always be because of the partial creation during booking creation.
    let existingPayment = await prisma.payment.findFirst({
      where: {
        orderIdGateway: gatewayOrderId,
        status: {
          in: ["PENDING"],
        },
      },
    });

    if (!existingPayment) {
      return res.status(400).json({ message: "Payment recorded not found" });
    }

    //write code for matching the signature received.

    let signatureMatch = true; //for now just saying true

    if (signatureMatch) {
      await prisma.payment.update({
        where: {
          id: existingPayment.id,
          orderIdGateway: gatewayOrderId,
        },
        data: {
          status: "COMPLETED",
          method,
          transactionId,
          gatewaySignature,
          gatewayOrderId,
          payerEmail,
          payerName,
          payerId,
          paymentDate: new Date(), // Update payment date
        },
      });

      await sendMessage("payment-topic", {
        event: "payment-success",
        payment: existingPayment,
      });

      return res.status(200).json({
        message: "Payment done successfully",
        redirectUrl: "sent a redirect url maybe.", //create a redirect url here
      });
    } else {
      await prisma.payment.update({
        where: {
          orderIdGateway: gatewayOrderId,
        },
        data: {
          status: "FAILED",
          method,
          transactionId,
          gatewaySignature,
          gatewayOrderId,
          payerEmail,
          payerName,
          payerId,
          paymentDate: new Date(), // Update payment date
        },
      });
      await sendMessage("payment-topic", {
        event: "payment-failure",
        payment: existingPayment,
      });
    }
  } catch (error) {
    console.error("Error recording payment details:", error);
    return res.status(500).json({ error: "Failed payment" });
  }
};
