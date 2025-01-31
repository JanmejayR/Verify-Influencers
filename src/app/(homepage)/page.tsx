'use client'
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="h-screen w-full flex flex-col items-center justify-center text-center space-y-6">
      <h1 className="text-4xl font-bold">Welcome to Verify Influencers</h1>
      <h2 className="text-lg">Your one stop for finding trustable influencers</h2>

      <div className="space-y-4">
        <Button
          className="text-base flex gap-x-2"
          onClick={() => { router.push("/auth/sign-in") }}
        >
          <User fill="#000" />
          Login
        </Button>

        <Button
          className="text-base flex gap-x-2"
          onClick={() => { router.push("/auth/sign-up") }}
        >
          <User fill="#000" />
          Signup
        </Button>
      </div>
    </main>
  );
}
