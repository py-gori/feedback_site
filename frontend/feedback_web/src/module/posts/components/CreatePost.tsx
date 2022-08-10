import React, { useState, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { useLocation } from 'react-router-dom';
import { SubmitHandler } from 'react-hook-form';
import {
  Box,
  Button,
  Icon,
  IconButton,
  SwipeableDrawer,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { userDataAtom } from '@/recoil/auth/atoms';
import { usePost } from '@/recoil/posts/dispatcher';
import Form from '@/module/elements/Form';

type Inputs = {
  title: string;
  post_text: string;
  user: number;
  types: 'feedbacks' | 'bugs';
  image: string;
};

const InputTextField = styled(TextField)(() => ({
  '& fieldset': {
    borderRadius: '10px',
  },
}));

const CreatePost: React.FC = () => {
  const location = useLocation();
  const category = location.pathname.indexOf('feedbacks') !== -1 ? 'feedbacks' : 'bugs';
  const user = useRecoilValue(userDataAtom);
  const [isDrawer, setIsDrawer] = useState(false);
  const [uploadImages, setUploadImages] = useState<FileList|null>();
  const { postNewPost } = usePost();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const formData = new FormData();
    formData.set('title', data.title);
    formData.set('post_text', data.post_text);
    formData.set('user', user.id.toString());
    formData.set('types', category);
    formData.set('images[0]image_path', '');
    if (uploadImages && uploadImages.length !== 0) {
      for (let i = 0; i < uploadImages.length; i++) {
        formData.set(`images[${i}]image_path`, uploadImages[i]);
      }
    }
    postNewPost(formData);
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const onClickButton = () => {
    inputRef.current?.click();
  };

  const inputImageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    // displayサイズxsでdrawerから投稿したときに画像が取得できなかった為、ハンドラーで画像セットする
    setUploadImages(event.target.files);
  };

  const postForm = (): JSX.Element => {
    return (
      <Box bgcolor="background.default" className="posts-enter">
        <Typography
          className="posts-enter-title"
          component="h4"
          color="text.secondary"
        >
          ご意見ください！
        </Typography>
        <Form<Inputs> onSubmit={onSubmit}>
          {({ register, formState, reset }) => (
            <>
              <InputTextField
                {...register('title', { required: true, maxLength: 100 })}
                sx={{ bgcolor: 'background.default', marginTop: '10px', marginBottom: '20px' }}
                className="form-control"
                label="タイトル"
                placeholder="〇〇機能が欲しい"
              />
              { formState.errors.title && <span className="text-danger">タイトルは必須です</span> }
              <InputTextField
                {...register('post_text', { required: true })}
                sx={{ bgcolor: 'background.default', marginTop: '10px', marginBottom: '20px' }}
                className="form-control"
                label="詳細"
                multiline
                rows={10}
                placeholder="〇〇をすると△△になったら使いやすいかも"
              />
              { formState.errors.post_text && <span className="text-danger">詳細は必須です</span> }
              <div>
                <input hidden ref={inputRef} onChange={inputImageHandler} multiple accept="image/png, image/jpeg" id="icon-button-file" type="file" />
                <IconButton color="primary" aria-label="upload picture" component="span" onClick={onClickButton}>
                  <Icon sx={{ fontSize: '30px' }}>add_photo_alternate</Icon>
                </IconButton>
              </div>
              <Box
                sx={{ textAlign: 'right' }}
                // className="posts-enter-form"
              >
                <Button
                  // className="form-btn"
                  // variant="contained"
                  sx={{ bgcolor: 'background.paper', color: 'text.primary' }}
                  type="submit"
                  endIcon={<Icon>send</Icon>}
                >
                  投稿
                </Button>
              </Box>
              {formState.isSubmitSuccessful && reset()}
            </>
          )}
        </Form>
      </Box>
    );
  };

  const drawer = () => {
    return (
      <div>
        <Button style={{ outline: 'none' }} onClick={() => setIsDrawer(true)}>
          <Icon>add_box</Icon>
          投稿
        </Button>
        <SwipeableDrawer
          anchor="bottom"
          open={isDrawer}
          onClose={() => setIsDrawer(false)}
          onOpen={() => setIsDrawer(true)}
        >
          {postForm()}
        </SwipeableDrawer>
      </div>
    );
  };

  return (
    <>
      <Box sx={{ display: { xs: 'none', sm: 'block' }, ml: '30px' }}>
        {postForm()}
      </Box>
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        {drawer()}
      </Box>
    </>
  );
};

export default CreatePost;
