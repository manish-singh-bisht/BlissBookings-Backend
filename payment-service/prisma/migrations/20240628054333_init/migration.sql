-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL(65,30) NOT NULL,
    "orderIdGateway" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "method" TEXT,
    "transactionId" TEXT,
    "gatewaySignature" TEXT,
    "gatewayOrderId" TEXT,
    "payerEmail" TEXT,
    "payerName" TEXT,
    "payerId" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderIdGateway_key" ON "Payment"("orderIdGateway");

-- CreateIndex
CREATE INDEX "Payment_bookingId_idx" ON "Payment"("bookingId");

-- CreateIndex
CREATE INDEX "Payment_orderIdGateway_idx" ON "Payment"("orderIdGateway");
