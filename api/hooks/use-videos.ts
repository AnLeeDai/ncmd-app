import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import { fetchVideos } from "@/api/services/videos";
import {
  ResponseInterface,
  ErrorResponseInterface,
} from "@/api/interfaces/response-interface";
import { VideosInterfaceResponse } from "@/api/interfaces/videos-interface";

export type ApiError = ErrorResponseInterface | { message: string };

export const useVideos = (
  options?: UseQueryOptions<
    ResponseInterface<VideosInterfaceResponse[]>,
    ApiError
  >
): UseQueryResult<ResponseInterface<VideosInterfaceResponse[]>, ApiError> => {
  return useQuery<ResponseInterface<VideosInterfaceResponse[]>, ApiError>({
    queryKey: ["videos"],
    queryFn: fetchVideos,
    ...options,
  });
};
