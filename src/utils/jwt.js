import * as jose from 'jose';
import configs from '@utils/config.js';

const generateJwt = async id => {
  const pvKey = await jose.importPKCS8(configs.jwtPvtKey, configs.jwtAlg, { format: 'PEM' });
  const jwt = await new jose.SignJWT({ id })
    .setProtectedHeader({ alg: configs.jwtAlg })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(pvKey);
  return jwt;
};

const verifyJwt = async jwt => {
  const pubKey = await jose.importSPKI(configs.jwtPubKey, configs.jwtAlg, { format: 'PEM' });
  const { payload, protectedHeader } = await jose.jwtVerify(jwt, pubKey);
  return {
    payload,
    protectedHeader,
  };
};

const isJwtValid = exp => {
  const current = Math.floor(Date.now() / 1000);
  return exp > current;
};

export { generateJwt, verifyJwt, isJwtValid };
