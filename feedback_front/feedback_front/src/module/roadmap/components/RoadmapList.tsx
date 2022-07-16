import React from 'react';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import {
  Box,
  Divider,
  Icon,
  ListItemText,
  Typography,
} from '@mui/material';

import type { PostItem } from '@/module/types';

const RoadmapList: React.FC<{posts: PostItem[]}> = ({ posts }) => {
  const roadmapList = (): JSX.Element[] => {
    const list: JSX.Element[] = [];
    posts.map((post) => {
      let className;
      if (post.status === 0) {
        className = 'roadmap-list-review';
      } else if (post.status === 1) {
        className = 'roadmap-list-progress';
      } else if (post.status === 2) {
        className = 'roadmap-list-complete';
      }

      list.push(
        <Link key={post.id} to={`/posts/${post.types}/${post.id}`}>
          <ListItem alignItems="flex-start" className={className}>
            <ListItemText
              primary={post.title}
              secondary={(
                <>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {post.types}
                  </Typography>
                  {/* {` — I'll be in your neighborhood doing errands this…`} */}
                </>
              )}
            />
            <Box style={{ flexDirection: 'column', alignItems: 'center', display: 'flex' }}>
              {/* <ChevronUpIcon className="h-5 w-5" color="red"/> */}
              <Icon sx={{ fontSize: 'midium', color: 'red' }}>expand_less</Icon>
              <ListItemText>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {post.vote_count}
                </Typography>
              </ListItemText>
            </Box>
          </ListItem>
          <Divider variant="inset" component="li" />
        </Link>,
      );
    });
    return list;
  };

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'auto',
        maxHeight: 390,
        '& ul': { padding: 0 },
      }}
    >
      {roadmapList()}
    </List>
  );
};

export default RoadmapList;
