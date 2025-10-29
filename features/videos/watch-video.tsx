import { useEffect, useRef, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { addToast, closeToast } from "@heroui/toast";
import { Button } from "@heroui/button";

interface WatchVideoProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl?: string;
  videoID: number;
  captionsUrl?: string;
  mutateCancel: (args: { videoId: number }) => void;
}

export default function WatchVideo({
  isOpen,
  title,
  videoUrl,
  mutateCancel,
  videoID,
}: WatchVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastTimeRef = useRef(0);

  const [playing, setPlaying] = useState(false);
  const [sec, setSec] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const v = videoRef.current;

    if (!v) return;
    if (isOpen) {
      v.muted = muted;
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
      setPlaying(false);
    }
  }, [isOpen, muted]);

  useEffect(() => {
    const v = videoRef.current;

    if (!v) return;
    const onMeta = () =>
      setDuration(Number.isFinite(v.duration) ? Math.floor(v.duration) : null);
    const onTime = () => {
      lastTimeRef.current = v.currentTime;
      setSec(Math.floor(v.currentTime));
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onSeeking = () => {
      const safe = lastTimeRef.current || 0;

      requestAnimationFrame(() =>
        Math.abs(v.currentTime - safe) > 0.5 ? (v.currentTime = safe) : null
      );
    };

    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("seeking", onSeeking);

    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("seeking", onSeeking);
    };
  }, [videoUrl]);

  const togglePlay = () => {
    const v = videoRef.current;

    if (!v) return;
    v.paused ? v.play().catch(() => {}) : v.pause();
  };
  const toggleMuted = () => setMuted((m) => !m);
  const fmt = (s?: number | null) => {
    if (!s || !Number.isFinite(s)) return "0:00";
    const t = Math.floor(s);
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const ss = t % 60;

    return h
      ? `${h}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`
      : `${m}:${String(ss).padStart(2, "0")}`;
  };

  const handleConfirmCancelVideo = () => {
    const toastKey = addToast({
      title: "If you cancel now. you will lose your current progress.",
      description: (
        <div className="flex items-center gap-4 mt-4">
          <Button
            fullWidth
            color="primary"
            onPress={() => {
              if (toastKey) closeToast(toastKey);
            }}
          >
            Cancel
          </Button>

          <Button
            fullWidth
            color="secondary"
            onPress={() => {
              if (toastKey) closeToast(toastKey);
              handleCancelVideo();
            }}
          >
            Confirm
          </Button>
        </div>
      ),
      color: "warning",
    });
  };

  const handleCancelVideo = () => {
    mutateCancel({ videoId: videoID });
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={() => handleConfirmCancelVideo()}
    >
      <ModalContent className="max-w-full w-full">
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>

        <ModalBody className="p-0">
          {videoUrl ? (
            <div className="w-full h-[70vh] bg-content3 dark:bg-content2 flex items-center justify-center relative">
              <video
                ref={videoRef}
                autoPlay
                className="w-full h-full object-contain"
                controls={false}
                muted={muted}
                src={videoUrl}
              >
                <track
                  default
                  kind="captions"
                  src={videoUrl ?? ""}
                  srcLang="en"
                />
                Your browser does not support the video tag.
              </video>

              <div className="absolute bottom-4 left-4 flex items-center gap-3 bg-foreground/40 px-3 py-2 rounded">
                <button
                  aria-label={playing ? "Pause" : "Play"}
                  className="text-foreground w-8 h-8 flex items-center justify-center"
                  onClick={togglePlay}
                >
                  {playing ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <div className="text-foreground text-sm">{sec}s</div>
                <div className="text-foreground text-sm">/</div>
                <div className="text-foreground text-sm">{fmt(duration)}</div>

                <button
                  aria-label={muted ? "Unmute" : "Mute"}
                  className="text-foreground w-8 h-8 flex items-center justify-center"
                  onClick={toggleMuted}
                >
                  {muted ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M16.5 12c0-1.77-.77-3.36-1.98-4.44L13 9.08V6l-6 6h-2v2h2l6 6v-3.08l1.52 1.52C15.73 15.36 16.5 13.77 16.5 12z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M3 10v4h4l5 5V5L7 10H3z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-secondary p-4">
              No video URL provided.
            </p>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
