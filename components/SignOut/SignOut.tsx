import { FC, MouseEvent } from "react";
import trpc from "../../lib/trpc";
import { useRouter } from "next/router";

const SignOut: FC = () => {
  const { push } = useRouter();
  const utils = trpc.useContext();
  const {
    error,
    isError,
    isLoading: isSubmitting,
    isSuccess,
    mutate,
  } = trpc.auth.signOut.useMutation({
    onError: (error) => {
      console.log(error);
      alert(error.message);
    },
    onSuccess: async (data) => {
      if (data.success === true) {
        await utils.invalidate();
        return push(`/signin`);
      }
    },
  });

  const handleSignOutButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {
    if (isSubmitting) return;
    mutate();
  };

  return (
    <button
      onClick={handleSignOutButtonClick}
      disabled={isSubmitting}
      className="py-3 w-8/12 my-5 bg-gray-900 rounded-md text-gray-50 hover:bg-gray-800 active:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 disabled:bg-gray-500"
    >
      Sign out
    </button>
  );
};

export default SignOut;
