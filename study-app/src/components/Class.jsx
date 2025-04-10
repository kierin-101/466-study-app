import { useState } from "react";

const Class = () => {

  //in an effect hook (presumably, will have to retrieve class data and provide links to all user clases)
  const [showTeacherView] = useState(true); //this will never get changed, once endpoints ready depends on if userData shows we're a teacher
  // also will have to read the class data obviously

  const ClassSidebar = () => {
    return (
        <div style={{height: "100%", width: "20%", background: "lightgrey", position: "fixed"}}>
            <h1 style={{textAlign: "center"}}>Class Name</h1>
            {showTeacherView && <p><b>Join Code: </b>Code</p>}
            <p><b>Subject: </b>Class Subject</p>
            <p><b>Teacher: </b>Teacher</p>
            <p><b>Points Daily: </b>Points</p> {/* would be good to show user's progress toward the cap for the day */}
        </div>
    )
  }

  return (
    <div style={{display: "flex"}}>
      <ClassSidebar />
      <div style={{marginLeft: "20%"}}>
        <h1 style={{height:"100vh"}}>Here's where I'll have a quizzes tab and a people tab...</h1>
      </div>
    </div>
  );
};
export default Class;
