import axios from 'axios';
import {
  selector,
} from 'recoil';
import { idTokenAtom } from './atoms';

const loginSelector = selector({
  key: 'loginSelector',
  get: async ({ get }) => {
    const idToken = get(idTokenAtom);
    axios.defaults.headers.common.Authorization = idToken;
    try {
      await axios.get(`${process.env.REACT_APP_URL_API}/users`)
        .then((res) => {
          const userData = res.data.user;
          const loginModal = false;
          const isLogin = true;
          return {
            userData,
            loginModal,
            isLogin,
          };
        })
        .catch((error) => {
          console.error(error);
          const isLogin = false;
          return {
            isLogin,
          };
        });
    } catch (error: any) {
      throw new Error(error);
    }
  },
});

export default loginSelector;
