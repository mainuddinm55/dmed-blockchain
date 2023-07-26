import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";
import { MemoryBlockstore } from "blockstore-core";
import { createHash, encrypt, decrypt } from "../helpers/EncryptionHelper";
import { CID } from "multiformats/cid";

const getFs = async () => {
  const blockstore = new MemoryBlockstore();
  const helia = await createHelia({ blockstore });
  return unixfs(helia);
};

const getBase64FromFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });

export async function uploadFile(file, options = {}) {
  try {
    const key = createHash("12345");
    console.log(key);
    const result = await getBase64FromFile(file);
    const fs = await getFs();
    const data = encrypt(result, key);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

export async function uploadBytes() {
  const blockstore = new MemoryBlockstore();
  const helia = await createHelia({ blockstore });
  const fs = unixfs(helia);
  console.log(helia);
  const encoder = new TextEncoder();
  const cid = await fs.addBytes(encoder.encode("Helloo World from React js"));
  console.log(`Content address: ${cid.toString()}`);
  const decoder = new TextDecoder();
  let text = "";
  for await (const chunk of fs.cat(cid)) {
    text += decoder.decode(chunk, {
      stream: true,
    });
  }
  console.log(`Text return from IPFS: ${text}`);
}

export async function getBytes(cid) {
  // client.get(cid);
  // console.log("Added file contents:", text);
  const blockstore = new MemoryBlockstore();
  const helia = await createHelia({ blockstore });
  const fs = unixfs(helia);
  const decoder = new TextDecoder();

  let text = "";
  for await (const chunk of fs.cat(CID.parse(cid))) {
    text += decoder.decode(chunk, {
      stream: true,
    });
  }
}
