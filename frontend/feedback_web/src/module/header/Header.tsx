import React from 'react';
import { useRecoilValue } from 'recoil';

import { Avatar, Box } from '@mui/material';
import { Link } from 'react-router-dom';

import { isLoginAtom, userDataAtom } from '@/recoil/auth/atoms';
import UserMenu from './components/UserMenu';
import TwitterIcon from './images/twitter.png';

const Header: React.FC = () => {
  const isLogin = useRecoilValue(isLoginAtom);
  const user = useRecoilValue(userDataAtom);

  return (
    <Box bgcolor="background.default" id="header" className="row">
      <div className="l-inner header-inner">
        <Box
          sx={{ width: '200px', height: 'auto' }}
          className="header-logo-wrap col-md-2"
        >
          <Link to="/posts">
            <Box
              component="img"
              src={TwitterIcon}
              alt="logo"
              className="header-logo"
            />
          </Link>
        </Box>
        <div className="header-left col-md-2">
          {isLogin ? (
            <Avatar
              alt={user.username}
              src={user.avatar}
              title={user.username}
              style={{ marginRight: '10px' }}
            />
          ) : (
            <>
            </>
          )}
          <UserMenu />
        </div>
      </div>
    </Box>
  );
};

export default Header;
