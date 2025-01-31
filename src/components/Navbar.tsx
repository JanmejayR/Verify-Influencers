
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "./theme provider/theme-toggle";
import { UserButton } from "@clerk/nextjs";


const Navbar = () => {
  return (
    <div className="flex  mx-8 justify-between items-center pt-8 pb-4    border-b-[0.1px] border-[var(--primary)]">
      <div className="text-3xl font-semibold flex items-center gap-x-3">

        <Image alt="logo" src="opal-logo.svg" width={40} height={40} />
        VerifyInfluencers
      </div>
      <div className="hidden gap-x-10 items-center lg:flex">
        <Link
          href="/leaderboard"
          className=""
        >
          Leaderboard
        </Link>
        <Link href="/research-tasks">Research Tasks</Link>

        <ModeToggle/>
        <UserButton appearance={{ elements: { avatarBox: "h-10 w-10" } }} />
           
      

        
      </div>
     
    </div>
  );
};

export default Navbar;
