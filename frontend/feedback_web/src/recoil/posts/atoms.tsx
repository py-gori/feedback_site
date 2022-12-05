import axios from 'axios';
import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
} from 'recoil';

import type {
  Comment,
  PostItem,
  NotificationItem,
  PostDetail,
} from '@/module/types';

export const postsAtom = atom<PostItem[]>({
  key: 'postsAtom',
  default: selector<PostItem[]>({
    key: 'postsState',
    get: async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_URL_API}/posts/`);
        return res.data;
      } catch (error: any) {
        throw new Error(error);
      }
    },
  }),
});

export const postDetailAtom = atomFamily<PostDetail, string|undefined>({
  key: 'postDetailAtom',
  default: selectorFamily<PostDetail, string|undefined>({
    key: 'postDetailState',
    get: (postId) => async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_URL_API}/posts/${postId}/`);
        return res.data;
      } catch (error: any) {
        throw new Error(error);
      }
    },
  }),
});

export const commentsAtom = atom<Comment[]>({
  key: 'commentsAtom',
  default: [],
});

export const notificationsAtom = atom<NotificationItem[]>({
  key: 'notificationsAtom',
  default: [],
});
