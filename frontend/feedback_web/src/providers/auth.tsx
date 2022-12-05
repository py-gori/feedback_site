import axios from 'axios';

import React, { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  getAuth,
  getIdToken,
  onAuthStateChanged,
} from 'firebase/auth';
import './firebase';

import {
  isLoginAtom,
  userDataAtom,
} from '@/recoil/auth/atoms';

export const AuthContext = React.createContext({});

type AuthProviderProps = {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useRecoilState(userDataAtom);
  const setIsLogin = useSetRecoilState(isLoginAtom);
  const navigate = useNavigate();
  // const setIdToken = useSetRecoilState(idTokenAtom);
  // const { isLoginCheck } = useAuth();

  const location = useLocation();
  // const from: any = location.state || { from: { pathname: '/posts'} };
  const currentPath = location.pathname === '/' ? '/posts' : location.pathname;

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        getIdToken(authUser).then(async (idToken) => {
          // setIdToken(idToken);
          // navigate(currentPath);
          axios.defaults.headers.common.Authorization = idToken;
          await axios.get(`${process.env.REACT_APP_URL_API}/users/`)
            .then((res) => {
              setUser(res.data.user);
              setIsLogin(true);
              navigate(currentPath);
            })
            .catch((error) => {
              setIsLogin(false);
              return Promise.reject(new Error(error));
            });
        });
      } else {
        navigate('/');
        setIsLogin(false);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  );
};
