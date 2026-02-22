/*
  Warnings:

  - You are about to drop the column `isDiet` on the `Meal` table. All the data in the column will be lost.
  - Added the required column `isOnDiet` to the `Meal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meal" DROP COLUMN "isDiet",
ADD COLUMN     "isOnDiet" BOOLEAN NOT NULL;
