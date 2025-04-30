import { useEffect, useState } from "react";

const Logout = ({onLogout}) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/account/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Logout failed.");
        }
      })
      .then(() => {
        onLogout();
        setMessage("You have been logged out.");
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("There was an issue logging you out. Please try again.");
      });
  }, [onLogout]);

  return <h2>{message}</h2>;
};
export default Logout;
