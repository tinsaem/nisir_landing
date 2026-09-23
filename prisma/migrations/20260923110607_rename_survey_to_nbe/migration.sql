/*
  Warnings:

  - You are about to drop the `EbcaSurveyResponse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "EbcaSurveyResponse";

-- CreateTable
CREATE TABLE "NbeSurveyResponse" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "easeRating" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NbeSurveyResponse_pkey" PRIMARY KEY ("id")
);
