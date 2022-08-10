import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue, useRecoilState } from 'recoil';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  Avatar,
  Box,
  Icon,
  Typography,
} from '@mui/material';

import { userDataAtom } from '@/recoil/auth/atoms';
import { postDetailSelector } from '@/recoil/posts/selectors';
import { usePost, useDetail } from '@/recoil/posts/dispatcher';
import Form from '@/module/elements/Form';
import compareValues from '@/utils/compareValues';
// import diffInDays from '@/utils/diffInDays';
import PostDate from '@/utils/PostDate';
import ModalElement from '@/module/elements/ModalElement';

import CategoryFilter from './components/CategoryFilter';
import CommentList from './components/CommentList';
import VotedList from './components/VotedList';
import CreateComment from './components/CreateComment';
import { commentsAtom } from '@/recoil/posts/atoms';
import ChangeStatus from './components/ChangeStatus';

const Detail: React.FC = () => {
  const postId = useParams().id;
  const [modalOpen, setModalOpen] = useState<boolean|string>(false);
  const postDetail = useRecoilValue(postDetailSelector(postId));
  const [listComments, setListComments] = useRecoilState(commentsAtom);
  const user = useRecoilValue(userDataAtom);
  const { getPostStatus } = usePost();
  const { patchVote } = useDetail();
  const postDate = new PostDate(postDetail.created_at);

  useEffect(() => {
    setListComments(postDetail.comments);
  }, [postDetail, setListComments]);

  const onSubmit = () => {
    const formData = new FormData();
    formData.set('voted', user.id.toString());
    patchVote(postId, formData);
  };

  // const formatDate = (date: string) => {
  //   const d = new Date(date);
  //   const year = d.getFullYear();
  //   const month = (`0${d.getMonth() + 1}`).slice(-2);
  //   const day = (`0${d.getDate()}`).slice(-2);
  //   return `${year}-${month}-${day}`;
  // };

  const handleSort = async (order: string) => {
    const comments = listComments.slice().sort(compareValues('created_at', order));
    setListComments(comments);
  };

  return (
    <Box bgcolor="background.paper" className="details">
      <CategoryFilter />

      <section className="details-section">
        <Box
          sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row-reverse' } }}
          className="l-inner"
        >
          <VotedList votedUsers={postDetail.voted} />
          <Box
            sx={{ width: { xs: '100%', sm: '70%' } }}
            // className="details-text"
          >
            <div className="detail-items">
              <Box bgcolor="background.default" className="detail-item-content">
                <div className="detail-item-title-wrap">
                  <Box
                    className="detail-list-item-vote"
                    bgcolor="background.default"
                  >
                    <Form onSubmit={onSubmit}>
                      {() => (
                        <button type="submit" style={{ outline: 'none' }}>
                          <Icon sx={{ fontSize: '25px', color: 'text.primary' }}>expand_less</Icon>
                          <Typography
                            className="vote-count"
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {postDetail.voted.length}
                          </Typography>
                        </button>
                      )}
                    </Form>
                  </Box>
                  <div className="detail-title">
                    <Typography
                      className="detail-list-item-title"
                      color="text.primary"
                      component="h3"
                      sx={{ fontWeight: 700, mb: 1 }}
                    >
                      {postDetail.title}
                    </Typography>
                    <div className="detail-list-item-status">
                      <span className={`detail-list-badge ${getPostStatus(postDetail.status).className}`}>
                        {getPostStatus(postDetail.status).name}
                      </span>
                      {user.is_staff && (
                        <ChangeStatus postId={postDetail.id} preStatus={postDetail.status} />
                      )}
                    </div>
                  </div>
                </div>

                <div className="detail-item-text">
                  <div className="contributor">
                    <Avatar
                      alt={user.username}
                      src={user.avatar}
                      title={user.username}
                      style={{ marginRight: '10px' }}
                    />
                    <Typography
                      className="contributor-name"
                      color="text.primary"
                      component="p"
                      sx={{ fontWeight: 700 }}
                    >
                      {postDetail.user.username}
                    </Typography>
                  </div>
                  <div className="contributor-content">
                    <div className="post-text">
                      <Typography
                        className="contoributor-text"
                        color="text.primary"
                        component="p"
                        sx={{ mb: 1 }}
                      >
                        {postDetail.post_text}
                      </Typography>
                    </div>
                    <div className="post-image grid grid-cols-3">
                      {postDetail.images && postDetail.images.map((image) => (
                        <button key={image.image_path} style={{ outline: 'none' }} type="button" onClick={() => setModalOpen(() => `post-${0}`)}>
                          <img
                            alt="postImage"
                            className="image-thumbnail post-label"
                            src={image.image_path}
                          />
                        </button>
                      ))}
                      <ModalElement isOpen={(modalOpen === `post-${0}`)} handleClose={() => setModalOpen(false)} label="post-label">
                        <Swiper
                          spaceBetween={50}
                          slidesPerView={1}
                          pagination={{ clickable: true, dynamicBullets: true }}
                          modules={[Navigation, Pagination]}
                          navigation
                          loop
                        >
                          {postDetail.images.map((image) => (
                            <SwiperSlide key={image.image_path}>
                              <img alt="postImage" className="image-thumbnail-modal" src={image.image_path} />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </ModalElement>
                    </div>
                    <div className="post-daate">
                      <p className="contributor-date" title={postDetail.created_at}>
                        {/* {formatDate(postDetail.created_at)} */}
                        {postDate.formatDate()}
                        -
                        {/* <span>{diffInDays(postDetail.created_at)}</span> */}
                        <span>{postDate.diffInDays()}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </Box>
              <CreateComment postId={postDetail.id} />

              <Box bgcolor="background.default" className="activity-content">
                <div className="activity-title-wrap">
                  <h3 className="activity-title">アクティビティ</h3>
                  <span className="activity-sort">
                    <button type="button" className="activity-newest" onClick={() => handleSort('desc')}>新しい投稿順</button>
                    /
                    <button type="button" className="activity-oldest" onClick={() => handleSort('asc')}>古い投稿順</button>
                  </span>
                </div>
                <CommentList comments={listComments} postId={postDetail.id} />
              </Box>
            </div>
          </Box>
        </Box>
      </section>
    </Box>
  );
};

export default Detail;
