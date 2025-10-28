import instance from "@/libs/instance";
import { ResponseInterface } from "@/api/interfaces/response-interface";
import { VideosInterfaceResponse } from "@/api/interfaces/videos-interface";

export const fetchVideos = async (): Promise<
  ResponseInterface<VideosInterfaceResponse[]>
> => {
  const response = await instance.get("/public/videos");

  return response.data as ResponseInterface<VideosInterfaceResponse[]>;
};
