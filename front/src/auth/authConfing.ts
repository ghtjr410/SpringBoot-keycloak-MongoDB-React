// authConfig.ts
import { UserManager } from 'oidc-client-ts';

const authConfig = {
  authority: 'http://localhost:8181/realms/miniblog-realm',
  client_id: 'service-client',
  redirect_uri: window.location.origin,
  post_logout_redirect_uri: window.location.origin,
  response_type: 'code',
  scope: 'openid profile offline_access',
  automaticSilentRenew: true, // silent renew token
  useRefreshToken: true, // Use refresh token to renew access token
  silentRequestTimeout: 30 * 1000, // 30 seconds before token expires, try to renew
};

export const userManager = new UserManager(authConfig);