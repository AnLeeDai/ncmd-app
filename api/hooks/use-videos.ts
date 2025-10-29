import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  InfiniteData,
} from "@tanstack/react-query";

import { fetchVideos } from "@/api/services/videos";
import {
  ResponseInterface,
  ErrorResponseInterface,
} from "@/api/interfaces/response-interface";
import { VideosInterfaceResponse } from "@/api/interfaces/videos-interface";

export type ApiError = ErrorResponseInterface | { message: string };

export const useVideos = (
  options?: any,
): UseInfiniteQueryResult<
  InfiniteData<ResponseInterface<VideosInterfaceResponse[]>, number>,
  ApiError
> => {
  return useInfiniteQuery<
    ResponseInterface<VideosInterfaceResponse[]>,
    ApiError,
    InfiniteData<ResponseInterface<VideosInterfaceResponse[]>, number>,
    readonly unknown[],
    number
  >({
    queryKey: ["videos"],
    queryFn: ({ pageParam }) => fetchVideos(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages) => {
      const pagination = (
        lastPage as ResponseInterface<VideosInterfaceResponse[]>
      ).pagination;

      if (pagination && pagination.current_page < pagination.last_page) {
        return pagination.current_page + 1;
      }

      return undefined;
    },
    ...options,
  });
};
