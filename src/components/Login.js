import React from "react";
import { ethers } from "ethers";
import { useState } from "react";
import { login } from "../actions/PatientDataManager";

const provider = new ethers.providers.Web3Provider(window.ethereum);

const Login = () => {
  const [user, setUser] = useState({});

  const updateState = (e) => {
    const field = e.target.name || e.target.id;
    const value = e.target.value;
    user[field] = value;
    setUser(user);
    console.log(user);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (window.ethereum) {
        provider
          .send("eth_requestAccounts", [])
          .then(async () => {
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const loginReceipt = await login(
              provider,
              address,
              user.email || "",
              user.password || ""
            );
            console.log(loginReceipt);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        console.log("Metamask not install");
      }
    } catch (error) {}
  };

  return (
    <div className="d-flex align-items-center justify-content-center ">
      <form
        action=""
        className=" d-flex  flex-column  mt-2 p-5 border shadow rounded "
        style={{ width: "30rem", height: "30rem" }}
      >
        <h2>Login</h2>

        <input
          className="mt-5"
          type="email"
          placeholder="Email"
          id="email"
          name="email"
          onChange={updateState}
        />
        <input
          className="mt-5"
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          onChange={updateState}
        />
        <button className="mt-5 btn btn-primary fw-bold" onClick={handleSubmit}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
