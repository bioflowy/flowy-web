import { NodeEntity, NodeUpdate } from "@/schema/node";
import { prisma } from "../db";

export function getNode(): Promise<NodeEntity[]> {
  return prisma.node.findMany()  
}

export function createOrUpdateNode(node: NodeUpdate) {
  return prisma.node.upsert({
    where:{ipAddress:node.ipAddress},
    create: node,
    update: {
      ...node,
      updatedAt: new Date()
    }
  }
  )
}