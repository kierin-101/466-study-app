import { useState } from "react";

const SignUp = () => {
  const [usernameEntry, setUsernameEntry] = useState("");
  const [passwordEntry, setPasswordEntry] = useState("");
  const [educatorStatus, setEducatorStatus] = useState(false);

  const registerUser = (e) => {
    e.preventDefault(); // prevent refresh
    const user = {
      username: usernameEntry,
      password: passwordEntry,
      is_teacher: educatorStatus,
    };
    console.log(user);
    // call user creation API
    fetch("http://localhost:5000/api/account/register", {
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
          throw new Error("Failed to register user");
        }
      })
      .then((data) => {
        console.log(data);
        // redirect to home page or show success message
        // window.location.href = "/home";
      })
      .catch((error) => {
        console.error("Error:", error);
        // alert("Registration failed. Please try again.");
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
      onSubmit={registerUser}>
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
              setEducatorStatus(false);
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
              setEducatorStatus(true);
            }}
          />
          <label for="teacher">Teacher</label>
        </div>
      </div>
      <button type="submit">Sign Up</button>
      <p>
        Already have an account? <a href="/login">Log in now!</a>
      </p>
    </form>
  );
};
export default SignUp;
