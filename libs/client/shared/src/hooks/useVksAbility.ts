import { defineVksAbilityFor } from '@urgp/shared/entities';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { guestUser, selectCurrentUser } from '../store/auth/authSlice';

export function useVksAbility() {
  const user = useSelector(selectCurrentUser);

  return React.useMemo(() => defineVksAbilityFor(user || guestUser), [user]);
}
