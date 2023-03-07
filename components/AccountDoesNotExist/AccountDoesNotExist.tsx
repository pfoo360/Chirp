import { FC } from "react";
import NavBar from "../NavBar/NavBar";

const AccountDoesNotExist: FC = () => {
  return (
    <>
      <NavBar />
      <div className="w-full flex flex-col items-center mt-14">
        <div className="w-3/5">
          <p className="font-extrabold text-gray-900 px-5 text-3xl">
            This account doesn't exist
          </p>
          <p className="font-normal text-gray-500 px-5 text-base mt-1">
            Try searching for another.
          </p>
        </div>
      </div>
    </>
  );
};

export default AccountDoesNotExist;
