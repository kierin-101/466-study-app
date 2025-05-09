import React, { useState } from 'react';

export default function JoinClass({teacherView}) {
  const [idEntered, setIdEntered] = useState();
  const [searchResult, setSearchResult] = useState(null);

  // Asks the server if we have a class by the entered id, displays its information if so.
  const findClass = (e) => {
    e.preventDefault(); // prevent refresh
    console.log(`code: ${idEntered}`);
    fetch(`http://localhost:5000/api/class/${idEntered}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to retrieve classes.");
        }
      })
      .then((data) => {
        setSearchResult(
            <div style={{textAlign: "center"}}>
                <h2>Found a class!</h2>
                <h3>{data.class_name}</h3>
                <p>Subject: {data.subject}</p>
                <button type="button" onClick={confirmJoin}>Confirm Join</button>
            </div>
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        setSearchResult(<p>{`Couldn't find a class with code ${idEntered}. Check the code and try again.`}</p>);
      });
  }

  // Asks the server to add the active user to the class they requested to join. If successful, client asks user if they'd
  // like to view that class's page now.
  const confirmJoin = (e) => {
    e.preventDefault(); // prevent refresh
    const classData = {
      class_id: idEntered
    };
    fetch(`http://localhost:5000/api/class/join`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(classData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to join class.");
        }
      })
      .then(() => {
        if (window.confirm("You were successfully added to the class! Go there now?")) {
          window.location.href = `./class?class=${idEntered}`;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setSearchResult(<p>{`There was a problem adding you to the class.`}</p>);
      });
  }
  
  // teacherView prop exists for this purpose: joining classes is a student-only feature.
  if (teacherView) {
    return <h2>Teachers cannot join classes as students. Please create a class instead.</h2>
  } else {
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
        <h1>Join a Class</h1>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label for="classId">Enter the numeric class code provided by your teacher:</label>
          <input
            required
            style={{textAlign:"center"}}
            id="classId"
            type="number"
            min="0"
            onChange={(e) => {
              setIdEntered(e.target.value);
            }}
          ></input>
        </div>
        <button
          type="button"
          onClick={findClass}
        >
          Find Class
        </button>
        {searchResult}
        <br />
      </form>
    );
  }
};