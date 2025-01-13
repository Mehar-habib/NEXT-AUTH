import { currentUser } from "@/lib/auth";

export default async function ServerPage() {
  const user = await currentUser();
  return <div>{JSON.stringify(user)}</div>;
}
