import { GetJobByNodeNameSchema, JobListSchema } from "@/schema/job"
import { getJobByNodeNameAndStatus } from "@/server/service/job"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const json = await request.json()
  const input = GetJobByNodeNameSchema.safeParse(json)
  if(input.success){
    const rslt = await getJobByNodeNameAndStatus(input.data.nodeName,"queued")
    JobListSchema.parse(rslt);
    return NextResponse.json(rslt)
  }else{
    return NextResponse.error()
  }
  
}
