import { nanoid } from 'nanoid';
import { useRecoilCallback, useRecoilState } from 'recoil';
import {
  getAuth,
  getIdToken,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import {
  isLoginAtom,
  idTokenAtom,
  userDataAtom,
  loginModalAtom,
} from './atoms';

import {
  notificationsAtom,
} from '@/recoil/posts/atoms';

import type { User } from '@/module/types';

const useAuth = () => {
  const auth = getAuth();
  const [notifications, setNotifications] = useRecoilState(notificationsAtom);

  // const isLoginCheck = useRecoilCallback(({ set }) => () => {
  //   if (!auth) {
  //     return;
  //   }

  //   onAuthStateChanged(auth, (authUser) => {
  //     if (authUser) {
  //       getIdToken(authUser).then((idToken) => {
  //         axios.defaults.headers.common.Authorization = idToken;
  //         axios.get(`${process.env.REACT_APP_URL_API}/users/`)
  //           .then((res) => {
  //             console.log('authenticated');
  //             set(userDataAtom, res.data.user);
  //             set(isLoginAtom, true);
  //           })
  //           .catch((error) => {
  //             console.log(error);
  //             set(isLoginAtom, false);
  //           });
  //       });
  //     } else {
  //       console.log('unauth');
  //       set(isLoginAtom, false);
  //     }
  //   });
  // }, []);

  const login = useRecoilCallback(({ set }) => () => {
    signInWithPopup(auth, new GoogleAuthProvider())
      .then((result) => {
        getIdToken(result.user)
          .then((idToken) => {
            set(idTokenAtom, idToken);
            setNotifications([...notifications, {
              id: nanoid(),
              type: 'success',
              title: 'Login',
            }]);
          })
          .catch((e) => {
            setNotifications([...notifications, {
              id: nanoid(),
              type: 'error',
              title: 'Login Failed',
              status: e.response.status,
              message: JSON.stringify(e.response.data),
            }]);
          });
      })
      .catch((e) => {
        setNotifications([...notifications, {
          id: nanoid(),
          type: 'error',
          title: 'Login Failed',
          status: e.response.status,
          message: JSON.stringify(e.response.data),
        }]);
      });
  });

  const logout = useRecoilCallback(({ set }) => () => {
    signOut(auth)
      .then(() => {
        set(isLoginAtom, false);
        set(userDataAtom, {} as User);
        set(loginModalAtom, false);
        setNotifications([...notifications, {
          id: nanoid(),
          type: 'success',
          title: 'Logout',
        }]);
      });
  });
  return {
    // isLoginCheck,
    login,
    logout,
  };
};

export default useAuth;
