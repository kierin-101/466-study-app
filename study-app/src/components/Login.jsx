import { useState } from "react";

const Login = () => {
  const [usernameEntry, setUsernameEntry] = useState("");
  const [passwordEntry, setPasswordEntry] = useState("");

  const authenticateUser = (e) => {
    e.preventDefault(); // prevent refresh
    const user = {
      username: usernameEntry,
      password: passwordEntry
    };
    console.log(user);
    // call user auth API
    fetch("http://localhost:5000/api/account/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Login failed.");
        }
      })
      .then((data) => {
        console.log(data);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Your login attempt failed. Please check your credentials and try again.");
      });
  }

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
      onSubmit={authenticateUser}
    >
      <h1>Login</h1>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label for="username">Username:</label>
        <input
          required
          id="username"
          maxLength={100}
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
          maxLength={64}
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
