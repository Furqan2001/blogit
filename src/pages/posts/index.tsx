import { useUserContext } from "@/context/user.context";
import Link from "next/link";
import { trpc } from "../../utils/trpc";

function PostListingPage() {
  const user = useUserContext();
  const { data, isLoading } = trpc["posts"].useQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {user && (
        <>
          <Link href="/posts/new">Create new post</Link>
          <br />
          <br />
        </>
      )}
      {data?.map((post) => {
        return (
          <article key={post.id}>
            <p>{post.title}</p>
            <Link href={`/posts/${post.id}`}>Read post</Link>
          </article>
        );
      })}
    </div>
  );
}

export default PostListingPage;
