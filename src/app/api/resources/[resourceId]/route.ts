import { JobListSchema, JobSchema, JobUpdateInputSchema, JobWithInputOutputSchema } from "@/schema/job"
import { ResourceSchema, ResourceUpdateSchema } from "@/schema/resource"
import { getJob, updateJob, } from "@/server/service/job"
import { getResource, updateResource } from "@/server/service/resource"
import { NextResponse } from "next/server"

export async function GET(request: Request,{ params }: { params: { resourceId: string }} ){
  const resourceId = parseInt(params.resourceId)
  if(resourceId){
    const rslt = await getResource(resourceId)
    ResourceSchema.parse(rslt);
    return NextResponse.json(rslt)
  }else{
    return NextResponse.error()
  }
  
}
export async function POST(request: Request,{ params }: { params: { resourceId: string }} ){
  const resourceId = parseInt(params.resourceId)
  const json = await request.json()
  const input = ResourceUpdateSchema.safeParse(json)

  if(input.success){
    const rslt = await updateResource(resourceId,input.data)
    JobSchema.parse(rslt);
    return NextResponse.json(rslt)
  }else{
    return NextResponse.error()
  }
  
}
