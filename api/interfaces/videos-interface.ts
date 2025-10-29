export interface VideosInterfaceResponse {
  id: number;
  title: string;
  description: string;
  video_url: string;
  poster: string;
  duration: number;
  points_reward: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VideoWatchInterfaceRequest {
  videoId: number;
}

export interface VideosStartInterfaceResponse {
  ad_view_id: number;
  video: {
    id: number;
    title: string;
    url: string;
    duration: number;
    points: number;
    poster: string;
  };
}

export interface VideosEndInterfaceResponse {
  required_seconds: number;
  watched_seconds: number;
  remaining_seconds: number;
  started_at: string;
  video: {
    id: number;
    title: string;
    duration: number;
    points: number;
  };
}

export interface VideosCancelInterfaceResponse {
  message: string;
  data: null;
}
