/*
  Warnings:

  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_projectType_fkey";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "ProjectType";

-- CreateTable
CREATE TABLE "tbl_project_types" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "tbl_project_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_projects" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PROCESSING',
    "projectType" TEXT NOT NULL,
    "extras" JSONB,
    "instance_id" TEXT,
    "contract_address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "tbl_projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_project_types_uuid_key" ON "tbl_project_types"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_project_types_name_key" ON "tbl_project_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_projects_uuid_key" ON "tbl_projects"("uuid");

-- AddForeignKey
ALTER TABLE "tbl_projects" ADD CONSTRAINT "tbl_projects_projectType_fkey" FOREIGN KEY ("projectType") REFERENCES "tbl_project_types"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
