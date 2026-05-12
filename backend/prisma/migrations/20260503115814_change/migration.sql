/*
  Warnings:

  - You are about to drop the column `status` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'NOT_STARTED';

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "status";
