import instance from "@/libs/instance";
import { ResponseInterface } from "@/api/interfaces/response-interface";
import {
  VideosInterfaceResponse,
  VideosStartInterfaceResponse,
  VideosEndInterfaceResponse,
  VideosCancelInterfaceResponse,
  VideoWatchInterfaceRequest,
} from "@/api/interfaces/videos-interface";

// public/videos
const LIMIT = 10;

export const fetchVideos = async (
  pageParam: number
): Promise<ResponseInterface<VideosInterfaceResponse[]>> => {
  const response = await instance.get(
    `/public/videos?page=${pageParam}&per_page=${LIMIT}`
  );

  return response.data;
};

// private/videos/1/start-view
export const startViewVideo = async (
  request: VideoWatchInterfaceRequest
): Promise<ResponseInterface<VideosStartInterfaceResponse>> => {
  const response = await instance.post(`/private/videos/start-view`, request);

  return response.data;
};

// private/videos/1/complete-view
export const endViewVideo = async (
  request: VideoWatchInterfaceRequest
): Promise<ResponseInterface<VideosEndInterfaceResponse>> => {
  const response = await instance.post(
    `/private/videos/complete-view`,
    request
  );

  return response.data;
};

// private/videos/1/cancel-view
export const cancelViewVideo = async (
  request: VideoWatchInterfaceRequest,
): Promise<ResponseInterface<VideosCancelInterfaceResponse>> => {
  const response = await instance.post(`/private/videos/cancel-view`, request);

  return response.data;
};
