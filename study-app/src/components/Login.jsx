import { useState } from "react";

const Login = () => {
  const [usernameEntry, setUsernameEntry] = useState("");
  const [passwordEntry, setPasswordEntry] = useState("");

  //const authenticateUser = () => {}
  //here we'll have to validate credentials
  //if no such user exists, notify
  //if password does not match, notify
  //if we did enter correct credentials, log in and redirect to home

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
      <h1>Login</h1>
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
      <button>Login</button>
      <p>
        New user? <a href="/signup">Sign up now!</a>
      </p>
    </form>
  );
};
export default Login;
