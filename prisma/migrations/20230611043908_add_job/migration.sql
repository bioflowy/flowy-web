/*
  Warnings:

  - The primary key for the `Node` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[ipAddress]` on the table `Node` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('created', 'queued', 'running', 'finished', 'failed');

-- AlterTable
ALTER TABLE "Node" DROP CONSTRAINT "Node_pkey",
ADD CONSTRAINT "Node_pkey" PRIMARY KEY ("name");

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "toolId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "command" TEXT[],
    "cpu" INTEGER NOT NULL,
    "memory" INTEGER NOT NULL,
    "status" "JobStatus" NOT NULL,
    "nodeName" TEXT,
    "exitCode" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Node_ipAddress_key" ON "Node"("ipAddress");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_nodeName_fkey" FOREIGN KEY ("nodeName") REFERENCES "Node"("name") ON DELETE SET NULL ON UPDATE CASCADE;
