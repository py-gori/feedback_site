import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { SubmitHandler } from 'react-hook-form';
import {
  Avatar,
  Box,
  Divider,
  Icon,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { userDataAtom } from '@/recoil/auth/atoms';
import { useDetail } from '@/recoil/posts/dispatcher';
import type { Comment, User } from '@/module/types';
import Form from '@/module/elements/Form';
import ModalElement from '@/module/elements/ModalElement';
import PostDate from '@/utils/PostDate';
import CreateComment from './CreateComment';

type Inputs = {
  index: number;
  id: number;
  user_id: number;
};

const CommentList: React.FC<{comments: Comment[], postId: number}> = ({ comments, postId }) => {
  const user = useRecoilValue(userDataAtom);
  const [modalOpen, setModalOpen] = useState<boolean|string>(false);
  const [replyDisplay, setReplyDisplay] = useState(0);

  const { patchHeart } = useDetail();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const formData = new FormData();
    formData.set('hearted', user.id.toString());
    const commentId = data.id.toString();
    patchHeart(commentId, formData);
  };

  const renderHeartedUser = (comment: Comment) => {
    const img: JSX.Element[] = [];
    comment.hearted.forEach((heartedUser: User) => {
      img.push(
        <Avatar
          sx={{
            lineHeight: '20px',
            mb: '5px',
            mr: '3px',
            width: '20px',
            height: '20px',
          }}
          key={heartedUser.id}
          alt={heartedUser.username}
          src={heartedUser.avatar}
          title={heartedUser.username}
        />,
      );
    });
    return img;
  };

  const returnHeartIcon = (comment: Comment) => {
    let heartIcon = 'favorite_border';
    comment.hearted.forEach((commentUser: User) => {
      if (commentUser.id === user.id) {
        heartIcon = 'favorite';
      }
    });
    return heartIcon;
  };

  const handleClick = (id: number) => {
    setReplyDisplay(id);
  };

  const customStyle = (id: number) => {
    if (replyDisplay === id) {
      return { display: 'block' };
    }
    return { display: 'none' };
  };

  const commentItem = (comment: Comment, index: number): JSX.Element => {
    const postDate = new PostDate(comment.created_at);
    return (
      <>
        <ListItemAvatar>
          <Avatar
            alt={comment.user.username}
            src={comment.user.avatar}
            title={comment.user.username}
          />
        </ListItemAvatar>
        <div style={{ width: '100%' }}>
          <ListItemText
            className="detail-list-item-text-wrap"
            sx={{ display: 'flex', flexDirection: 'column' }}
            primary={(
              <Typography
                component="span"
                variant="body1"
                color="text.primary"
                sx={{ fontWeight: 700 }}
              >
                {comment.user.username}
              </Typography>
            )}
            secondary={(
              <Typography
                component="span"
                variant="body2"
                color="text.primary"
                className="activity-list-text"
                // className="detail-list-badge"
              >
                {comment.comment_text}
              </Typography>
            )}
          />
          <Box className="grid grid-cols-3">
            {comment.images && comment.images.map((image) => (
              <button key={image.image_path} style={{ outline: 'none' }} type="button" onClick={() => setModalOpen(() => `comment-${index}`)}>
                <img
                  alt="commentImage"
                  className="image-thumbnail"
                  src={image.image_path}
                />
              </button>
            ))}
          </Box>
          <ModalElement isOpen={(modalOpen === `comment-${index}`)} handleClose={() => setModalOpen(false)} label="comment-label">
            <Swiper
              spaceBetween={50}
              slidesPerView={1}
              pagination={{ clickable: true, dynamicBullets: true }}
              modules={[Navigation, Pagination]}
              navigation
              loop
            >
              {comment.images.map((image) => (
                <SwiperSlide key={image.image_path}>
                  <img alt="commentImage" className="image-thumbnail-modal" src={image.image_path} />
                </SwiperSlide>
              ))}
            </Swiper>
          </ModalElement>
          <div>
            <ul>
              <li className="activity-list-inline-item" title={comment.created_at}>{postDate.diffInDays()}</li>
              <li className="activity-list-inline-item">
                <button style={{ outline: 'none' }} type="button" onClick={() => handleClick(comment.id)}>
                  <Icon sx={{ fontSize: '18px' }}>
                    reply_icon
                  </Icon>
                  返信
                </button>
              </li>
              <Divider sx={{ mt: 1, mb: 1 }} />
            </ul>
          </div>
          <div className="hearted" style={{ display: 'flex' }}>
            <Form onSubmit={onSubmit}>
              {({ register }) => (
                <>
                  <input {...register('index')} type="hidden" value={index} />
                  <input {...register('id')} type="hidden" value={comment.id} />
                  <button type="submit" style={{ outline: 'none', paddingRight: '5px' }}>
                    <Icon sx={{ fontSize: '20px', color: 'text.primary' }}>
                      {returnHeartIcon(comment)}
                    </Icon>
                  </button>
                </>
              )}
            </Form>
            {renderHeartedUser(comment)}
          </div>
          <div className="reply-comment" style={customStyle(comment.id)}>
            <CreateComment
              postId={postId}
              commentId={comment.reply_to !== 0 ? comment.reply_to : comment.id}
            />
          </div>
        </div>
      </>
    );
  };

  const replyItems = (replies: Comment[]): JSX.Element => {
    return (
      <List
        className="activity-list"
        sx={{
          width: '100%',
          bgcolor: 'background.default',
          position: 'relative',
          overflow: 'auto',
          ml: 2,
          '& ul': { padding: 0 },
        }}
      >
        {replies.map((comment, index) => (
          <ListItem
            sx={{ padding: '1rem' }}
            key={comment.id}
            alignItems="flex-start"
            className="activity-list-item"
          >
            {commentItem(comment, index)}
          </ListItem>
        ))}
      </List>
    );
  };

  const listItems = (comment: Comment, index: number) => (
    <div key={comment.id}>
      <ListItem
        sx={{ padding: '1rem' }}
        alignItems="flex-start"
        className="activity-list-item"
      >
        {commentItem(comment, index)}
      </ListItem>
      {comment.replies && replyItems(comment.replies)}
    </div>
  );

  return (
    <List
      className="activity-list"
      sx={{
        width: '100%',
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'auto',
        '& ul': { padding: 0 },
      }}
    >
      {comments.map((comment, index) => (
        listItems(comment, index)
      ))}
    </List>
  );
};

export default CommentList;
