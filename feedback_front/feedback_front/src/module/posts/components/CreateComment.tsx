import React, { useState, useRef } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import {
  Avatar,
  Box,
  Button,
  Icon,
  IconButton,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { userDataAtom } from '@/recoil/auth/atoms';
import Form from '@/module/elements/Form';
import { useDetail } from '@/recoil/posts/dispatcher';

type Inputs = {
  comment_text: string;
  image?: string;
};

const InputTextField = styled(TextField)(() => ({
  '& fieldset': {
    borderRadius: '10px',
  },
}));

type CreateCommentProps = { postId: number, commentId?: number };

const CreateComment: React.FC<CreateCommentProps> = React.memo((props) => {
  const { postId, commentId = 0 } = { ...props };
  const user = useRecoilValue(userDataAtom);
  const [uploadImages, setUploadImages] = useState<FileList|null>();
  const inputRef = useRef<HTMLInputElement>(null);
  const { postNewComment } = useDetail();

  const onClickButton = () => {
    inputRef.current?.click();
  };

  const inputImageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    // displayサイズxsでdrawerから投稿したときに画像が取得できなかった為、ハンドラーで画像セットする
    setUploadImages(event.target.files);
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const formData = new FormData();
    formData.set('comment_text', data.comment_text);
    formData.set('reply_to', commentId.toString());
    formData.set('user', user.id.toString());
    formData.set('post', postId.toString());
    formData.set('images[0]image_path', '');
    if (uploadImages && uploadImages.length !== 0) {
      for (let i = 0; i < uploadImages.length; i++) {
        formData.set(`images[${i}]image_path`, uploadImages[i]);
      }
    }
    postNewComment(formData);
  };

  return (
    <Box bgcolor="background.default" className="new-comment-content">
      <Form<Inputs> onSubmit={onSubmit}>
        {({ register, formState, reset }) => (
          <>
            <Box className="new-comment-wrap">
              <Avatar
                alt={user.username}
                src={user.avatar}
                title={user.username}
                style={{ marginRight: '10px' }}
              />
              <Box
                sx={{ width: { xs: '300px', sm: '600px' } }}
                className="new-comment"
              >
                <InputTextField
                  {...register('comment_text', { required: true })}
                  sx={{
                    bgcolor: 'background.default',
                    marginTop: '10px',
                    marginBottom: '20px',
                    width: '100%',
                  }}
                  multiline
                  className="form-control"
                  label="コメント"
                  placeholder="ここにコメント..."
                />
                <br />
                { formState.errors.comment_text && <span className="text-danger">コメントは必須です</span> }
              </Box>
            </Box>
            <div style={{ textAlign: 'right' }}>
              <input hidden ref={inputRef} onChange={inputImageHandler} multiple accept="image/png, image/Jpeg" id="icon-button-file" type="file" />
              <IconButton color="primary" aria-label="upload picture" component="span" onClick={onClickButton}>
                <Icon sx={{ fontSize: '30px' }}>add_photo_alternate</Icon>
              </IconButton>
              <Button
                sx={{ bgcolor: 'background.paper', color: 'text.primary' }}
                type="submit"
                endIcon={<Icon>send</Icon>}
              >
                投稿
              </Button>
            </div>
            { formState.isSubmitSuccessful && reset()}
          </>
        )}
      </Form>
    </Box>
  );
});

export default CreateComment;
