import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const ResourceSchemaForOpenApi = z.object({
  id: z.number().int().openapi({ example: 1234 }),
  status: z.string().openapi({ example: "uploading" }),
  name: z.string().openapi({ example: "test1_R1.fastq" }),
  size: z
    .number()
    .int()
    .nullable()
    .openapi({ example: 12345, format: "int64" }),
  path: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  type: z.string().openapi({ example: "text" }),
});
export const ResourceSchema = z.object({
  id: z.number().int().openapi({ example: 1234 }),
  status: z.string().openapi({ example: "uploading" }),
  name: z.string().openapi({ example: "test1_R1.fastq" }),
  size: z.number().int().nullable(),
  path: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  type: z.string().openapi({ example: "text" }),
});
export const ResourceCreateSchema = ResourceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const ResourceUpdateSchema = z.object({
  status: z.string().openapi({ example: "uploading" }),
  size: z
    .number()
    .int()
    .nullable()
    .openapi({ example: 12345, format: "int64" }),
  path: z.string().nullable(),
});

export type Resource = z.infer<typeof ResourceSchema>;
export type ResourceUpdateInput = z.infer<typeof ResourceUpdateSchema>;
export type ResourceCreateInput = z.infer<typeof ResourceCreateSchema>;
