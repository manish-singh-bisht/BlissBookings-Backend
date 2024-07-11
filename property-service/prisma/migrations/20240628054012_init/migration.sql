-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "per_night_price" DECIMAL(65,30) NOT NULL,
    "description" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "guests_num" INTEGER NOT NULL,
    "bed_num" INTEGER NOT NULL,
    "bedroom_num" INTEGER NOT NULL,
    "bathroom_num" INTEGER NOT NULL,
    "address_line_1" TEXT NOT NULL,
    "address_line_2" TEXT,
    "locationId" TEXT NOT NULL,
    "propertyTypeId" TEXT NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "PropertyType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Property_locationId_idx" ON "Property"("locationId");

-- CreateIndex
CREATE INDEX "Property_propertyTypeId_idx" ON "Property"("propertyTypeId");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_propertyTypeId_fkey" FOREIGN KEY ("propertyTypeId") REFERENCES "PropertyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
