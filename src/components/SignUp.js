import React, { useState } from "react";
import { ethers } from "ethers";
import { registration } from "../actions/PatientDataManager";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export default function SignUp({ userType }) {
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
            user.type = userType;
            const registrationReceipt = await registration(
              provider,
              address,
              user
            );
            console.log(registrationReceipt);
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
        className="mt-3 p-3 mb-3 border shadow rounded "
        style={{ width: "40rem", height: "39rem" }}
      >
        <h3 className="mt-3">Registration</h3>
        <div>
          <label
            style={{ width: "6rem", textAlign: "left" }}
            className="fw-bold"
            htmlFor=""
          >
            Name:
          </label>
          <input
            style={{ width: "20rem" }}
            className="m-2 p-1 "
            type="text"
            placeholder="Name"
            id="name"
            onChange={updateState}
          />
        </div>

        <div>
          <label
            style={{ width: "6rem", textAlign: "left" }}
            className="fw-bold"
            htmlFor=""
          >
            Email:
          </label>
          <input
            style={{ width: "20rem" }}
            className="m-2 p-1"
            type="email"
            placeholder="Email"
            id="email"
            onChange={updateState}
          />
        </div>

        <div>
          <label
            style={{ width: "6rem", textAlign: "left" }}
            className="fw-bold"
            htmlFor=""
          >
            Phone:
          </label>
          <input
            style={{ width: "20rem" }}
            className="m-2 p-1"
            type="phone"
            placeholder="Phone"
            id="phone"
            onChange={updateState}
          />
        </div>

        <div>
          <label
            style={{ width: "6rem", textAlign: "left" }}
            className="fw-bold"
            htmlFor=""
          >
            Password:
          </label>
          <input
            style={{ width: "20rem" }}
            className="m-2 p-1"
            type="password"
            placeholder="Password"
            id="password"
            onChange={updateState}
          />
        </div>

        <div>
          <label
            style={{ width: "6rem", textAlign: "left" }}
            className="fw-bold"
            htmlFor=""
          >
            DOB
          </label>
          <input
            style={{ width: "20rem", textAlign: "left" }}
            className="m-2 p-1"
            type="date"
            name="dob"
            onChange={updateState}
          />
        </div>
        <div>
          <label
            style={{ width: "6rem", textAlign: "left" }}
            className="fw-bold"
            htmlFor=""
          >
            Blood Group
          </label>
          <select
            style={{ width: "20rem" }}
            className="p-1 m-2"
            id="blood_group"
            onChange={updateState}
          >
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <label
            style={{ width: "6rem", textAlign: "left" }}
            className="fw-bold"
            htmlFor=""
          >
            Gender:
          </label>
          <div
            style={{ width: "20rem" }}
            className="d-flex m-2 p-1 border align-items-center justify-content-center"
          >
            <div
              style={{ width: "10rem" }}
              className="d-flex form-check align-items-center justify-content-left"
              name="gender"
            >
              <label
                className="form-check-label fw-bold "
                htmlFor="male_radio_btn"
              >
                <input
                  className="form-check-input m-2 p-1"
                  type="radio"
                  name="gender"
                  id="male_radio_btn"
                  value="Male"
                  onChange={updateState}
                />
                Male
              </label>{" "}
            </div>
            <div
              style={{ width: "10rem" }}
              className="d-flex form-check align-items-center justify-content-left"
            >
              <label
                className="form-check-label fw-bold "
                htmlFor="female_radio_btn"
              >
                <input
                  className="form-check-input m-2 p-1"
                  type="radio"
                  name="gender"
                  value="Female"
                  id="female_radio_btn"
                  onChange={updateState}
                />{" "}
                Female
              </label>{" "}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <input
            className="btn btn-primary fw-bold"
            type="submit"
            value="Submit"
            onClick={handleSubmit}
            style={{ width: "10rem" }}
          />
        </div>
      </form>
    </div>
  );
}
