"use client";

import { useEffect, useState } from "react";
import { addToast } from "@heroui/toast";
import { useDisclosure } from "@heroui/modal";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@heroui/spinner";

import WatchVideo from "./watch-video";
import VideoCard from "./video-card";
import ListMovieSkeleton from "./list-movie-skeleton";

import { useVideos } from "@/api/hooks/use-videos";
// import { useCompleteVideo } from "@/api/hooks/use-complete-video";
import { useStartVideo } from "@/api/hooks/use-start-video";
import { useCancelVideo } from "@/api/hooks/use-cancel-video";

export default function ListMovie() {
  const {
    isOpen: isOpenModalWatch,
    onOpen: onOpenModalWatch,
    onClose: onCloseModalWatch,
  } = useDisclosure();

  const [isTitle, setIsTitle] = useState<string>("");
  const [isVideoUrl, setIsVideoUrl] = useState<string>("");
  const [videoID, setVideoID] = useState<number>(0);

  const { ref, inView } = useInView();

  const {
    data,
    isError,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useVideos();

  const { mutate: mutateStart, isPending: isPendingStart } = useStartVideo({
    onSuccess: () => {
      onOpenModalWatch();
    },

    onError: () => {
      addToast({
        title: "Not Logged In",
        description: "Please login to watch the video.",
        color: "danger",
      });
    },
  });

  // const { mutate: mutateComplete } = useCompleteVideo({
  //   onSuccess: (data) => {
  //     console.log(data);
  //   },

  //   onError: (error) => {
  //     console.error("Error completing video view:", error);
  //   },
  // });

  const { mutate: mutateCancel } = useCancelVideo({
    onSuccess: () => {
      onCloseModalWatch();
    },

    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response!.data.message,
        color: "danger",
      });
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (isError) {
      addToast({
        title: "Error",
        description: (error as any)?.message || "Failed to fetch videos.",
        color: "danger",
      });
    }
  }, [isError, error]);

  if (isPending) {
    return <ListMovieSkeleton />;
  }

  const handleWatchMovie = (url: string, title: string, id: number) => {
    setIsVideoUrl(url);
    setIsTitle(title);
    mutateStart({ videoId: id });
    setVideoID(id);
  };

  return (
    <>
      {isOpenModalWatch && (
        <WatchVideo
          isOpen={isOpenModalWatch}
          mutateCancel={mutateCancel}
          title={isTitle}
          videoID={videoID}
          videoUrl={isVideoUrl}
          onClose={onCloseModalWatch}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.pages
          .flatMap((page) => page.data)
          .map((video) => (
            <VideoCard
              key={video.id}
              isPendingStart={isPendingStart}
              video={video}
              onWatch={() =>
                handleWatchMovie(video.video_url, video.title, video.id)
              }
            />
          ))}
      </div>

      {hasNextPage && (
        <div ref={ref} className="flex justify-center p-4">
          {isFetchingNextPage && <Spinner />}
        </div>
      )}
    </>
  );
}
