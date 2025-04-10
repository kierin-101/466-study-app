import { useState } from "react";

const SignUp = () => {
  const [usernameEntry, setUsernameEntry] = useState("");
  const [passwordEntry, setPasswordEntry] = useState("");
  const [isEducator, setIsEducator] = useState(false);

  // const registerUser = () => {}
  //here, we'll have to:
  //check that our username isn't taken already
  //if it is, notify user, do nothing else
  //if not, add the account to db and log in under those credentials, redirect to home
  //also any form of username/password validation we end up doing. and whatever stage we do password encryption at
  //we didn't put an email or anything in the database so none of that. take care not to forget your password

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "16px auto",
        width: "75%",
        gap: "16px 0px",
        background: "lightgrey",
        borderRadius: "16px",
      }}
    >
      <h1>Sign Up</h1>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label for="username">Username:</label>
        <input
          required
          id="username"
          onChange={(e) => {
            setUsernameEntry(e.target.value);
          }}
        ></input>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label for="password">Password:</label>
        <input
          required
          type="password"
          id="password"
          onChange={(e) => {
            setPasswordEntry(e.target.value);
          }}
        ></input>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <legend style={{ textAlign: "center", margin: "4px 0px" }}>
          I want to use the app as a:
        </legend>
        <div>
          <input
            required
            type="radio"
            id="student"
            name="accountType"
            value={false}
            onClick={() => {
              setIsEducator(false);
            }}
          />
          <label for="student">Student</label>
        </div>
        <div>
          <input
            required
            type="radio"
            id="teacher"
            name="accountType"
            value={true}
            onClick={() => {
              setIsEducator(true);
            }}
          />
          <label for="teacher">Teacher</label>
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          console.log(
            `user: ${usernameEntry} password: ${passwordEntry} educatorStatus: ${isEducator}`
          );
        }}
      >
        Sign Up
      </button>
      <p>
        Already have an account? <a href="/login">Log in now!</a>
      </p>
    </form>
  );
};
export default SignUp;
