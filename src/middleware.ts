import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if(request.method ==="OPTIONS"){
    return NextResponse.json({},{status:200});
  }else{
    return NextResponse.next();
  }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
};