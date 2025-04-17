"use client"

import React from 'react'
import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/nextjs'
export default function page() {
  return (
    <div>
      Home Page
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
    </div>
  )
}
