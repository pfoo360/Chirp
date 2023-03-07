import trpc from "@/lib/trpc";
import { useState, useEffect } from "react";
import { RouterOutputs, RouterInputs } from "@/types";

type UseReadChirpsArgs = RouterInputs["chirp"]["readChirp"];

const useReadChirp = ({ userId }: UseReadChirpsArgs) => {
  const {
    data,
    dataUpdatedAt,
    error,
    fetchNextPage,
    fetchStatus,
    isError,
    isFetched,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    hasNextPage,
  } = trpc.chirp.readChirp.useInfiniteQuery(
    { userId },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );
  return {
    data,
    dataUpdatedAt,
    error,
    fetchNextPage,
    fetchStatus,
    isError,
    isFetched,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    hasNextPage,
  };
};

export default useReadChirp;
