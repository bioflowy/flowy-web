-- CreateEnum
CREATE TYPE "NodeStatus" AS ENUM ('offline', 'idle', 'allocated', 'full');

-- CreateTable
CREATE TABLE "Node" (
    "name" TEXT NOT NULL,
    "cpu" INTEGER NOT NULL,
    "memory" INTEGER NOT NULL,
    "status" "NodeStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("name")
);
