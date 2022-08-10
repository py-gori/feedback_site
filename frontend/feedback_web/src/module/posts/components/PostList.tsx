import React from 'react';
import {
  Box,
  Divider,
  Icon,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';

import type { PostItem } from '@/module/types';
import { usePost } from '@/recoil/posts/dispatcher';

const PostList: React.FC<{posts: PostItem[]}> = ({ posts }) => {
  const { getPostStatus } = usePost();

  const postList = (): JSX.Element[] => {
    const list: JSX.Element[] = [];
    posts.map((post) => {
      list.push(
        <ListItem
          sx={{ padding: '1rem' }}
          key={post.id}
          alignItems="flex-start"
          className="detail-list-item-link"
        >
          <Box className="detail-list-item-vote">
            <Icon sx={{ fontSize: '25px', color: 'text.primary' }}>expand_less</Icon>
            <Typography
              className="vote-count"
              sx={{ display: 'inline' }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {post.vote_count}
            </Typography>
          </Box>
          <Box className="detail-list-item-text-wrap">
            <Link to={`/posts/${post.types}/${post.id}`}>
              <ListItemText
                className="detail-list-item-text-wrap"
                sx={{ display: 'flex', flexDirection: 'column' }}
                primary={post.title}
                // className="detail-list-item-title"
                secondary={(
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      className={`detail-list-badge ${getPostStatus(post.status).className}`}
                      // className="detail-list-badge"
                    >
                      {getPostStatus(post.status).name}
                    </Typography>
                    <Typography
                      sx={{ display: 'block', marginTop: '15px' }}
                      component="span"
                      // variant="body2"
                      color="text.secondary"
                    >
                      {post.post_text}
                    </Typography>
                  </>
                )}
              />
            </Link>
          </Box>
          <Box className="detail-list-item-comment">
            <Icon sx={{ fontSize: '30px' }}>chat_bubble_outline</Icon>
            <Typography
              // sx={{borderRadius: '10px', backgroundColor: 'black'}}
              className="comment-count"
              component="span"
              color="white"
            >
              {post.comment_count}
            </Typography>
          </Box>
          <Divider variant="inset" component="span" />
        </ListItem>,
      );
    });
    return list;
  };

  return (
    <List
      className="detail-list-items"
      sx={{
        width: '100%',
        // maxWidth: 360,
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'auto',
        // maxHeight: 390,
        '& ul': { padding: 0 },
      }}
    >
      {postList()}
    </List>
  );
};

export default PostList;
