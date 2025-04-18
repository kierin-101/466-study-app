import { useEffect, useState } from "react";

const ClassOverview = () => {
  const [showTeacherOptions] = useState();
  const [classList, setClassList] = useState();

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
        // redirect to home page or show success message
        // window.location.href = "/home";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  //in an effect hook (presumably, will have to retrieve class data and provide links to all user clases)
  const mockClasses = [
    {
      classId: 1,
      className: "Class A",
      subject: "English",
      daily_point_cap: 100
    },
    {
      classId: 2,
      className: "Class B",
      subject: "Math",
      daily_point_cap: 400
    }
  ]

  const userClasses = mockClasses;  //for now

  return (
    <div>
      <h1 style={{marginLeft: "16px"}}>My Classes</h1>
      <div className="wrappingSquareList">
        <div><a className="classOverviewLink" style={{fontSize:"8em"}} href={"/joinClass"}>+</a></div>
        <div><a className="classOverviewLink" href={"/createClass"}>new</a></div>
        {userClasses.map((c) => {
          return (
            <div>
              <a key={`classLink${c.classId}`} className="classOverviewLink" href={`/class?${c.classId}`}>
                <div style={{display:"flex", flexDirection: "column", alignItems: "center"}}>
                  <h1>{c.className}</h1>
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
