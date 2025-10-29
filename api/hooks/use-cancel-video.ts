import type { AxiosError } from "axios";

import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import { cancelViewVideo } from "@/api/services/videos";
import { ResponseInterface } from "@/api/interfaces/response-interface";
import {
  VideosCancelInterfaceResponse,
  VideoWatchInterfaceRequest,
} from "@/api/interfaces/videos-interface";

export type ApiError = AxiosError<{ message: string }>;

export const useCancelVideo = (
  options?: UseMutationOptions<
    ResponseInterface<VideosCancelInterfaceResponse>,
    ApiError,
    VideoWatchInterfaceRequest,
    unknown
  >,
): UseMutationResult<
  ResponseInterface<VideosCancelInterfaceResponse>,
  ApiError,
  VideoWatchInterfaceRequest,
  unknown
> => {
  return useMutation({
    mutationFn: (request: VideoWatchInterfaceRequest) =>
      cancelViewVideo(request),
    ...options,
  });
};
