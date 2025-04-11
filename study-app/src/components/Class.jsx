import { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const Class = () => {

  //in an effect hook (presumably, will have to retrieve class data and provide links to all user clases)
  const [showTeacherView] = useState(true); //this will never get changed, once endpoints ready depends on if userData shows we're a teacher
  // also will have to read the class data obviously

  const ClassSidebar = () => {
    return (
        <div style={{height: "100%", width: "20vw", maxWidth: "20vw", background: "lightgrey", position: "fixed"}}>
            <h1 style={{textAlign: "center"}}>Class Name</h1>
            {showTeacherView && <p style={{marginLeft:"8px"}}><b>Join Code: </b>Code</p>}
            <p style={{marginLeft:"8px"}}><b>Subject: </b>Class Subject</p>
            <p style={{marginLeft:"8px"}}><b>Teacher: </b>Teacher</p>
            <p style={{marginLeft:"8px"}}><b>Points Daily: </b>Points</p> {/* would be good to show user's progress toward the cap for the day */}
        </div>
    )
  }

  return (
    <div style={{display: "flex"}}>
      <ClassSidebar />
      <div style={{width: "100vw", height:"100vh", marginLeft: "20vw"}}>
        <Tabs>
          <TabList>
            <Tab>All Quizzes</Tab>
            <Tab>Open Quizzes</Tab>
            <Tab>Upcoming Quizzes</Tab>
            <Tab>Past Quizzes</Tab>
            <Tab>People</Tab>
          </TabList>
        <TabPanel>
          <h2>All Quizzes</h2>
        </TabPanel>
        <TabPanel>
          <h2>Open Quizzes</h2>
        </TabPanel>
        <TabPanel>
          <h2>Upcoming Quizzes</h2>
        </TabPanel>
        <TabPanel>
          <h2>Past Quizzes</h2>
        </TabPanel>
        <TabPanel>
          <h2>People</h2>
        </TabPanel>
      </Tabs>
      </div>
    </div>
  );
};
export default Class;
