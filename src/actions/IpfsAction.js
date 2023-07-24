import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";
import { MemoryBlockstore } from "blockstore-core";

export async function uploadBytes() {
  const blockstore = new MemoryBlockstore();
  const helia = await createHelia({ blockstore });
  const fs = unixfs(helia);
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
  // const add = await s.add("Helllo world");
  // const cid = await s.get(add);
  // console.log(add, cid);
  // const result = await client.add(file);
  // console.log(result);
  // const myImmutableAddress = await j.add({ hello: "world" });
  // console.log(await j.get(myImmutableAddress));
}

export async function getBytes(cid) {
  // client.get(cid);
  // console.log("Added file contents:", text);
}
