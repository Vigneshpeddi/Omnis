import LogoutButton from "@/components/LogoutButton";
import { Database } from "@/lib/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Link from "next/link";
import { ReactNode } from "react";

export default async function({children}: {children: ReactNode}){


  const supabase = createServerComponentClient<Database>({cookies})
  const { data: {user} } = await supabase.auth.getUser()
  if (!user) {
    return redirect('/')
  }


  return (

    <>
      <div className="w-screen bg-primary-foreground h-[8vh] flex flex-row gap-1 px-7 items-center z-50">
        <h1 className="text-4xl">Omnis Planning</h1>

        <p className="ml-auto mr-2">Hello, {(user.user_metadata.full_name as string).split(" ")[0]}</p>
        <Link className="group font-heading inline-flex h-10 w-max items-center justify-center rounded-md px-4 pt-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50" href="/settings">Settings</Link>
        <div className="group font-heading inline-flex h-10 w-max items-center justify-center rounded-md px-4 pt-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
          <LogoutButton />
        </div>
      </div>
      {children}
    </>
  )
}
