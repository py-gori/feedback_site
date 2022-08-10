import React from 'react';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { XIcon } from '@heroicons/react/outline';

import {
  loginModalAtom,
} from '@/recoil/auth/atoms';
import signInImg1 from './images/google_signin_1.png';
import signInImg2 from './images/google_signin_2.png';
import ModalElement from '@/module/elements/ModalElement';
import useAuth from '../../recoil/auth/dispatcher';

const customStyles = {
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    background: 'white',
    padding: '0em',
    borderRadius: '3px',
    transform: 'translate(-50%, -50%)',
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

const Auth: React.FC = () => {
  const [loginModal, setLoginModal] = useRecoilState(loginModalAtom);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    login();
    navigate('/posts');
  };

  return (
    <Box bgcolor="background.paper" style={{ height: '100vh', width: '100%' }}>
      <ModalElement isOpen={loginModal} handleClose={() => setLoginModal(false)} label="auth-label" customStyles={customStyles}>
        <div className="modal-dialog" role="document" style={{ width: '100%', margin: 'auto', height: '100%' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Googleアカウントでログイン</h5>
              <button
                type="button"
                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => {
                  setLoginModal(false);
                }}
              >
                <span className="sr-only">Close</span>
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <button type="button" onClick={handleLogin}>
                <div id="wrap">
                  <img src={signInImg1} className="img-before" alt="" />
                  <img src={signInImg2} className="img-after" alt="" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </ModalElement>
    </Box>
  );
};

export default Auth;
