-- CreateEnum
CREATE TYPE "CourtSurfaceType" AS ENUM ('ARTIFICIAL_GRASS', 'CONCRETE', 'SYNTHETIC', 'OTHER');

-- CreateEnum
CREATE TYPE "CourtType" AS ENUM ('SINGLES', 'DOUBLES');

-- CreateEnum
CREATE TYPE "CourtEnvironment" AS ENUM ('INDOOR', 'OUTDOOR');

-- CreateTable
CREATE TABLE "courts" (
    "id" UUID NOT NULL,
    "club_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "location" VARCHAR(150),
    "surface_type" "CourtSurfaceType" NOT NULL DEFAULT 'ARTIFICIAL_GRASS',
    "court_type" "CourtType" NOT NULL DEFAULT 'DOUBLES',
    "environment" "CourtEnvironment" NOT NULL DEFAULT 'INDOOR',
    "hourly_price" DECIMAL(10,2),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "courts_club_id_idx" ON "courts"("club_id");

-- CreateIndex
CREATE INDEX "courts_is_active_idx" ON "courts"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "courts_club_id_name_key" ON "courts"("club_id", "name");

-- AddForeignKey
ALTER TABLE "courts" ADD CONSTRAINT "courts_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
