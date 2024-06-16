import { isJwtValid, verifyJwt } from '@utils/jwt.js';
import execQuery from '@services/db.js';
import configs from '@utils/config.js';

const requiredHeaders = [
  { name: 'access-control-allow-origin', configKey: 'headerAllowOrigin' },
  { name: 'x-frame-options', configKey: 'headerFrameOptions' },
  { name: 'x-content-type-options', configKey: 'headerContentOptions' },
  { name: 'x-xss-protection', configKey: 'headerXSS' },
];
const excludedBearerPath = [
  '/rest/v1/auth/login',
  '/rest/v1/auth/register',
  '/rest/v1/crypto/encrypt',
  '/rest/v1/crypto/decrypt',
];

const createErrorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    code: statusCode,
    message,
    data: [],
  });
};

const verifyHeaders = (req, res, next) => {
  try {
    for (const { name, configKey } of requiredHeaders) {
      if (!req?.headers[name] || req?.headers[name] !== configs[configKey])
        return createErrorResponse(res, 401, 'Unauthorized. Invalid Headers.');
    }
    next();
  } catch (err) {
    console.log(`Error Verify: ${err}`);
    const statusCode = err?.includes('timestamp check failed') ? 401 : 501;
    const message = statusCode === 401 ? 'Unauthorized.' : 'Internal Server Error';
    return createErrorResponse(res, statusCode, message);
  }
};

const isAuthRoute = route => excludedBearerPath?.includes(route);

const extractJwt = header => header['authorization']?.split('Bearer ')[1];

const verifyAuth = async (req, res, next) => {
  try {
    if (isAuthRoute(req?.originalUrl)) return next();

    const token = extractJwt(req?.headers);
    if (!token) return createErrorResponse(res, 401, 'Unauthorized. Invalid Token.');

    const { payload, protectedHeader } = await verifyJwt(token);
    if (!isJwtValid(payload?.exp)) return createErrorResponse(res, 401, 'Unauthorized. Token Expired.');
    if (protectedHeader?.alg !== configs?.jwtAlg) return createErrorResponse(res, 401, 'Unauthorized. Unkown Token.');

    const userId = payload?.id;
    if (!userId) return createErrorResponse(res, 400, 'Bad Request. Missing Id');

    req.uuid = userId;
    const result = await execQuery('SELECT * FROM mst_user WHERE user_id = ?', [userId]);
    if (result?.length === 0) return createErrorResponse(res, 401, 'Unauthorized. Unknown User.');
    next();
  } catch (err) {
    console.log(`Error Veify Auth: ${err}`);
    const statusCode = err?.name === 'JWTExpired' ? 401 : 501;
    const message = statusCode === 401 ? 'Unauthorized. Session Expired.' : 'Internal Server Error.';
    return createErrorResponse(res, statusCode, message);
  }
};

export { verifyHeaders, verifyAuth };
