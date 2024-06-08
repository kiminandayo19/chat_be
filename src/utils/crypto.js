/* eslint-disable no-undef */
import 'dotenv/config';
import CryptoJS from 'crypto-js';

const secret = `${process.env.SECRET_KEY}`;
const salt = `${process.env.SALT}`;

const key = CryptoJS.PBKDF2(secret, salt, {
  keySize: 256 / 32,
  iterations: 74,
  hasher: CryptoJS.algo.SHA256,
});

const iv = CryptoJS.lib.WordArray.create(0);

export function encryptAES(strToEncrypt) {
  try {
    const encrypted = CryptoJS.AES.encrypt(strToEncrypt, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  } catch (e) {
    console.log(`Error while encrypting: ${e}`);
    return null;
  }
}

export function decryptAES(strToDecrypt) {
  try {
    const decrypted = CryptoJS.AES.decrypt(strToDecrypt, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.log(`Error while decrypting: ${e}`);
    return null;
  }
}
