export type User = {
  id: number,
  username: string,
  avatar: string,
  is_staff: boolean,
};

export type Image = {
  image_path: string,
};

export type Comment = {
  id: number,
  user: User,
  images: Image[],
  hearted: User[] | [],
  comment_text: string,
  created_at: string,
  post: number,
  reply_to: number,
  replies: Comment[],
};

export type PostItem = {
  id: number,
  types: 'feedbacks' | 'bugs',
  title: string,
  post_text: string,
  status: number,
  created_at: string,
  vote_count: number,
  comment_count: number,
};

export type PostDetail = {
  id: number,
  title: string,
  post_text: string,
  user: User,
  images: Image[],
  status: number,
  created_at: string,
  voted: User[],
  comments: Comment[],
}

export type Count = {
  feedbacksCount: number,
  bugsCount: number,
};

export type NotificationItem = {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  status?: number;
  message?: string;
};

export type CommentForm = {
  comment_text: string,
  user: User,
  post_id: string,
  image?: string,
};
