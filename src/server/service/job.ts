import { JobStatus } from "@prisma/client";
import { prisma } from "../db";
import { JobUpdateInput } from "@/schema/job";

export function getJobByNodeNameAndStatus(nodeName:string,status:JobStatus) {
  return prisma.job.findMany({where:{nodeName:nodeName,status:status}})
}

export function getJob(jobId:number) {
  return prisma.job.findUniqueOrThrow({where:{id:jobId}})
}

export function updateJob(jobId:number,updateInput:JobUpdateInput) {
  return prisma.job.update({where:{id:jobId},data:updateInput})
}