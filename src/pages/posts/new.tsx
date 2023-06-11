import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { CreatePostInput } from "../../schema/post.schema";
import { trpc } from "../../utils/trpc";
import Link from "next/link";

function CreatePostPage() {
  const { handleSubmit, register } = useForm<CreatePostInput>();
  const router = useRouter();

  const { mutate, error } = trpc["create-post"].useMutation();

  function onSubmit(values: CreatePostInput) {
    mutate(values, {
      onSuccess: ({ id }) => {
        router.push(`/posts/${id}`);
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && error.message}
      <Link href={"/posts"}>Go Back to All Posts</Link>
      <br />

      <h1>Create posts</h1>

      <input type="text" placeholder="Your post title" {...register("title")} />
      <br />
      <textarea placeholder="Your post title" {...register("body")} />
      <br />
      <button>Create post</button>
    </form>
  );
}

export default CreatePostPage;
