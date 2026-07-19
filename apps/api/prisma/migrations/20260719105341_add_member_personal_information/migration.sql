/*
  Warnings:

  - Added the required column `first_name` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "members" ADD COLUMN     "email" VARCHAR(255),
ADD COLUMN     "first_name" VARCHAR(100) NOT NULL,
ADD COLUMN     "last_name" VARCHAR(100) NOT NULL;
