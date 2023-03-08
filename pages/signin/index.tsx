import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import {
  useState,
  MouseEvent,
  ChangeEvent,
  useEffect,
  useCallback,
} from "react";
import trpc from "../../lib/trpc";
import Schema from "../../schema/";
import Error from "../../components/Error/Error";
import Link from "next/link";
import getServerSessionAndUser from "@/utils/getServerSessionAndUser";
import { useRouter } from "next/router";

const SignIn: NextPage = () => {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    setUsernameError("");
    const r = Schema.UsernameSchema.safeParse(username);
    if (!r.success) setUsernameError(r.error.errors[0].message);
  }, [username]);

  useEffect(() => {
    setPasswordError("");
    const r = Schema.PasswordSchema.safeParse(password);
    if (!r.success) setPasswordError(r.error.errors[0].message);
  }, [password]);

  const inputRef = useCallback((node: HTMLInputElement | null) => {
    if (!node) return;
    node.focus();
  }, []);

  const { push } = useRouter();

  const {
    error,
    isError,
    isLoading: isSubmitting,
    isSuccess,
    mutate,
  } = trpc.auth.signIn.useMutation({
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      if (data.success === true) push(`/c/${data.username}`);
    },
  });

  const handleUsernameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUsername(e.target.value);
  };

  const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (usernameError || passwordError || isSubmitting) return;
    await mutate({ username, password });
  };

  return (
    <>
      <Head>
        <title>Sign in to Chirp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="fixed top-0 left-0 w-full h-full bg-gray-50">
        <div className="border border-gray-400 bg-white mx-8 mt-14 flex flex-col justify-center items-center">
          <h1 className="font-bold text-3xl my-7">Sign in to Chirp</h1>
          {isError ? <Error text={error.message} /> : null}
          <form className="flex flex-col items-center w-full">
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleUsernameInputChange}
              disabled={isSubmitting}
              required
              placeholder="Username"
              ref={inputRef}
              className={`border border-gray-300 rounded-md mt-6 w-8/12 px-2 py-1 text-md placeholder-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-200 focus:border-sky-500 focus:ring-sky-500`}
            />
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordInputChange}
              disabled={isSubmitting}
              placeholder="Password"
              required
              className={`border border-gray-300 rounded-md mt-6 w-8/12 px-2 py-1 text-md placeholder-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-200 focus:border-sky-500 focus:ring-sky-500`}
            />
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!!usernameError || !!passwordError || isSubmitting}
              className="py-3 w-8/12 my-5 bg-gray-900 rounded-md text-gray-50 hover:bg-gray-800 active:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 disabled:bg-gray-500"
            >
              Sign in
            </button>
          </form>
          <p className="text-gray-900 text-sm my-3">
            Don&apos;t have an account?
            <Link
              href="/signup"
              className="text-blue-500 underline decoration-dotted"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const sessionAndUser = await getServerSessionAndUser({ req, res });
  if (sessionAndUser?.session)
    return {
      redirect: {
        destination: `/c/${sessionAndUser.user.username}`,
        permanent: false,
      },
    };

  return { props: { user: null } };
};
