import { FC, useState, useRef, useCallback } from "react";
import useReadChirps from "@/hooks/useReadChirp";
import Card from "@/components/Card/Card";

interface ReadChipsProps {
  username: { id: string };
}

const ReadChirps: FC<ReadChipsProps> = ({ username }) => {
  const [userId, setUserId] = useState(username.id);

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
  } = useReadChirps({ userId });

  const observer = useRef<IntersectionObserver>();

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          await fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  return (
    <>
      {data &&
        data.pages.map((page, index) => {
          if (data.pages.length - 1 === index) {
            return page.chirps.map((chirp, index) => {
              if (page.chirps.length - 1 === index) {
                return (
                  <Card key={chirp.id} chirpInfo={chirp} ref={lastElementRef} />
                );
              }
              return <Card key={chirp.id} chirpInfo={chirp} />;
            });
          }
          return page.chirps.map((chirp, index) => {
            return <Card key={chirp.id} chirpInfo={chirp} />;
          });
        })}
      {isLoading ? (
        <div className="flex flex-row justify-center items-center">
          <p className="text-gray-900 text-sm">loading...</p>
        </div>
      ) : null}
    </>
  );
};

export default ReadChirps;
