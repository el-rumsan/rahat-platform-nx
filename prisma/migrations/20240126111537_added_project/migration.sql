-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PROCESSING', 'CLOSED', 'READY');

-- CreateTable
CREATE TABLE "ProjectType" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProjectType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PROCESSING',
    "projectType" TEXT NOT NULL,
    "extras" JSONB,
    "instance_id" TEXT,
    "contract_address" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectType_uuid_key" ON "ProjectType"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectType_name_key" ON "ProjectType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Project_uuid_key" ON "Project"("uuid");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_projectType_fkey" FOREIGN KEY ("projectType") REFERENCES "ProjectType"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
