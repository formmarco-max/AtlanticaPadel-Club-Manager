/*
  Warnings:

  - A unique constraint covering the columns `[employee_number]` on the table `coaches` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "coaches" ADD COLUMN     "employee_number" VARCHAR(30);

-- CreateIndex
CREATE UNIQUE INDEX "coaches_employee_number_key" ON "coaches"("employee_number");
