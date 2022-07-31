/* eslint no-param-reassign: ["error", { "props": false }] */
import _ from 'lodash';
import {
  DefaultValue,
  selector,
  selectorFamily,
} from 'recoil';

import {
  postsAtom,
  postDetailAtom,
} from './atoms';
import type { Comment, PostDetail, PostItem } from '@/module/types';

export const countByCategorySelector = selector({
  key: 'countByCategorySelector',
  get: ({ get }) => {
    const posts = get(postsAtom);
    let [feedbacksCount, bugsCount] = [0, 0];
    if (posts.length === 0) {
      return { feedbacksCount, bugsCount };
    }
    posts.map((post) => {
      switch (post.types) {
        case 'feedbacks':
          feedbacksCount += 1;
          break;
        case 'bugs':
          bugsCount += 1;
          break;
        default:
          break;
      }
    });
    return { feedbacksCount, bugsCount };
  },
});

export const postCategoryFilter = selectorFamily({
  key: 'postCategoryFilter',
  get: (category) => ({ get }) => {
    const posts = get(postsAtom);

    switch (category) {
      case 'feedbacks':
        return posts.filter((post) => post.types === 'feedbacks');
      case 'bugs':
        return posts.filter((post) => post.types === 'bugs');
      default:
        return posts;
    }
  },
});

export const roadmapPostsSelector = selectorFamily<PostItem[], string>({
  key: 'roadmapPostsSelector',
  get: (keyword) => ({ get }) => {
    const posts = get(postsAtom);

    if (keyword === '') {
      return posts;
    }

    const searchKeywords = keyword.trim().toLowerCase().match(/[^\s]+/g);
    if (searchKeywords === null) {
      return posts;
    }

    const result = posts.filter((post) => (
      searchKeywords.every((kw) => post.title.toLowerCase().indexOf(kw) !== -1)
    ));
    return result;
  },
});

export const commentsSortSelector = selectorFamily<Comment[], Comment[]>({
  key: 'commentsSortSelector',
  get: (comments) => () => {
    const parentComments: Comment[] = [];
    const replyComments: Comment[] = [];
    const result: Comment[] = [];
    comments.forEach((c) => {
      const comment = _.cloneDeep(c);
      if (!comment.replies) {
        comment.replies = [];
      }
      if (comment.replies.length !== 0 || comment.reply_to === 0) {
        parentComments.push(comment);
        return;
      }
      replyComments.push(comment);
    });
    parentComments.forEach((comment) => {
      replyComments.forEach((repComment) => {
        if (comment.id === repComment.reply_to) {
          comment.replies.push(repComment);
        }
      });
      result.push(comment);
    });
    return result;
  },
});

export const postDetailSelector = selectorFamily<PostDetail, string|undefined>({
  key: 'postDetailSelector',
  get: (postId) => ({ get }) => {
    // return get(postDetailAtom(postId));
    const p = get(postDetailAtom(postId));
    const postDetail = _.cloneDeep(p);
    postDetail.comments = get(commentsSortSelector(postDetail.comments));
    return postDetail;
  },
  set: (postId) => ({ get, set, reset }, newValue) => {
    if (newValue instanceof DefaultValue) {
      reset(postDetailAtom(postId));
      return;
    }
    const newComments = get(commentsSortSelector(newValue.comments));
    set(postDetailAtom(postId), {
      id: newValue.id,
      title: newValue.title,
      post_text: newValue.post_text,
      user: newValue.user,
      images: newValue.images,
      status: newValue.status,
      created_at: newValue.created_at,
      voted: newValue.voted,
      // comments: newValue.comments,
      comments: newComments,
    });
    // patchHaert後にDetail更新する為に必要
    // set(commentsAtom, newComments);
  },
});
