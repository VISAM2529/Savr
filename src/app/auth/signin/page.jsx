"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function SignIn() {
  const {data:session} = useSession()
  const router = useRouter()
  if(session){
    router.push("/")
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <button
        onClick={() => signIn("google")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
}
