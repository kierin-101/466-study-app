import { useEffect, useState } from "react";

// Will show a list of links to all the user's registered classes, as well as a button to either join (for students)
// or create (for teachers) a new class.
const ClassOverview = ({teacherView}) => {
  const [classList, setClassList] = useState([]);

  // Requests active user's list of classes from the server for display.
  useEffect (() => {
    // call class overview API
    fetch("http://localhost:5000/api/class/overview", {
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
        console.log(data);
        setClassList(data.classes);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div>
      <h1 style={{marginLeft: "16px"}}>My Classes</h1>
      <div className="wrappingSquareList">
        <div><a className="classOverviewLink" style={{fontSize:"8em"}} href={teacherView ? "/createClass" : "/joinClass"}>+</a></div>
        {classList.map((c) => {
          return (
            <div>
              <a key={`classLink${c.class_id}`} className="classOverviewLink" href={`/class?class=${c.class_id}`}>
                <div style={{display:"flex", flexDirection: "column", alignItems: "center", textAlign: "center"}}>
                  <h1>{c.class_name}</h1>
                  <h2>{c.subject}</h2>
                </div>
              </a>
            </div>
          )
        })}
      </div>
    </div>
  );
};
export default ClassOverview;