import React, { useCallback, useState } from 'react';
import { useRecoilValue } from 'recoil';
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
import ModalElement from '@/module/elements/ModalElement';
import { useDetail, usePost } from '@/recoil/posts/dispatcher';
import { userDataAtom } from '@/recoil/auth/atoms';

const customStyles = {
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    padding: '0em',
    borderRadius: '3px',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    p: 3,
  } as const,
  overlay: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as const,
};

type ChangeStatusProps = { postId: number, preStatus: number };

const ChangeStatus: React.FC<ChangeStatusProps> = React.memo((props) => {
  const { postId, preStatus } = { ...props };
  const user = useRecoilValue(userDataAtom);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState<number>(preStatus);
  const { getPostStatus } = usePost();
  const { updateStatus } = useDetail();
  const statuses = [
    { key: 0, value: 'レビュー中' },
    { key: 1, value: '対応中' },
    { key: 2, value: '完了' },
    { key: 3, value: '見送り' },
  ];

  const onSubmit = () => {
    const formData = new FormData();
    formData.set('status', status.toString());
    const comment = `ステータスを 【${getPostStatus(status).name} 】に更新しました。`;
    formData.set('comment_text', comment);
    formData.set('reply_to', '0');
    formData.set('user', user.id.toString());
    formData.set('post', postId.toString());
    formData.set('images[0]image_path', '');
    updateStatus(formData);
    setModalOpen(false);
  };

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

  const onClick = (key: number) => {
    setStatus(key);
    setModalOpen(true);
  };

  const modalChildren = () => {
    const message = 'ステータスを更新します';

    return (
      <>
        <h1>{message}</h1>
        <p>
          {getPostStatus(preStatus).name}
          →
          {getPostStatus(status).name}
        </p>
        <div style={{ marginTop: 10 }}>
          <button
            type="button"
            className="bg-gray-400 hover:bg-gray-300 text-white font-bold py-2 px-4 border-b-4 border-gray-700 hover:border-gray-500 rounded"
            style={{ marginRight: 10 }}
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-green-400 hover:bg-green-300 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded"
            onClick={() => onSubmit()}
          >
            OK
          </button>
        </div>
      </>
    );
  };

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
        <Icon>view_list</Icon>
        ステータス更新
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
                  {statuses.map((s) => (
                    <MenuItem key={s.key} onClick={() => onClick(s.key)}>
                      <Typography>
                        {s.value}
                      </Typography>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <ModalElement
        isOpen={modalOpen}
        handleClose={() => setModalOpen(false)}
        label="status-change"
        customStyles={customStyles}
      >
        {modalChildren()}
      </ModalElement>
    </>
  );
});

export default ChangeStatus;
