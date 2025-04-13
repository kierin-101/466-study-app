import React, { useState } from 'react';

export default function CreateClass() {
  const [className, setClassName] = useState('');
  const [classSubject, setClassSubject] = useState('');
  const [pointsCap, setPointsCap] = useState(0);

  //how specific do we want to get with these
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
    "Language"
  ]

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
      <h1>Create a Class</h1>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label for="className">Class Name:</label>
        <input
          id="className"
          onChange={(e) => {
            setClassName(e.target.value);
          }}
        ></input>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label for="subject">Subject:</label>
        <select
          id="subject"
          onChange={(e) => {
            setClassSubject(e.target.value);
          }}
        >
          <option disabled selected>Choose a Subject</option>
          {subjects.map((subject) => {
            return (<option>{subject}</option>)
          })}
        </select>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label for="points">Daily Points Cap:</label>
        <input
          id="points"
          type="number"
          value="100"
          min="100"
          max="500"
          onChange={(e) => {
            setPointsCap(e.target.value);
          }}
        ></input>
      </div>
      <button
        type="button"
        onClick={() => {
          console.log(
            `name: ${className} subject: ${classSubject} pointcap: ${pointsCap}`
          );
        }}
      >
        Create Now
      </button>
      <br />
    </form>
  );
};