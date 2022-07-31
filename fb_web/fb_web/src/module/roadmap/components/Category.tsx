import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Typography,
} from '@mui/material';

import type { Count } from '../../types';

const Category: React.FC<Count> = (props) => {
  const { feedbacksCount, bugsCount } = props;

  return (
    <Grid
      container
      sx={{ mb: { xs: 2, md: 4 } }}
      bgcolor="background.paper"
      className="l-inner category-section"
    >
      <Grid
        item
        xs={11}
        md={5.71}
        sx={{ mb: { xs: 2, md: 0 }, mr: { xs: 0, md: 4 } }}
        bgcolor="background.default"
        className="category-btn"
      >
        <Link to="/posts/feedbacks">
          <Typography>
            FeedBacks
            <Typography
              component="span"
              className="category-count"
            >
              {feedbacksCount}
            </Typography>
          </Typography>
        </Link>
      </Grid>
      <Grid
        item
        xs={11}
        md={5.71}
        // sx={{ mb: { xs: 2 } }}
        bgcolor="background.default"
        className="category-btn"
      >
        <Link to="/posts/bugs">
          <Typography>
            Bugs
            <Typography
              component="span"
              className="category-count"
            >
              {bugsCount}
            </Typography>
          </Typography>
        </Link>
      </Grid>
    </Grid>
  );
};

export default Category;
