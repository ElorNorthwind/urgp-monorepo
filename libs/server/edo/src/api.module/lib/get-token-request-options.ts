import { EdoAuthTokenRequest } from '../types';

export function getTokenRequestOptions(
  authData: EdoAuthTokenRequest,
): [string, object, object] {
  const url = `/auth.php`;

  const data = {
    user_id: authData.userid,
    password: authData.password,
    DNSID: authData.dnsid,
    groupid: authData.groupid,
  };

  const config = {
    maxRedirects: 0,
    validateStatus: (status: number) => status === 302,
  };

  return [url, data, config];
}
