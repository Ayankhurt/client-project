-- CreateEnum
CREATE TYPE "public"."FieldType" AS ENUM ('TEXT', 'NUMBER', 'DATE', 'BOOLEAN', 'LABEL', 'SINGLE_SELECT', 'MULTI_SELECT', 'LINK', 'EMAIL', 'PHONE');

-- CreateTable
CREATE TABLE "public"."FieldDefinition" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."FieldType" NOT NULL,
    "validations" JSONB,
    "version" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FieldDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FieldAssignment" (
    "id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "field_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "filterable" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FieldAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FieldValue" (
    "id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "field_id" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FieldValue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."FieldAssignment" ADD CONSTRAINT "FieldAssignment_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "public"."FieldDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FieldValue" ADD CONSTRAINT "FieldValue_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "public"."FieldDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
