import { defineEquityAbilityFor } from '@urgp/shared/entities';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { guestUser, selectCurrentUser } from '../store/auth/authSlice';

export function useEquityAbility() {
  const user = useSelector(selectCurrentUser);

  return React.useMemo(() => defineEquityAbilityFor(user || guestUser), [user]);
}
