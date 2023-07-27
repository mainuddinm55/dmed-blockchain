import CryptoJS from "crypto-js";
import { JSEncrypt } from "jsencrypt";

/**
 * Generate SHA256 hash
 * @param {string} data which want to create hash.
 * @returns {string} Hexa-decimal value of data.
 */
export const createHash = (data) => {
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
};

/**
 * AES encryption of given data
 * @param {string | any} data want to encrypt can be string or any.
 * @param {string} hash salt for encrypting data
 * @returns {string} encrypted data
 */
export const encrypt = (data, hash) => {
  var key = CryptoJS.enc.Hex.parse(hash);
  if (typeof data != String) {
    data = JSON.stringify(data);
  }
  return CryptoJS.AES.encrypt(data, key, { iv: key }).toString();
};

/**
 * AES decryption of given encrypted data
 * @param {string} data encrypted data
 * @param {string} hash salt for decrypting data
 * @returns {string} decrypted data
 */
export const decrypt = (data, hash) => {
  var key = CryptoJS.enc.Hex.parse(hash);
  return CryptoJS.AES.decrypt(data, key, { iv: key }).toString(
    CryptoJS.enc.Utf8
  );
};

/**
 * RSA key paris generate
 * @returns {{privateKey:string,publicKey:string}} generated key pairs
 */
export const keysGenerate = async () => {
  const encrypt = new JSEncrypt({ default_key_size: 2048 });
  const keys = {
    privateKey: encrypt.getPrivateKey(),
    publicKey: encrypt.getPublicKey(),
  };
  return keys;
};

/**
 * RSA encryption of given data
 * @param {string} data want to encrypted
 * @param {string} publicKey of those use who can decrypted data
 * @returns {string} encrypted data.
 */
export const rsaEncrypt = (data, publicKey) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  if (typeof data != String) {
    data = JSON.stringify(data);
  }
  return encrypt.encrypt(data);
};

/**
 * RSA decryption of encrypted data
 * @param {string} data encrypted data
 * @param {string} privateKey who can decrypt data his private key
 * @returns {string} decrypted data
 */
export const rsaDecrypt = (data, privateKey) => {
  const encrypt = new JSEncrypt();
  encrypt.setPrivateKey(privateKey);
  return encrypt.decrypt(data);
};
