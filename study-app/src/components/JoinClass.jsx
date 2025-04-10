import React, { useState } from 'react';

export default function JoinClass() {
  const [idEntered, setIdEntered] = useState();
  const [searchResult, setSearchResult] = useState(null);

  const findClass = () => {
    console.log(`code: ${idEntered}`);
    const classData = 1; //this'll be a database fetch eventually
    if (classData) {
        setSearchResult(
            <div>
                <h2>Found a class!</h2>
                <p>Its details go here.</p>
                <button type="button" onClick={confirmJoin}>Confirm Join</button>
            </div>
        );
    } else {
        setSearchResult(<p>{`No class found with id ${idEntered}`}</p>);
    }   
  }

  const confirmJoin = () => {
    //this'll add the user to their class and redirect them to the class
    window.location.href = '../class'
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
};