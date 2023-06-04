"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Header = () => {
  return (
    <header className="bg-white p-4">
    <div className="flex justify-between items-center">
      <div className="flex justify-start space-x-4 mx-8">
        <Image src="/images/logo_transparent.png" className="h-10 w-auto" alt='flowy logo' width={50} height={50}/>
        <nav>
          <Link href="/resources"  className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm">
              Resources
          </Link>
        </nav>
      </div>
      <div>
        <nav>
          <Link href="/api/auth/signout" className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm">
               Sign Out
          </Link>
        </nav>
      </div>
    </div>
 </header>
 
  )
}

export default Header