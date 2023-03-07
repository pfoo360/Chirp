import useUser from "@/hooks/useUser";
import { FC } from "react";
import Link from "next/link";
import SignOut from "@/components/SignOut/SignOut";

const NavBar: FC = () => {
  const userCtx = useUser();
  const content = userCtx ? (
    <SignOut />
  ) : (
    <div className="flex flex-row my-5">
      <Link
        href="/signin"
        className="bg-sky-500 px-6 py-3 mx-5 rounded-l-full rounded-r-full border-2 border-sky-200 text-gray-50 font-bold hover:bg-sky-300 active:bg-sky-200 focus:outline-none"
      >
        Sign in
      </Link>
      <Link
        href="/signup"
        className="bg-gray-100 px-6 py-3 mx-5 rounded-l-full rounded-r-full text-gray-900 font-bold hover:bg-gray-200 active:bg-gray-200 focus:outline-none"
      >
        Sign up
      </Link>
    </div>
  );

  return (
    <div className="w-full flex flex-col justify-center items-center bg-gray-50">
      {content}
      <div className="h-px w-11/12 bg-gray-200 opacity-75 mb-5"></div>
    </div>
  );

  return <div></div>;
};

export default NavBar;
