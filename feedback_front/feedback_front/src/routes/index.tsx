import React from 'react';
import { useRoutes } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import protectedRoutes from './protected';
import publicRoutes from './public';
import Auth from '@/module/auth/Auth';
import { isLoginAtom } from '@/recoil/auth/atoms';

const AppRoutes = () => {
  const isLogin = useRecoilValue(isLoginAtom);
  const commonRoutes = [{ path: '/', element: <Auth /> }];

  const routes = isLogin ? protectedRoutes : publicRoutes;

  const element = useRoutes([...routes, ...commonRoutes]);

  return element;
};

export default AppRoutes;
