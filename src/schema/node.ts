import { NodeStatus } from "@prisma/client";
import { z } from "zod";

export const NodeStatusSchema = z.nativeEnum(NodeStatus)

export const NodeSchema = z.object({
  name: z.string(),
  ipAddress: z.string(),
  cpu: z.number().int(),
  memory: z.number().int(),
  status: NodeStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})
export const NodeUpdateSchema = NodeSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export type NodeEntity = z.infer<typeof NodeSchema>

export type NodeUpdate = z.infer<typeof NodeUpdateSchema>