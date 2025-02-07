import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { guestUser, selectCurrentUser } from '../store/auth/authSlice';

export const useAuth = () => {
  const user = useSelector(selectCurrentUser) || guestUser;

  return useMemo(() => ({ user }), [user]);
};
