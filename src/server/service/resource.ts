import { Resource, ResourceStatus } from "@prisma/client"
import { prisma } from "../db"
import { ResourceUpdateInput } from "@/schema/resource"

export function getResource(id:number): Promise<Resource> {
  return prisma.resource.findUniqueOrThrow({where:{id:id}})
}
export function updateResource(id:number,input:ResourceUpdateInput) {
  return prisma.resource.update({where:{id},
    data:{
      status: input.status as ResourceStatus,
      path: input.path,
      size: input.size
  }})
}

