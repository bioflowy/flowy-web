import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ResourceSchema } from "./resource";
import { JobStatus } from "@prisma/client";

extendZodWithOpenApi(z);

export const JobStatusSchema = z.nativeEnum(JobStatus)

export const JobOutputSchema = z.object({
  name: z.string(),
  resourceId: z.number().int().openapi({ example: 1234 }),
});
export const GetJobByNodeNameSchema = z.object({
  nodeName: z.string(),
});
export const JobOutputResourceSchema = z.object({
  name: z.string(),
  resourceId: ResourceSchema,
});
export const JobInputSchema = z.object({
  name: z.string(),
  resourceId: z.number().int().openapi({ example: 1234 }),
});
export const JobInputResourceSchema = z.object({
  name: z.string(),
  resourceId: ResourceSchema,
});

export const CreateJobSchema = z.object({
  toolId: z.number().int(),
  inputs: JobInputSchema.array(),
});

export const JobWithInputOutputSchema = z.object({
  id: z.number().int().openapi({ example: 121 }),
  name: z.string().openapi({ example: "John Doe" }),
  command: z
    .string()
    .array()
    .openapi({ example: ["ls", "-l"] }),
  exitCode: z.number().int(),
  cpu: z.number().int(),
  memory: z.number().int(),
  status: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  inputs: JobInputResourceSchema.array(),
  outputs: JobOutputResourceSchema.array()
});

export const JobSchema = z.object({
  id: z.number().int().openapi({ example: 121 }),
  name: z.string().openapi({ example: "John Doe" }),
  command: z
    .string()
    .array()
    .openapi({ example: ["ls", "-l"] }),
  exitCode: z.number().int(),
  cpu: z.number().int(),
  memory: z.number().int(),
  status: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const JobListSchema = JobSchema.array()


export const JobUpdateInputSchema = z.object({
  exitCode: z.number().int(),
  status: JobStatusSchema,
});
export type JobEntry = z.infer<typeof JobSchema>;
export type JobArray = z.infer<typeof JobListSchema>;
export type JobUpdateInput = z.infer<typeof JobUpdateInputSchema>;
export type JobOutput = z.infer<typeof JobOutputSchema>;
export type JobInput = z.infer<typeof JobInputSchema>;
export type CreateJobInput = z.infer<typeof CreateJobSchema>;
