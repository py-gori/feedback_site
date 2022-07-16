import { atom } from 'recoil';
import type { User } from '@/module/types';

export const isLoginAtom = atom<boolean>({
  key: 'isLoginAtom',
  default: false,
});

export const userDataAtom = atom<User>({
  key: 'userDataAtom',
  default: {} as User,
  dangerouslyAllowMutability: true,
});

export const idTokenAtom = atom<string>({
  key: 'idTokenAtom',
  default: '',
});

export const loginModalAtom = atom<boolean>({
  key: 'loginModalAtom',
  default: false,
});
