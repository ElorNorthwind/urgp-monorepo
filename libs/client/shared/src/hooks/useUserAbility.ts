import * as React from 'react';
import { useSelector } from 'react-redux';
import { guestUser, selectCurrentUser } from '../store/auth/authSlice';
import { defineControlAbilityFor } from '@urgp/shared/entities';

export function useUserAbility() {
  const user = useSelector(selectCurrentUser);

  return React.useMemo(
    () => defineControlAbilityFor(user || guestUser),
    [user],
  );
}
