import React from "react";
import { useState } from "react";
import { uploadBytes, getBytes, uploadFile } from "../actions/IpfsAction";
import { keysGenerate } from "../helpers/EncryptionHelper";
import { ethers } from "ethers";

import {
  getUsers,
  share,
  isAuthorized,
  removeAccess,
  storeData,
  getData,
} from "../actions/PatientDataManager";
const provider = new ethers.providers.Web3Provider(window.ethereum);

const IpfsUpload = () => {
  const [cid, setCid] = useState("");
  const [file, setFile] = useState(null);

  const updateState = (e) => {
    const value = e.target.value;
    setCid(value);
    console.log(value);
  };

  const onFileChange = (e) => {
    const value = e.target.files[0];
    setFile(value);
    console.log(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (cid) {
        getBytes(cid).then(
          (data) => {
            console.log(data);
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        uploadBytes().then(
          (data) => {
            console.log(data);
          },
          (error) => {
            console.log(error);
          }
        );
      }
      // getData(
      //   provider,
      //   "0x8e15657C058Ff003dC7d3F51cbfE1c2efC7A00a2",
      //   "0x4223BA91c3B2F6CFeDbF03778D1A928dB3355351",
      //   "186215fbeb076b05354f0f8b4a88872ed4f83ec2f9930f1dce45c6aff8af9896"
      // ).then(
      //   (data) => {
      //     console.log(data);
      //   },
      //   (error) => {
      //     console.log(error);
      //   }
      // );
      // if (file) {
      //   // uploadFile(file);
      //   storeData(
      //     provider,
      //     "0x8e15657C058Ff003dC7d3F51cbfE1c2efC7A00a2",
      //     "0x4223BA91c3B2F6CFeDbF03778D1A928dB3355351",
      //     "186215fbeb076b05354f0f8b4a88872ed4f83ec2f9930f1dce45c6aff8af9896",
      //     { file: file, content: "This is raaw text" }
      //   ).then(
      //     (data) => {
      //       console.log(data);
      //     },
      //     (error) => {
      //       console.log(error);
      //     }
      //   );
      // }
      // uploadBytes();
      // keysGenerate();
      // // if (window.ethereum) {
      // //   provider
      // //     .send("eth_requestAccounts", [])
      // //     .then(async () => {
      // //       const signer = await provider.getSigner();
      // //       const address = await signer.getAddress();
      // //       const loginReceipt = await getUsers(
      // //         provider,
      // //       );
      // //       console.log(loginReceipt);
      // //     })
      // //     .catch((error) => {
      // //       console.log(error);
      // //     });
      // } else {
      //   console.log("Metamask not install");
      // }
      // share(
      //   provider,
      //   {
      //     address: "0x8e15657C058Ff003dC7d3F51cbfE1c2efC7A00a2",
      //     secret:
      //       "186215fbeb076b05354f0f8b4a88872ed4f83ec2f9930f1dce45c6aff8af9896",
      //   },
      //   {
      //     address: "0x4223BA91c3B2F6CFeDbF03778D1A928dB3355351",
      //     public_key:
      //       "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjW67WIUHDR9+H+0RW5qx\n4awP4/Swi3FLzJHpjHNJ4pE8j380Ba8hjXGuiZjUEiIsJAat7ZuL47tkH81z8JRx\n079pfjDOD6x5n/AIxbYcH9zMzZPjtzujt6rEedrJO/5vQuqxa24tHMCgJWi4n/Rs\nDtnRAgnIr0R0T5LAaXiujgUxp1AVrg5SF6IQsuqXdHxzUOgJ5ulPldbwm7pdonxx\nEbAgAcQnXu+aSireoWIZlrUA2toNP37lcx+efIEPQBvXZqVWihtpU1QrEndtltQt\nEWWbFtDW/9Sf0/k3RutuNAOJKB7/v6hK7WF+1UB4vVsMylf54opZKN0LFJutYat4\nIwIDAQAB\n-----END PUBLIC KEY-----",
      //   },
      //   {
      //     expire_time: 1698337954,
      //     rule: "BOTH",
      //   }
      // ).then(
      //   (data) => {
      //     console.log(data);
      //   },
      //   (error) => {
      //     console.log(error);
      //   }
      // );
      // isAuthorized(provider, "0x8e15657C058Ff003dC7d3F51cbfE1c2efC7A00a2", {
      //   address: "0x4223BA91c3B2F6CFeDbF03778D1A928dB3355351",
      //   private_key:
      //     "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAjW67WIUHDR9+H+0RW5qx4awP4/Swi3FLzJHpjHNJ4pE8j380\nBa8hjXGuiZjUEiIsJAat7ZuL47tkH81z8JRx079pfjDOD6x5n/AIxbYcH9zMzZPj\ntzujt6rEedrJO/5vQuqxa24tHMCgJWi4n/RsDtnRAgnIr0R0T5LAaXiujgUxp1AV\nrg5SF6IQsuqXdHxzUOgJ5ulPldbwm7pdonxxEbAgAcQnXu+aSireoWIZlrUA2toN\nP37lcx+efIEPQBvXZqVWihtpU1QrEndtltQtEWWbFtDW/9Sf0/k3RutuNAOJKB7/\nv6hK7WF+1UB4vVsMylf54opZKN0LFJutYat4IwIDAQABAoIBAFDY5qFAUfqPcRKg\n+tYphNui9uZxHmZnmlPTaPUPhkHMkhjZNwy0wvJO9N3VDg1bmW3yn4P+8aV5nk+L\nq2XwBW1sssoe7fwJtPDXTrxuUH9qQWyWyIoavoikRnH9viDcXg+bh1YJAiK4fhNE\nXJ2bJBYNLywCGcUO1YoTMohYIzgtJdl6t3m5pUJjt1TLFQuR+TkKhJ4AQyw3gcOM\n/2XK2vIdlqbhMjyvjwgcc7YUqPmAulgT6KAdnVsFTqJl3WQSwS4/F0jXYIU/fLje\nKIERsqDIOysZBv+lxr39F7ijLt5SoZ8YWbv5eONa0y15bmsXzED5tp4aq/ml/Qoh\nc1DjaOECgYEA3Xxdpyp2WxyuP4IhMECijMRWX+bnECNXQM3qucFQsojr/L8xaqa3\nuzMInwgTfsx4YtiY9JwgymHnb+xwQV6OtKi2ctYmIaAA7gwJY0sqQaZXLR+sVq5r\nJjER17sp3EDDJM2IacgIitVVNEakxK84HsitRtaSAYp7arTFpxFWkZECgYEAo3jW\nUAG1zm47cKUKatOdu9xWT7hm/dmfuo1xJ6uN4XJClbBqGR1sJGIly9LXgTmflibW\nsDy26NSdw0s+MzNP4tl7zezjurrVw3aS4Ge76D6EZSCnef4Ug0CneBtm4WfW+S/3\n7AumvewOdet6Fy1UWLf0fUTiMdPmntKGTZV81HMCgYAKPJZDhKXlviSbkNMh3Mrm\ngKiRVCW3zDpbJ2lC3plxNvzZOKj7CeuR/mDWoNPt11t1Dhe7rn+hevbsaFwj2U/1\nL5sHIbivcyq31dyVN0Mjt6Ft13nqo7MWF8yAUQk1QdUDHXDBmtoyOHvwp5cz8/k/\nCv1fOcmTwqfDnclI2HdM0QKBgQCEWuP6Z0gSWYHa1GW41JmTbvSbG0yYH8mJu9dw\nLSB09pQeqnVc3Eugsa60doNx53vkkJGmo6HcpbkOVC+KOPNnUntA4ZoIqBlHZwvI\nkXS8t1Fup5+x0Bw/oOt2/Yiw2+hcXZA4F77rauLSatOxTExMgLR9cHZLrau9z+pZ\nir1FLQKBgCvqNiyDqAoR5WX32MoQqV9pzJUf9Tq0+ITtonRtALvysz0UUY8abnw1\nXO4Lm8wKS3CtSu3wfgsgM0TshloMD5KMW84jHIs/5V3WbWEs2McYmL0tEXicvWOS\ntOQvzLx0ZCMmh7BApUJZHSMSACu8znwk4T6Ct1nkttwTs8I00p2Y\n-----END RSA PRIVATE KEY-----",
      // }).then(
      //   (data) => {
      //     console.log(data);
      //   },
      //   (error) => {
      //     console.log(error);
      //   }
      // );
      // removeAccess(
      //   provider,
      //   "0x8e15657C058Ff003dC7d3F51cbfE1c2efC7A00a2",
      //   "0x4223BA91c3B2F6CFeDbF03778D1A928dB3355351"
      // ).then(
      //   (data) => {
      //     console.log(data);
      //   },
      //   (error) => {
      //     console.log(error);
      //   }
      // );
      //1698337954
      //1690389419
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center ">
      <form
        action=""
        className=" d-flex  flex-column  mt-2 p-5 border shadow rounded "
        style={{ width: "30rem", height: "30rem" }}
      >
        <h2>IPFS Upload</h2>

        <input
          className="mt-5"
          type="text"
          placeholder="CID"
          id="cid"
          name="cid"
          onChange={updateState}
        />
        <input type="file" name="file" onChange={onFileChange} />

        <button className="mt-5 btn btn-primary fw-bold" onClick={handleSubmit}>
          Login
        </button>
      </form>
    </div>
  );
};

export default IpfsUpload;
