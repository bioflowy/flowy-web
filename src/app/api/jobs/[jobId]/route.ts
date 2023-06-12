import { JobListSchema, JobSchema, JobUpdateInputSchema, JobWithInputOutputSchema } from "@/schema/job"
import { getJob, updateJob, } from "@/server/service/job"
import { NextResponse } from "next/server"

export async function GET(request: Request,{ params }: { params: { jobId: string }} ){
  const jobId = parseInt(params.jobId)
  if(jobId){
    const rslt = await getJob(jobId)
    JobSchema.parse(rslt);
    return NextResponse.json(rslt)
  }else{
    return NextResponse.error()
  }
  
}
export async function POST(request: Request,{ params }: { params: { jobId: string }} ){
  const jobId = parseInt(params.jobId)
  const json = await request.json()
  const input = JobUpdateInputSchema.safeParse(json)

  if(input.success){
    const rslt = await updateJob(jobId,input.data)
    JobSchema.parse(rslt);
    return NextResponse.json(rslt)
  }else{
    return NextResponse.error()
  }
  
}
