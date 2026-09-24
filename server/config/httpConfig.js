const DEFAULT_CLIENT_ORIGIN = 'https://cellular7solutions.vercel.app';

function httpConfig(env) {
  const hosted = env.NODE_ENV === 'production' || env.RENDER === 'true';
  let clientOrigin = hosted ? DEFAULT_CLIENT_ORIGIN : true;

  if (env.CLIENT_URL) {
    let clientUrl;
    try { clientUrl = new URL(env.CLIENT_URL); } catch { /* handled below */ }
    if (!clientUrl || !['http:', 'https:'].includes(clientUrl.protocol) || clientUrl.pathname !== '/' || clientUrl.search || clientUrl.hash) {
      throw new Error('CLIENT_URL must be a frontend origin without a path.');
    }
    if (hosted && clientUrl.protocol !== 'https:') {
      throw new Error('CLIENT_URL must use HTTPS in production.');
    }
    clientOrigin = clientUrl.origin;
  }

  return { hosted, clientOrigin };
}

module.exports = httpConfig;
