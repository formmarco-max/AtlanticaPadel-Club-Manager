-- AlterTable
ALTER TABLE "courts" ADD COLUMN     "closing_time" VARCHAR(5) NOT NULL DEFAULT '23:00',
ADD COLUMN     "default_reservation_duration" INTEGER NOT NULL DEFAULT 90,
ADD COLUMN     "has_lighting" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_under_maintenance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maintenance_notes" TEXT,
ADD COLUMN     "opening_time" VARCHAR(5) NOT NULL DEFAULT '08:00',
ADD COLUMN     "reservation_interval" INTEGER NOT NULL DEFAULT 0;
