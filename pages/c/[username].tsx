import { NextPage, GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import getServerSessionAndUser from "@/utils/getServerSessionAndUser";
import useUser from "@/hooks/useUser";
import NavBar from "@/components/NavBar/NavBar";
import CreateChirp from "@/components/CreateChirp/CreateChirp";
import ReadChirps from "@/components/ReadChirps/ReadChirps";
import Bio from "@/components/Bio/Bio";
import AccountDoesNotExist from "@/components/AccountDoesNotExist/AccountDoesNotExist";
import Head from "next/head";

interface UserPageProps {
  usernameNotFound: boolean;
  username: { id: string };
}

const UserPage: NextPage<UserPageProps> = ({ usernameNotFound, username }) => {
  const userCtx = useUser();

  if (usernameNotFound)
    return (
      <>
        <Head>
          <title>{` /Chirp`}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <AccountDoesNotExist />;
      </>
    );
  return (
    <>
      <Head>
        <title>{`Profile /Chirp`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <Bio username={username} />
      {userCtx?.id === username.id ? <CreateChirp /> : null}
      <ReadChirps username={username} />
    </>
  );
};

export default UserPage;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
  query,
}) => {
  const sessionAndUser = await getServerSessionAndUser({ req, res });

  if (!params?.username || typeof params.username !== "string")
    return {
      props: { usernameNotFound: true, user: sessionAndUser?.user || null },
    };

  const username = await prisma.user.findUnique({
    where: { username: params.username },
    select: { id: true },
  });
  if (!username)
    return {
      props: { usernameNotFound: true, user: sessionAndUser?.user || null },
    };

  return {
    props: {
      username,
      usernameNotFound: false,
      user: sessionAndUser?.user || null,
    },
  };
};
