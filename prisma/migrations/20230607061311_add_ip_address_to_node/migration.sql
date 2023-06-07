/*
  Warnings:

  - The primary key for the `Node` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `ipAddress` to the `Node` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Node" DROP CONSTRAINT "Node_pkey",
ADD COLUMN     "ipAddress" TEXT NOT NULL,
ADD CONSTRAINT "Node_pkey" PRIMARY KEY ("ipAddress");
