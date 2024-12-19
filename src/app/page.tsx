"use client";
import LoginButton from "@/components/auth/loginButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[conic-gradient(at_top, _var(--tw-gradient-stops))] from-neutral-900 via-neutral-600 to-neutral-900">
      <div className="space-y-6 text-center">
        <h1
          className={cn("text-6xl font-semibold text-gray-300 drop-shadow-md")}
        >
          🔏 Auth
        </h1>
        <p className="text-white text-lg">A simple authentication system</p>
        <div>
          <LoginButton>
            <Button variant={"secondary"} size={"lg"}>
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
