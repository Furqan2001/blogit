import { CreateUserInput } from "@/schema/user.schema";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Link from "next/link";

function Register() {
  const { handleSubmit, register } = useForm<CreateUserInput>();
  const { mutate, error } = trpc["register-user"].useMutation();
  const router = useRouter();

  function onSubmit(values: CreateUserInput) {
    mutate(values, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && error.message}
        <h1>Register</h1>
        <input
          type="email"
          placeholder="Enter your email"
          {...register("email")}
        />
        <br />
        <input
          type="text"
          placeholder="Enter your name"
          {...register("name")}
        />
        <br />
        <button type="submit">Register</button>
      </form>
      <Link href="/login">Login</Link>
    </>
  );
}

export default Register;
