import React, { useCallback } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import {
  Button,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  Icon,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { isLoginAtom, loginModalAtom } from '@/recoil/auth/atoms';
import useAuth from '@/recoil/auth/dispatcher';
import { ColorModeContext } from '@/providers/colorMode';

const UserMenu: React.FC = () => {
  const isLogin = useRecoilValue(isLoginAtom);
  const setLoginModal = useSetRecoilState(loginModalAtom);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const colorMode = React.useContext(ColorModeContext);
  const theme = useTheme();
  const { logout } = useAuth();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  const handleListKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }, []);

  return (
    <>
      <Button
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        style={{ outline: 'none' }}
      >
        <Icon>apps</Icon>
      </Button>
      <Popper
        style={{ zIndex: 10 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem onClick={colorMode.toggleColorMode}>
                    <Icon>
                      {theme.palette.mode === 'dark' ? 'light_mode' : 'nights_stay'}
                    </Icon>
                    <Typography>
                      {theme.palette.mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </Typography>
                  </MenuItem>
                  {isLogin ? (
                    <MenuItem onClick={logout}>
                      <Icon>
                        logout
                      </Icon>
                      <Typography>
                        Logout
                      </Typography>
                    </MenuItem>
                  ) : (
                    <MenuItem onClick={() => { setLoginModal(true); }}>
                      <Icon>
                        login
                      </Icon>
                      <Typography>
                        Login
                      </Typography>
                    </MenuItem>
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default UserMenu;
