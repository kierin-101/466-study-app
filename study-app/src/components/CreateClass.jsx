import React, { useState } from 'react';

export default function CreateClass({teacherView}) {
  const [className, setClassName] = useState('');
  const [classSubject, setClassSubject] = useState('');
  const [pointsCap, setPointsCap] = useState(100);

  // A basic list of subjects.
  const subjects = [
    "English",
    "Math",
    "Science",
    "History",
    "Theater",
    "Chemistry",
    "Geography",
    "Geology",
    "Physics",
    "Computer Science",
    "Health",
    "Psychology",
    "Language",
    "Art"
  ]

  // Asks the server to create a new class under the details given.
  const submitClass = (e) => {
    e.preventDefault(); // prevent refresh
    const classInfo = {
      class_name: className,
      subject: classSubject,
      daily_point_cap: pointsCap,
    };
    console.log(classInfo);
    // call class creation API
    fetch("http://localhost:5000/api/class/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(classInfo),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to create class.");
        }
      })
      .then((data) => {
        console.log(data.class.class_id);
        // Adds the class creator to the class.
        fetch("http://localhost:5000/api/class/join", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({class_id: data.class.class_id}),
        })
          .then((response) => {
            if (response.ok) {
              if (window.confirm("Successfully created your class! View it now?")) {
                window.location.href = `./class?class=${data.class.class_id}`;
              }
            } else {
              throw new Error("Failed to join the created class.");
            }
      })})
      .catch((error) => {
        console.error("Error:", error);
        alert(error);
      });
  }

  // Students cannot create classes, so teacherView prop acts as a permissions check.
  if (!teacherView) {
    return <h2>Sorry, student accounts cannot create classes. If you are a teacher, please sign up with a teacher account.</h2>
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
        onSubmit={submitClass}
      >
        <h1>Create a Class</h1>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="className">Class Name:</label>
          <input
            id="className"
            required
            maxLength={100}
            onChange={(e) => {
              setClassName(e.target.value);
            }}
          ></input>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="subject">Subject:</label>
          <select
            id="subject"
            required
            defaultValue={""}
            onChange={(e) => {
              setClassSubject(e.target.value);
            }}
          >
            <option disabled value="">Choose a Subject</option>
            {subjects.map((subject) => {
              return (<option key={subject}>{subject}</option>)
            })}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="points">Daily Points Cap:</label>
          <input
            id="points"
            type="number"
            required
            min="100"
            max="500"
            value={pointsCap}
            onChange={(e) => {
              setPointsCap(e.target.value);
            }}
          ></input>
        </div>
        <button>
          Create Now
        </button>
        <br />
      </form>
    );
  }
};