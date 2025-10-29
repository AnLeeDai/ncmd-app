import type { AxiosError } from "axios";

import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import { startViewVideo } from "@/api/services/videos";
import { ResponseInterface } from "@/api/interfaces/response-interface";
import {
  VideosStartInterfaceResponse,
  VideoWatchInterfaceRequest,
} from "@/api/interfaces/videos-interface";

export type ApiError = AxiosError<{ message: string }>;

export const useStartVideo = (
  options?: UseMutationOptions<
    ResponseInterface<VideosStartInterfaceResponse>,
    ApiError,
    VideoWatchInterfaceRequest,
    unknown
  >
): UseMutationResult<
  ResponseInterface<VideosStartInterfaceResponse>,
  ApiError,
  VideoWatchInterfaceRequest,
  unknown
> => {
  return useMutation({
    mutationFn: (VideoWatchInterfaceRequest) =>
      startViewVideo(VideoWatchInterfaceRequest),
    ...options,
  });
};
