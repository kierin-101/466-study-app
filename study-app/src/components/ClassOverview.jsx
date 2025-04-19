import { useEffect, useState } from "react";

const ClassOverview = ({teacherView}) => {
  const [classList, setClassList] = useState([]);

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
              <a key={`classLink${c.classId}`} className="classOverviewLink" href={`/class?${c.classId}`}>
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