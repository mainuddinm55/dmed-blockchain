import CryptoJS, { enc } from "crypto-js";
import { JSEncrypt } from "jsencrypt";

export const createHash = (data) => {
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
};

export const encrypt = (data, hash) => {
  var key = CryptoJS.enc.Hex.parse(hash);
  if (typeof data != String) {
    data = JSON.stringify(data);
  }
  return CryptoJS.AES.encrypt(data, key, { iv: key }).toString();
};

export const decrypt = (data, hash) => {
  var key = CryptoJS.enc.Hex.parse(hash);
  return CryptoJS.AES.decrypt(data, key, { iv: key }).toString(
    CryptoJS.enc.Utf8
  );
};

export const keysGenerate = async () => {
  const encrypt = new JSEncrypt({ default_key_size: 2048 });
  const keys = {
    privateKey: encrypt.getPrivateKey(),
    publicKey: encrypt.getPublicKey(),
  };
  return keys;
};

export const rsaEncrypt = (data, publicKey) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  if (typeof data != String) {
    data = JSON.stringify(data);
  }
  return encrypt.encrypt(data);
};

export const rsaDecrypt = (data, privateKey) => {
  const encrypt = new JSEncrypt();
  encrypt.setPrivateKey(privateKey);
  return encrypt.decrypt(data);
};
