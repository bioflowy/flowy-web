import { NodeUpdateSchema } from "@/schema/node";
import { createOrUpdateNode } from "@/server/service/node";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const json = await request.json()
  const input = NodeUpdateSchema.safeParse(json)
  if(input.success){
    const rslt = await createOrUpdateNode(input.data)
    return NextResponse.json({status:"Ok"})
  }else{
    return NextResponse.error()
  }
  
}
