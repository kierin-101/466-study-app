import { useState } from "react";

const SignUp = () => {
  const [usernameEntry, setUsernameEntry] = useState("");
  const [passwordEntry, setPasswordEntry] = useState("");
  const [educatorStatus, setEducatorStatus] = useState(false);

  // Given the user's selections, communicates to the server via procedure calls to attempt to register an account with their inputs.
  // If the server tells the client the action was successful, client then requests server to log them in with the new credentials.
  // If the signup failed, an error message is displayed based on what the server tells us.
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
          return response.json().then((data) => {throw new Error(data.message)});
        }
      })
      .then((data) => {
        console.log(data);
        alert("Registered successfully!");
        //The user has been successfully registered and will be logged in automatically:
        fetch("http://localhost:5000/api/account/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              return response.json().then((data) => {throw new Error(data.message)});
            }
          })
          .then((data) => {
            console.log(data);
            window.location.href = "/";
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Your account was registered, but there was an issue logging in. Please try again.");
            window.location.href = "/login";
          });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(`Registration failed: ${error}`);
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
        <label htmlFor="username">Username:</label>
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
        <label htmlFor="password">Password:</label>
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
          <label htmlFor="student">Student</label>
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
          <label htmlFor="teacher">Teacher</label>
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
