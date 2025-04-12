"use client";

import { UserButton, ClerkLoading, ClerkLoaded, SignedIn, SignedOut } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export const UserButtonWrapper = () => {
  return (
    <>
      <SignedIn>
        <ClerkLoaded>
          <UserButton afterSignOutUrl="/" />
        </ClerkLoaded>
        <ClerkLoading>
          <Loader2 className="size-8 animate-spin text-slate-400"/>
        </ClerkLoading>
      </SignedIn>
      <SignedOut>
        <div className="size-8" />
      </SignedOut>
    </>
  );
}; 