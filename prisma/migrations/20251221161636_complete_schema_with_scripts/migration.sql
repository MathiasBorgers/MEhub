/*
  Warnings:

  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'Developer';
ALTER TYPE "Role" ADD VALUE 'Admin';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" VARCHAR(255),
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "username" SET DATA TYPE VARCHAR(50);

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "icon" VARCHAR(50) NOT NULL,
    "color" VARCHAR(7) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Script" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "version" VARCHAR(20) NOT NULL,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "authorId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "requirements" VARCHAR(100)[],
    "features" VARCHAR(200)[],
    "screenshots" VARCHAR(255)[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Script_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "color" VARCHAR(7),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScriptTag" (
    "scriptId" UUID NOT NULL,
    "tagId" UUID NOT NULL,

    CONSTRAINT "ScriptTag_pkey" PRIMARY KEY ("scriptId","tagId")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "userId" UUID NOT NULL,
    "scriptId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "size" BIGINT NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "scriptId" UUID NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Download" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "scriptId" UUID NOT NULL,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Download_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_id_key" ON "Category"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Script_id_key" ON "Script"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_id_key" ON "Tag"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Review_id_key" ON "Review"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_scriptId_key" ON "Review"("userId", "scriptId");

-- CreateIndex
CREATE UNIQUE INDEX "File_id_key" ON "File"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Download_id_key" ON "Download"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Download_userId_scriptId_key" ON "Download"("userId", "scriptId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Script" ADD CONSTRAINT "Script_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Script" ADD CONSTRAINT "Script_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScriptTag" ADD CONSTRAINT "ScriptTag_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScriptTag" ADD CONSTRAINT "ScriptTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;
