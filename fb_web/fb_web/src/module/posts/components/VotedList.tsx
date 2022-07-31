import React from 'react';
import { Avatar, Box } from '@mui/material';
import type { User } from '@/module/types';

const VotedList: React.FC<{votedUsers: User[]}> = ({ votedUsers }) => {
  const returnVotedUsers = () => {
    const res: JSX.Element[] = [];
    votedUsers.forEach((user) => {
      res.push(
        <Avatar
          key={user.id}
          alt={user.username}
          src={user.avatar}
          title={user.username}
          style={{ marginRight: '10px' }}
        />,
      );
    });
    return res;
  };

  const sideVoted = () => {
    return (
      <Box bgcolor="background.default" className="vote-content">
        <div className="vote-content-title-wrap">
          <h4 className="vote-content-title">投票した人</h4>
          <span className="vote-person-count">
            {votedUsers.length}
          </span>
        </div>
        <div className="vote-persons">
          {returnVotedUsers()}
        </div>
      </Box>
    );
  };

  return (
    <Box
      sx={{ width: { xs: '100%', sm: '30%' }, mb: { xs: 5, sm: 0 }, ml: { xs: 0, sm: 3 } }}
      // className="detail-list-side"
    >
      {sideVoted()}
    </Box>
  );
};

export default VotedList;
