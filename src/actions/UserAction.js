import CryptoJS from "crypto-js";
import { ethers } from "ethers";
import abi from "../solidity/abi.json";

const createHash = (data) => {
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
};

const encrypt = (data, hash) => {
  var key = CryptoJS.enc.Hex.parse(hash);
  if (typeof data != String) {
    data = JSON.stringify(data);
  }
  return CryptoJS.AES.encrypt(data, key, { iv: key }).toString();
};

const decrypt = (data, hash) => {
  var key = CryptoJS.enc.Hex.parse(hash);
  return CryptoJS.AES.decrypt(data, key, { iv: key }).toString(
    CryptoJS.enc.Utf8
  );
};

const getContract = (provider) => {
  return new ethers.Contract(
    "0x1AbB7827F52d65913680145daDACEB309CfaA79a",
    abi,
    provider.getSigner()
  );
};

export async function login(provider, address, email, password) {
  const hashPassword = createHash(password);
  const encryptEmail = encrypt(email, hashPassword);

  const contract = getContract(provider);
  const user = await contract.login(address, encryptEmail, hashPassword);
  const key = user.key;
  const data = decrypt(user.data, key);
  return {
    key: key,
    data: JSON.parse(data),
  };
}

export async function registration(provider, address, user) {
  const password = createHash(user.password);
  delete user.password;
  const email = encrypt(user.email, password);
  const data = encrypt(user, password);

  const contract = getContract(provider);
  const userReceipt = await contract.registration(
    address,
    email,
    password,
    data
  );
  const receipt = await userReceipt.wait(1);
  console.log(receipt);
  return receipt;
}

export async function share(provider, from, to, options = {}) {
  const expireTime = options.expireTime || 0;
  let rule = options.rule || "READ"; //WRITE, BOTH
  const fromAddress = from.address;
  const toAddress = to.address;

  const contract = getContract(provider);
  let data = {
    key: from.key,
    rule: rule,
    expireTime: expireTime,
  };
  try {
    const authentication = await contract.isAuthorized(fromAddress, toAddress);

    const key = to.key;
    data = JSON.parse(decrypt(authentication.data, key));
    const existingRule = data.rule || "";
    const existingExpireTime = data.expireTime || 0;

    if (existingRule !== rule && accessNotExpired(existingExpireTime)) {
      if (existingRule !== "BOTH") {
        rule = "BOTH";
        data.rule = rule;
      }
    } else {
      data.rule = rule;
    }
    data.expireTime = expireTime;
  } catch (error) {
    console.log("No access already having");
  }
  const encryptedData = encrypt(data, to.key);
  const shareReceipt = await contract.share(
    fromAddress,
    toAddress,
    encryptedData
  );
  const receipt = await shareReceipt.wait(1);
  return receipt;
}

function accessNotExpired(unix) {
  if (unix) {
    const now = new Date().getTime() / 1000;
    return now < unix;
  }
  return true;
}

export async function removeAccess(provider, fromAddress, toAddress) {
  const contract = getContract(provider);
  const removeAccessReceipt = await contract.removeShare(
    fromAddress,
    toAddress
  );
  const receipt = await removeAccessReceipt.wait(1);
  return receipt;
}

export async function isAuthorized(provider, fromAddress, to, rule) {
  const contract = getContract(provider);
  const authentication = await contract.isAuthorized(fromAddress, to.address);
  const data = JSON.parse(decrypt(authentication.data, to.key));

  const existingExpireTime = data.expireTime || 0;
  if (accessNotExpired(existingExpireTime)) {
    if (data.rule === "BOTH") return data;
    else if (data.rule === rule) return data;
  }
  return null;
}

export async function storeData(provider, user, data) {
  const address = data.address;
  delete data.address;
  let key = null;
  if (user.address === address) {
    key = user.key;
  } else {
    const authentication = await isAuthorized(provider, address, user, "WRITE");
    if (authentication) {
      key = authentication.key;
    }
  }
  if (key) {
    const contract = getContract(provider);
    const encryptedData = encrypt(data, key);
    const storeDataReceipt = await contract.store(address, encryptedData);
    const receipt = await storeDataReceipt.wait(1);
    return receipt;
  } else {
    throw Error("Unauthorized");
  }
}

export async function getData(provider, user, address) {
  let key = null;
  if (user.address === address) {
    key = user.key;
  } else {
    const authentication = await isAuthorized(provider, address, user, "READ");
    if (authentication) {
      key = authentication.key;
    }
  }
  if (key) {
    const contract = getContract(provider);
    const storeDataReceipt = await contract.getData(getData);
    const data = storeDataReceipt.data;
    return data;
  } else {
    throw Error("Unauthorized");
  }
}
