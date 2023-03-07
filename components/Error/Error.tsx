import { FC } from "react";

interface ErrorProps {
  text: string;
}

const Error: FC<ErrorProps> = ({ text }) => {
  return <p className="text-rose-500 text-xs">{text}</p>;
};

export default Error;
