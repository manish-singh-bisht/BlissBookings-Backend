-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CANCELLED', 'COMPLETED', 'PAST');

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL,
    "per_night_price" DECIMAL(65,30) NOT NULL,
    "total_guests" INTEGER NOT NULL,
    "total_price" DECIMAL(65,30) NOT NULL,
    "orderIdGateway" TEXT NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Booking_propertyId_idx" ON "Booking"("propertyId");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_startDate_endDate_idx" ON "Booking"("startDate", "endDate");
