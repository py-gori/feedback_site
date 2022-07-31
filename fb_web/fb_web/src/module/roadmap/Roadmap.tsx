import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Box, Grid } from '@mui/material';

import Category from './components/Category';
import SearchBox from '@/module/elements/SearchBox';
import { countByCategorySelector, roadmapPostsSelector } from '@/recoil/posts/selectors';
import RoadmapList from './components/RoadmapList';

const Roadmap: React.FC = () => {
  const { feedbacksCount, bugsCount } = useRecoilValue(countByCategorySelector);
  const [keyword, setKeyword] = useState('');
  const roadmapPosts = useRecoilValue(roadmapPostsSelector(keyword));

  const postListByStatus = (status: number) => {
    const postByStatus = roadmapPosts.filter((post) => post.status === status);
    return postByStatus;
  };

  return (
    <Box bgcolor="background.paper" className="main">
      <SearchBox setKeyword={setKeyword} />
      <Category feedbacksCount={feedbacksCount} bugsCount={bugsCount} />
      <Grid
        container
        className="l-inner roadmap-list-section"
      >
        <Grid
          item
          xs={12}
          sm={5}
          md={3.7}
          sx={{ mr: '30px' }}
          bgcolor="background.default"
          className="detail-card"
        >
          <h4 className="card-title">
            <span className="review">レビュー中</span>
          </h4>
          <RoadmapList posts={postListByStatus(0)} />
        </Grid>
        <Grid
          item
          xs={12}
          sm={5}
          md={3.7}
          sx={{ mr: '30px' }}
          bgcolor="background.default"
          className="detail-card"
        >
          <h4 className="card-title">
            <span className="in-progress">対応中</span>
          </h4>
          <RoadmapList posts={postListByStatus(1)} />
        </Grid>
        <Grid
          item
          xs={12}
          sm={5}
          md={3.7}
          // sx={{ mr: '30px' }}
          bgcolor="background.default"
          className="detail-card"
        >
          <h4 className="card-title">
            <span className="complete">完了</span>
          </h4>
          <RoadmapList posts={postListByStatus(2)} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Roadmap;
