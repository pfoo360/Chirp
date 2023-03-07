import "@/styles/globals.css";
import type { AppProps, AppType } from "next/app";
import trpc from "../lib/trpc";
import UserProvider from "@/context/userProvider";
import { User } from "../types/";

interface PageProps {
  user: User | null;
  rest:
    | {
        [key: string]: any;
      }
    | Promise<{
        [key: string]: any;
      }>;
}

const App = ({
  Component,
  pageProps: { user, ...rest },
}: AppProps<PageProps>) => {
  return (
    <UserProvider value={user}>
      <Component {...rest} />
    </UserProvider>
  );
};

export default trpc.withTRPC(App);
