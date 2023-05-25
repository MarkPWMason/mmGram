export default interface IComment {
    id: number;
    user_id: string;
    username: string;
    comment: string;
    children: IComment[];
  }