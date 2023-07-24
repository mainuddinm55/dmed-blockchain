import React from "react";
import { useState } from "react";
import { uploadBytes, getBytes } from "../actions/IpfsAction";

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
      uploadBytes();
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
