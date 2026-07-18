/*
  Warnings:

  - Added the required column `club_id` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `club_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "members" ADD COLUMN     "club_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "club_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "clubs" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(30),
    "website" VARCHAR(255),
    "description" TEXT,
    "tax_number" VARCHAR(20),
    "address" VARCHAR(255),
    "postal_code" VARCHAR(20),
    "city" VARCHAR(100),
    "district" VARCHAR(100),
    "country" VARCHAR(100) DEFAULT 'Portugal',
    "logo_url" VARCHAR(500),
    "primary_color" VARCHAR(20),
    "secondary_color" VARCHAR(20),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clubs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clubs_name_key" ON "clubs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "clubs_slug_key" ON "clubs"("slug");

-- CreateIndex
CREATE INDEX "members_club_id_idx" ON "members"("club_id");

-- CreateIndex
CREATE INDEX "users_club_id_idx" ON "users"("club_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
