import Error from "next/error";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Link from "next/link";

function SinglePostPage() {
  const router = useRouter();

  const postId = router.query.postId as string;

  const { data, isLoading } = trpc["single-post"].useQuery({ postId });

  if (isLoading) {
    return <p>Loading posts...</p>;
  }

  if (!data) {
    return <Error statusCode={404} />;
  }

  return (
    <div>
      <Link href={"/posts"}>Go Back to All Posts</Link>
      <br />
      <h1>{data?.title}</h1>
      <p>{data?.body}</p>
    </div>
  );
}

export default SinglePostPage;
