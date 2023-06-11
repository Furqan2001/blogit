import { useState } from "react";
import { RequestOtpInput } from "@/schema/user.schema";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

function VerifyToken({ hash }: { hash: string }) {
  const router = useRouter();

  const { data, error, isLoading } = trpc["verify-otp"].useQuery({
    hash: hash,
  });

  if (isLoading) return <div>Verifying...</div>;

  router.push(data?.redirect.includes("login") ? "/" : data?.redirect || "/");

  return <p>Redirecting...</p>;
}

function LoginForm() {
  const { handleSubmit, register } = useForm<RequestOtpInput>();
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { mutate, error } = trpc["request-otp"].useMutation();

  function onSubmit(values: RequestOtpInput) {
    mutate(
      { ...values, redirect: router.asPath },
      {
        onSuccess: () => {
          setSuccess(true);
        },
      }
    );
  }

  const hash = router.asPath.split("#token=")[1];

  if (hash) return <VerifyToken hash={hash} />;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && error.message}
        {success && <p>Check your email</p>}
        <h1>Login</h1>
        <input
          type="email"
          placeholder="Enter your email"
          {...register("email")}
        />
        <br />
        <button type="submit">Login</button>
      </form>
      <Link href="/register">Register</Link>
    </>
  );
}

export default LoginForm;
