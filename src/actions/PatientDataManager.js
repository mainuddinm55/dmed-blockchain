import {
  createHash,
  encrypt,
  decrypt,
  keysGenerate,
  rsaEncrypt,
  rsaDecrypt,
} from "../helpers/EncryptionHelper";
import { convertToBase64 } from "../helpers/FileHelper";
import abi from "../solidity/abi_patient_data_manager.json";
import { ethers } from "ethers";
import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";
import { MemoryBlockstore } from "blockstore-core";
import { CID } from "multiformats/cid";

/**
 * GET Solidity Contract
 * @param {ethers.providers.Web3Provider} provider metamask provider
 * @returns {ethers.Contract} contact of 0xF9A2015A19F911f513DC3490D4aAbdcb18ae14ff address
 */
const getContract = (provider) => {
  return new ethers.Contract(
    "0xF9A2015A19F911f513DC3490D4aAbdcb18ae14ff",
    abi,
    provider.getSigner()
  );
};

/**
 * Registration of Patient/Doctors/Hospital
 * @param {ethers.providers.Web3Provider} provider metamask provider
 * @param {string} address registered user address
 * @param {*} data contain some information of user
 * @returns return blockchain transaction receipt
 */
export async function registration(provider, address, data) {
  if (!provider) throw Error("Provide can't be null");
  if (!address) throw Error("Address can't be null");
  if (!data) throw Error("Data are required");

  const keys = await keysGenerate();
  const secret = createHash(
    keys.publicKey + data.email + data.password + address
  );

  const private_info = {
    private_key: keys.privateKey,
    secret: secret,
  };
  const public_info = {
    name: data.name || "",
    email: data.email || "",
    phone: data.phone || "",
    dob: data.dob || "",
    blood_group: data.blood_group || "",
    gender: data.gender || "",
    public_key: keys.publicKey,
    address: address,
  };

  const hashPassword = createHash(data.password);
  const hashEmail = createHash(data.email);
  const key = createHash(hashPassword + hashEmail);
  const encrypted_public_info = encrypt(public_info, hashPassword);
  const encrypted_private_info = encrypt(private_info, key);
  const u_type = data.type || "USER";
  const contract = getContract(provider);
  const receipt = await contract.registration(
    address,
    hashEmail,
    hashPassword,
    u_type,
    encrypted_public_info,
    encrypted_private_info
  );

  await receipt.wait(1);
  return receipt;
}

/**
 * User login into system using credentials
 * @param {ethers.providers.Web3Provider} provider metamask provider
 * @param {string} address user address for login
 * @param {string} email user email which attach with same address
 * @param {string} password password was set during registration
 * @returns user private & public informations
 */
export async function login(provider, address, email, password) {
  const hashPassword = createHash(password);
  const hashEmail = createHash(email);

  const key = createHash(hashPassword + hashEmail);
  const contract = getContract(provider);
  const user = await contract.login(address, hashEmail, hashPassword);
  const public_info = decrypt(user[0].public_info, hashPassword);
  const private_info = decrypt(user[1], key);
  return {
    public_info: JSON.parse(public_info),
    private_info: JSON.parse(private_info),
  };
}

/**
 * Get all users in our system
 * @param {ethers.providers.Web3Provider} provider metamask provider
 * @returns {Promise<Array>} all users with containing public information
 */
export async function getUsers(provider) {
  const contract = getContract(provider);
  const users = await contract.getUsers();
  return users.map((user) =>
    JSON.parse(decrypt(user.public_info, user.password))
  );
}

/**
 * Share data owner his data to other user
 * @param {*} provider metamask provider
 * @param {{address:string,secret:string}} from data owner info
 * @param {{address: string,"public_key":string}} to shared user info
 * @param {{expire_time:number,rule:string}} options contain options
 * @returns receipt of blockchain transactions
 */
export async function share(provider, from, to, options = {}) {
  const expireTime = options.expire_time || 0;
  let rule = options.rule || "READ"; //WRITE, BOTH
  const cred = rsaEncrypt(from.secret, to.public_key);

  const contract = getContract(provider);
  const receipt = await contract.share(
    from.address,
    to.address,
    expireTime,
    rule,
    cred
  );
  receipt.wait(1);
  return receipt;
}

/**
 * Check of the user having access to read or write
 * @param {ethers.providers.Web3Provider} provider metamask provder
 * @param {string} fromAddress address of data owner
 * @param {{private_key:string,address:string}} user shared user info
 * @returns {string} credentials of data owner
 */
export async function isAuthorized(provider, fromAddress, user) {
  const contract = getContract(provider);
  const private_key = user.private_key;
  const authentication = await contract.isAuthorized(fromAddress, user.address);
  return rsaDecrypt(authentication.cred, private_key);
}

/**
 * Data owner removed his shared access of given user.
 * @param {ethers.providers.Web3Provider} provider metamask provider
 * @param {string} fromAddress data owner address
 * @param {string} toAddress shared user address
 * @returns blockchain transaction receipt
 */
export async function removeAccess(provider, fromAddress, toAddress) {
  const contract = getContract(provider);
  const removeAccessReceipt = await contract.removeShare(
    fromAddress,
    toAddress
  );
  const receipt = await removeAccessReceipt.wait(1);
  return receipt;
}

/**
 * IPFS file uploader and downloader
 * @returns {import("@helia/unixfs").UnixFS} return of unix file system of IPFS
 */
const getFs = async () => {
  const blockstore = new MemoryBlockstore();
  const helia = await createHelia({ blockstore });
  console.log(helia);
  return unixfs(helia);
};

/**
 * Store patient data into IPFS and blockchain
 * @param {ethers.providers.Web3Provider} provider metamask provider
 * @param {string} address data owner address
 * @param {string} user data stored user address
 * @param {string} secret data owner secret key
 * @param {{file:File,content:string}} data object contain data
 */
export async function storeData(provider, address, user, secret, data) {
  let fileBase64 = "";
  if (data.file) {
    fileBase64 = await convertToBase64(data.file);
  }
  const encrypted_data = encrypt(
    { file_type: data.file.type, base64: fileBase64, content: data.content },
    secret
  );
  const fs = await getFs();
  const encoder = new TextEncoder();
  const cid = await fs.addBytes(encoder.encode(encrypted_data));
  const contract = getContract(provider);
  const receipt = await contract.store(address, user, cid.toString());
  await receipt.wait(1);
  return receipt;
}

/**
 * GET Patient Data
 * @param {ethers.providers.Web3Provider} provder metamask provider
 * @param {string} address address of data owner
 * @param {string} user address of data accesser / can data owner
 * @param {string} secret data owner secret to decrypt data
 * @returns all data's of that user
 */
export async function getData(provder, address, user, secret) {
  const contract = getContract(provder);
  const content = await contract.getData(address, user);
  const fs = await getFs();
  console.log(content[0]);
  const decoder = new TextDecoder();

  const data = await Promise.all(
    content.map(async (cid) => {
      let text = "";
      for await (const chunk of fs.cat(CID.parse(cid))) {
        text += decoder.decode(chunk, {
          stream: true,
        });
      }
      return JSON.parse(decrypt(text, secret));
    })
  );
  return data;
}
