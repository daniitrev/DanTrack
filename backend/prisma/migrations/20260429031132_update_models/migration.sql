/*
  Warnings:

  - You are about to drop the column `role` on the `MemberProject` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('MEMBER', 'EDITOR', 'OWNER');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('ABSENT', 'LOW', 'HIGH', 'CRITICAL');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Status" ADD VALUE 'NOT_STARTED';
ALTER TYPE "Status" ADD VALUE 'IN_REVIEW';

-- AlterTable
ALTER TABLE "MemberProject" DROP COLUMN "role",
ADD COLUMN     "projectRole" "ProjectRole" NOT NULL DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "assigneeId" TEXT,
ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'ABSENT',
ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED',
ALTER COLUMN "projectId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Task_assigneeId_idx" ON "Task"("assigneeId");

-- CreateIndex
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
