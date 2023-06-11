import { trpc } from "@/utils/trpc";
import { useUserContext } from "@/context/user.context";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default function Home() {
  const user = useUserContext();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div>
      <Link href="/posts">All Posts</Link>
      <br />
      <Link href="/posts/new">Create post</Link>
    </div>
  );
}
