import { GetServerSideProps, NextPage } from "next";
import {
  useState,
  ChangeEvent,
  useEffect,
  MouseEvent,
  useCallback,
} from "react";
import Schema from "../../schema";
import Error from "../../components/Error/Error";
import { z } from "zod";
import trpc from "../../lib/trpc";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import getServerSessionAndUser from "@/utils/getServerSessionAndUser";

const SignUp: NextPage = () => {
  const { push } = useRouter();

  const [username, setUsername] = useState("");
  const [usernameBlur, setUsernameBlur] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  useEffect(() => {
    setUsernameError("");
    const r = Schema.UsernameSchema.safeParse(username);
    if (!r.success) setUsernameError(r.error.errors[0].message);
  }, [username]);

  const [email, setEmail] = useState("");
  const [emailBlur, setEmailBlur] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    setEmailError("");
    const r = Schema.EmailSchema.safeParse(email);
    if (!r.success) setEmailError(r.error.errors[0].message);
  }, [email]);

  const [password, setPassword] = useState("");
  const [passwordBlur, setPasswordBlur] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    setPasswordError("");
    const r = Schema.PasswordSchema.safeParse(password);
    if (!r.success) setPasswordError(r.error.errors[0].message);
  }, [password]);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordBlur, setConfirmPasswordBlur] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  useEffect(() => {
    setConfirmPasswordError("");
    if (!confirmPassword) setConfirmPasswordError("Required.");
    const confirmPasswordSchema = z.string();
    const r = confirmPasswordSchema.safeParse(confirmPassword);
    if (!r.success) setConfirmPasswordError(r.error.errors[0].message);
    if (confirmPassword !== password)
      setConfirmPasswordError("Does not match.");
  }, [confirmPassword, password]);

  const inputRef = useCallback((node: HTMLInputElement | null) => {
    if (!node) return;
    node.focus();
  }, []);

  const handleUsernameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUsername(e.target.value);
  };

  const handleUsernameInputBlur = () => {
    if (usernameBlur === true) return;
    setUsernameBlur(true);
  };

  const handleEmailInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const handleEmailInputBlur = () => {
    if (emailBlur === true) return;
    setEmailBlur(true);
  };

  const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const handlePasswordInputBlur = () => {
    if (passwordBlur === true) return;
    setPasswordBlur(true);
  };

  const handleConfirmPasswordInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    setConfirmPassword(e.target.value);
  };

  const handleConfirmPasswordInputBlur = () => {
    if (confirmPasswordBlur === true) return;
    setConfirmPasswordBlur(true);
  };

  const {
    error,
    isError,
    isLoading: isSubmitting,
    isSuccess,
    mutate,
  } = trpc.user.createAccount.useMutation({
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      if (data.success) return push("/signin");
    },
  });

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (
      usernameError ||
      emailError ||
      passwordError ||
      confirmPasswordError ||
      isSubmitting
    )
      return;

    await mutate({ email, password, username });
  };

  return (
    <>
      <Head>
        <title>Sign up for Chirp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="fixed top-0 left-0 w-full h-full bg-gray-50">
        <div className="border border-gray-400 bg-white mx-8 mt-14 flex flex-col justify-center items-center">
          <h1 className="font-bold text-3xl my-7">Join Chirp today</h1>
          {isError ? <Error text={error.message} /> : null}
          <form className="flex flex-col items-center w-full">
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleUsernameInputChange}
              onBlur={handleUsernameInputBlur}
              disabled={isSubmitting}
              placeholder="Username"
              required
              ref={inputRef}
              className={`border border-gray-300 rounded-md mt-6 w-8/12 px-2 py-1 text-md placeholder-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-200 focus:border-sky-500 focus:ring-sky-500  ${
                usernameBlur && usernameError
                  ? `focus:border-rose-500 focus:ring-rose-500 border-rose-500`
                  : null
              }`}
            />
            {usernameBlur && usernameError ? (
              <Error text={usernameError} />
            ) : null}
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailInputChange}
              onBlur={handleEmailInputBlur}
              disabled={isSubmitting}
              placeholder="Email"
              required
              className={`border border-gray-300 rounded-md mt-6 w-8/12 px-2 py-1 text-md placeholder-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-200 focus:border-sky-500 focus:ring-sky-500  ${
                emailBlur && emailError
                  ? `focus:border-rose-500 focus:ring-rose-500 border-rose-500`
                  : null
              }`}
            />
            {emailBlur && emailError ? <Error text={emailError} /> : null}
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordInputChange}
              onBlur={handlePasswordInputBlur}
              disabled={isSubmitting}
              placeholder="Password"
              required
              className={`border border-gray-300 rounded-md mt-6 w-8/12 px-2 py-1 text-md placeholder-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-200 focus:border-sky-500 focus:ring-sky-500  ${
                passwordBlur && passwordError
                  ? `focus:border-rose-500 focus:ring-rose-500 border-rose-500`
                  : null
              }`}
            />
            {passwordBlur && passwordError ? (
              <Error text={passwordError} />
            ) : null}
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordInputChange}
              onBlur={handleConfirmPasswordInputBlur}
              disabled={isSubmitting}
              placeholder="Confirm password"
              required
              className={`border border-gray-300 rounded-md mt-6 w-8/12 px-2 py-1 text-md placeholder-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-200 focus:border-sky-500 focus:ring-sky-500  ${
                confirmPasswordBlur && confirmPasswordError
                  ? `focus:border-rose-500 focus:ring-rose-500 border-rose-500`
                  : null
              }`}
            />
            {confirmPasswordBlur && confirmPasswordError ? (
              <Error text={confirmPasswordError} />
            ) : null}
            <button
              type="submit"
              disabled={
                !!usernameError ||
                !!emailError ||
                !!passwordError ||
                !!confirmPasswordError ||
                isSubmitting
              }
              onClick={handleSubmit}
              className="py-3 w-8/12 my-5 bg-gray-900 rounded-md text-gray-50 hover:bg-gray-800 active:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 disabled:bg-gray-500"
            >
              Sign up
            </button>
          </form>
          <p className="text-gray-900 text-sm my-3">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-blue-500 underline decoration-dotted"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;

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
