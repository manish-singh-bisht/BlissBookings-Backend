-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'HOST');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "email" TEXT NOT NULL,
    "hosting_since" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Description" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "languages" TEXT[],
    "locationId" TEXT NOT NULL,
    "pets" BOOLEAN NOT NULL,
    "job_title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Description_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Description_locationId_key" ON "Description"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "Description_userId_key" ON "Description"("userId");

-- AddForeignKey
ALTER TABLE "Description" ADD CONSTRAINT "Description_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Description" ADD CONSTRAINT "Description_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
