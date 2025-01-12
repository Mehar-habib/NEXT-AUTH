"use client";
import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function SettingPage() {
  const session = useSession();
  const onClick = () => {
    logout();
  };
  return (
    <div>
      {JSON.stringify(session)}
      <Button onClick={onClick} type="submit">
        Sign out
      </Button>
    </div>
  );
}
