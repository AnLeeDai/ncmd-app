import type { AxiosError } from "axios";

import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import { endViewVideo } from "@/api/services/videos";
import { ResponseInterface } from "@/api/interfaces/response-interface";
import {
  VideosEndInterfaceResponse,
  VideoWatchInterfaceRequest,
} from "@/api/interfaces/videos-interface";

export type ApiError = AxiosError<{ message: string }>;

export const useCompleteVideo = (
  options?: UseMutationOptions<
    ResponseInterface<VideosEndInterfaceResponse>,
    ApiError,
    VideoWatchInterfaceRequest,
    unknown
  >
): UseMutationResult<
  ResponseInterface<VideosEndInterfaceResponse>,
  ApiError,
  VideoWatchInterfaceRequest,
  unknown
> => {
  return useMutation({
    mutationFn: (request: VideoWatchInterfaceRequest) => endViewVideo(request),
    ...options,
  });
};
