import { isJwtValid, verifyJwt } from '@utils/jwt.js';
import execQuery from '@services/db.js';
import configs from '@utils/config.js';

const verifyHeaders = (req, res, next) => {
  try {
    const headers = req.headers;

    if (
      !headers['access-control-allow-origin'] ||
      !headers['x-frame-options'] ||
      !headers['x-content-type-options'] ||
      !headers['x-xss-protection']
    ) {
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized. Invalid headers',
        data: [],
      });
    }

    if (
      headers['access-control-allow-origin'] !== configs.headerAllowOrigin ||
      headers['x-frame-options'] !== configs.headerFrameOptions ||
      headers['x-content-type-options'] !== configs.headerContentOptions ||
      headers['x-xss-protection'] !== configs.headerXSS
    ) {
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized. Invalid headers',
        data: [],
      });
    }
    return next();
  } catch (e) {
    console.log(`Error Verify Headers: ${e}`);
    if (e?.includes('timestamp check failed'))
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized',
        data: [],
      });
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
      data: [],
    });
  }
};

const isAuth = route => route === '/rest/v1/auth/login' || route === '/rest/v1/auth/register';

const extractJwt = header => {
  const tok = header['authorization'];
  return tok?.split('Bearer ')[1];
};

const verifyAuth = async (req, res, next) => {
  try {
    if (isAuth(req.originalUrl)) return next();

    const tok = extractJwt(req.headers);
    if (!tok) {
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized. Invalid token',
        data: [],
      });
    }

    const { payload, protectedHeader } = await verifyJwt(tok);

    if (!isJwtValid(payload.exp))
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized. Token expired',
        data: [],
      });

    if (protectedHeader.alg !== configs.jwtAlg)
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized. Unknown token',
        data: [],
      });

    const id = payload.id ?? null;

    if (!id)
      return res.status(400).json({
        code: 400,
        message: 'Bad Request.',
        data: [],
      });

    req.uuid = { uuid: id };

    const query = 'SELECT * FROM mst_user WHERE user_id = ?';
    const params = [id];
    const result = await execQuery(query, params);
    if (result.length === 0)
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized. Unknown user',
        data: [],
      });

    return next();
  } catch (e) {
    console.log(`Error Verify Auth: ${e}`);
    if (e?.name === 'JWTExpired')
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized. Session expired.',
        data: [],
      });
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
      data: [],
    });
  }
};

export { verifyHeaders, verifyAuth };
