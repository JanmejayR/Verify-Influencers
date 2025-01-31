import React from 'react'
import Navbar from '@/components/Navbar'
type Props = {
    children: React.ReactNode
}
import { SignedIn } from '@clerk/nextjs'

const Layout = ({ children }: Props) => {
  return (
    <>
    <SignedIn>
        <Navbar/>
    </SignedIn>
      {children}
    </>
  )
}

export default Layout