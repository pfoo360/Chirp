import Head from "next/head";
import NavBar from "@/components/NavBar/NavBar";
import Link from "next/link";
import { GetServerSideProps } from "next/types";
import getServerSessionAndUser from "@/utils/getServerSessionAndUser";

export default function Home() {
  return (
    <>
      <Head>
        <title>About Chirp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <p className="text-sm font-semibold p-5 text-gray-900">
        <span className="font-extrabold text-sm text-gray-900">Chirp</span> is a
        very rudimentary Twitter clone. Users are able to view other user&apos;s
        &lsquo;chirps.&rsquo; If a user creates an account they can also create
        their own posts (max 240 character). Users can also update their display
        names, add a small bio, and update/delete their old chirps! <br />
        <br />
        Chirp is arguably the best social media app due to the fact that you
        cannot interact with other user&apos;s postings- therefore you can never
        take time out of your precious day getting into arguments with random
        internet netizens!
        <br />
        <br />
        On a serious note, this app was primarily an excuse to
        learn/test/implement tRPC and Zod. Both packages have been growing in
        popularity within the JS/TS world for their: (1)ease of use in building
        typesafe apis and (2)strong client-server relationship. I needed an
        excuse to explore both, which is why I created this basic app. Enjoy!
      </p>
      <Link
        href="https://github.com/pfoo360"
        className="text-base font-bold ml-5 text-gray-900 decoration-dotted hover:underline hover:cursor-pointer hover:text-sky-400"
      >
        Click here for my GitHub!
      </Link>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const sessionAndUser = await getServerSessionAndUser({ req, res });

  return {
    props: {
      user: sessionAndUser?.user || null,
    },
  };
};
