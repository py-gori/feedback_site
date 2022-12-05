import axios, { AxiosResponse } from 'axios';
import { nanoid } from 'nanoid';
import _ from 'lodash';
import {
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

import {
  postsAtom,
  notificationsAtom,
  postDetailAtom,
  commentsAtom,
} from './atoms';
import { postDetailSelector } from './selectors';
import { userDataAtom } from '../auth/atoms';
import type { Comment, PostDetail } from '@/module/types';

export const usePost = () => {
  const [notifications, setNotifications] = useRecoilState(notificationsAtom);
  const posts = useRecoilValue(postsAtom);

  const getPostStatus = useRecoilCallback(
    () => (key: number) => {
      switch (key) {
        case 0:
          return { key: 0, className: 'review', name: 'レビュー中' };
        case 1:
          return { key: 1, className: 'in-progress', name: '対応中' };
        case 2:
          return { key: 2, className: 'complete', name: '完了' };
        case 3:
          return { key: 3, className: 'skip', name: '見送り' };
        default:
          return { key: 0, className: 'review', name: 'レビュー中' };
      }
    },
  );

  const postNewPost = useRecoilCallback(
    ({ set }) => async (formData: FormData) => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_URL_API}/posts/`, formData);
        delete res.data.voted;
        delete res.data.images;
        delete res.data.user;
        const tmpPosts = _.cloneDeep(posts);
        tmpPosts.push(res.data);
        set(postsAtom, tmpPosts);
        setNotifications([...notifications, {
          id: nanoid(),
          type: 'success',
          title: 'Post Created',
        }]);
      } catch (e: any) {
        setNotifications([...notifications, {
          id: nanoid(),
          type: 'error',
          title: 'Post Failed',
          status: e.response.status,
          message: JSON.stringify(e.response.data),
        }]);
      }
    },
  );

  return {
    getPostStatus,
    postNewPost,
  };
};

export const useDetail = () => {
  const [notifications, setNotifications] = useRecoilState(notificationsAtom);
  const selfUser = useRecoilValue(userDataAtom);

  const getUpdateComments = (currentPost: PostDetail, res: AxiosResponse<Comment>) => {
    const comments = currentPost.comments.map((comment: Comment) => {
      const tmpComment = _.cloneDeep(comment);
      if (comment.id === res.data.id) {
        tmpComment.hearted = res.data.hearted;
        return tmpComment;
      }
      if (comment.replies && comment.replies.length !== 0) {
        const tmpReplies: Comment[] = comment.replies.map((rep) => {
          if (rep.id === res.data.id) {
            return res.data;
          }
          return rep;
        });
        tmpComment.replies = tmpReplies;
        return tmpComment;
      }
      return comment;
    });
    return comments;
  };

  const patchVote = useRecoilCallback(
    ({ set, snapshot }) => async (postId: string|undefined, formData: FormData) => {
      const prevComments = snapshot.getLoadable(commentsAtom);
      try {
        const res = await axios.patch(`${process.env.REACT_APP_URL_API}/posts/${postId}/`, formData);
        res.data.comments = prevComments.contents;
        res.data.user = selfUser;
        set(postDetailSelector(postId), res.data);
      } catch (e: any) {
        setNotifications([...notifications, {
          id: nanoid(),
          type: 'error',
          title: 'Vote Failed',
          status: e.response.status,
          message: JSON.stringify(e.response.data),
        }]);
      }
    },
  );

  const postNewComment = useRecoilCallback(
    ({ set, snapshot }) => async (formData: FormData) => {
      const releace = snapshot.retain();
      try {
        const res = await axios.post(`${process.env.REACT_APP_URL_API}/comments/`, formData);
        const postId = res.data.post.toString();
        const currentPost = await snapshot.getPromise(postDetailSelector(postId));
        res.data.user = selfUser;
        set(
          postDetailSelector(postId),
          { ...currentPost, comments: [...currentPost.comments, res.data] },
        );
        setNotifications([...notifications, {
          id: nanoid(),
          type: 'success',
          title: 'Comment Created',
        }]);
      } catch (e: any) {
        setNotifications([...notifications, {
          id: nanoid(),
          type: 'error',
          title: 'Comment Failed',
          status: e.response.status,
          message: JSON.stringify(e.response.data),
        }]);
      } finally {
        releace();
      }
    },
  );

  const patchHeart = useRecoilCallback(
    ({ set, snapshot }) => async (commentId: string, formData: FormData) => {
      const releace = snapshot.retain();
      try {
        const res = await axios.patch(`${process.env.REACT_APP_URL_API}/comments/${commentId}/`, formData);
        const postId = res.data.post.toString();
        res.data.user = selfUser;
        const currentPost = await snapshot.getPromise(postDetailSelector(postId));
        const updateComments = getUpdateComments(currentPost, res);
        set(postDetailSelector(postId), { ...currentPost, comments: updateComments });
      } catch (e: any) {
        setNotifications([...notifications, {
          id: nanoid(),
          type: 'error',
          title: 'Heart Failed',
          status: e.response.status,
          message: JSON.stringify(e.response.data),
        }]);
      } finally {
        releace();
      }
    },
  );

  const updateStatus = useRecoilCallback(
    ({ set, snapshot }) => async (formData: FormData) => {
      const releace = snapshot.retain();
      try {
        const postId = formData.get('post')?.toString();
        const postResult = await axios.patch(`${process.env.REACT_APP_URL_API}/posts/${postId}/`, { status: formData.get('status') });
        formData.delete('status');
        const commentResult = await axios.post(`${process.env.REACT_APP_URL_API}/comments/`, formData);
        const currentPost = await snapshot.getPromise(postDetailSelector(postId));
        commentResult.data.user = selfUser;
        set(
          postDetailSelector(postId),
          {
            ...currentPost,
            status: postResult.data.status,
            comments: [...currentPost.comments, commentResult.data],
          },
        );
        setNotifications([...notifications, {
          id: nanoid(),
          type: 'success',
          title: 'Status Updated & Comment Created',
        }]);
      } catch (e: any) {
        setNotifications([...notifications, {
          id: nanoid(),
          type: 'error',
          title: 'Status Update Failed',
          status: e.response.status,
          message: JSON.stringify(e.response.data),
        }]);
      } finally {
        releace();
      }
    },
  );

  const removeDetail = useRecoilCallback(
    ({ reset }) => (postId: string|undefined) => {
      reset(postDetailAtom(postId));
    },
  );
  return {
    patchVote,
    patchHeart,
    postNewComment,
    updateStatus,
    removeDetail,
  };
};
