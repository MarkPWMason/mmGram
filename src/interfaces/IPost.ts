import IComment from "./IComment";

export default interface IPost {
    id: number;
    title: string;
    content: string;
    imageUrl: string;
    user_id: string;
    likes: number;
    comments: IComment[];
    hasLiked: boolean;
    isVideo: boolean
  }