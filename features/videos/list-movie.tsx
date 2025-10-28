"use client";

import { useEffect, useState } from "react";
import { useVideos } from "@/api/hooks/use-videos";
import { addToast } from "@heroui/toast";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";
import { Chip } from "@heroui/chip";
import { useDisclosure } from "@heroui/modal";
import WatchVideo from "./watch-video";

export default function ListMovie() {
  const { data, isError, isLoading } = useVideos();

  const {
    isOpen: isOpenModalWatch,
    onOpen: onOpenModalWatch,
    onClose: onCloseModalWatch,
  } = useDisclosure();

  const [isTitle, setIsTitle] = useState<string>("");
  const [isVideoUrl, setIsVideoUrl] = useState<string>("");

  useEffect(() => {
    if (isError) {
      addToast({
        title: "Error",
        description: data?.message || "Failed to fetch videos.",
        color: "danger",
      });
    }
  }, [isError]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Card key={idx} className="overflow-hidden animate-pulse">
            <CardHeader className="p-0">
              <Skeleton className="w-full aspect-video" />
            </CardHeader>
            <CardBody>
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardBody>
            <CardFooter className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-24 rounded" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const mm = String(mins).padStart(2, "0");
    const ss = String(secs).padStart(2, "0");
    return hrs > 0 ? `${hrs}:${mm}:${ss}` : `${mins}:${ss}`;
  };

  if (!data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center">
        No videos available.
      </div>
    );
  }

  const handleWatchMovie = (url: string, title: string) => {
    onOpenModalWatch();
    setIsVideoUrl(url);
    setIsTitle(title);
  };

  return (
    <>
      {isOpenModalWatch && (
        <WatchVideo
          isOpen={isOpenModalWatch}
          onClose={onCloseModalWatch}
          title={isTitle}
          videoUrl={isVideoUrl}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.data.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative">
                <Image
                  isLoading={isLoading}
                  src="https://placehold.co/600x400"
                  alt={video.title}
                  className="w-full object-cover aspect-video"
                />
                <Chip
                  className="absolute top-3 left-3"
                  style={{ zIndex: 1000 }}
                  color="warning"
                >
                  {video.points} point
                </Chip>
                <Chip
                  className="absolute top-3 right-3"
                  style={{ zIndex: 1000 }}
                  color="primary"
                >
                  {formatDuration(video.duration)}
                </Chip>
              </div>
            </CardHeader>
            <CardBody>
              <h3 className="text-lg font-semibold leading-tight line-clamp-2">
                {video.title}
              </h3>
            </CardBody>
            <CardFooter className="flex items-center justify-between">
              <div className="text-sm text-secondary">
                Duration: {formatDuration(video.duration)}
              </div>
              <Button
                color="success"
                onPress={() => handleWatchMovie(video.url, video.title)}
              >
                Watch
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
