import { useInView } from "react-intersection-observer";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";

import { VideosInterfaceResponse } from "@/api/interfaces/videos-interface";

interface VideoCardProps {
  video: VideosInterfaceResponse;
  onWatch: (url: string, title: string) => void;
  isPendingStart: boolean;
}

export default function VideoCard({
  video,
  onWatch,
  isPendingStart,
}: VideoCardProps) {
  const { ref, inView } = useInView({ triggerOnce: true });

  const formatDuration = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const mm = String(mins).padStart(2, "0");
    const ss = String(secs).padStart(2, "0");

    return hrs > 0 ? `${hrs}:${mm}:${ss}` : `${mins}:${ss}`;
  };

  return (
    <Card className="overflow-hidden" shadow="sm">
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            ref={ref}
            alt={video.title}
            className="w-full object-cover aspect-video"
            isLoading={!inView}
            src={inView ? video.poster : "https://placehold.co/600x400"}
          />
          <Chip
            className="absolute top-3 left-3"
            color="warning"
            style={{ zIndex: 1000 }}
          >
            {video.points_reward} point
          </Chip>
          <Chip
            className="absolute top-3 right-3"
            color="primary"
            style={{ zIndex: 1000 }}
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
          isLoading={isPendingStart}
          onPress={() => onWatch(video.video_url, video.title)}
        >
          Watch
        </Button>
      </CardFooter>
    </Card>
  );
}
