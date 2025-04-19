import { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AvatarDisplay from "./AvatarDisplay";

const mockQuizzes = [
  {
    quizId: 1,
    quizName: "Scheduled Quiz",
    releaseDate: new Date(2027, 1, 1),
    dueDate: new Date(2027, 1, 2),
    targetScore: 100
  },
  {
    quizId: 2,
    quizName: "Closed Quiz",
    releaseDate: new Date(2024, 8, 21),
    dueDate: new Date(2024, 8, 30)
  },
  {
    quizId: 3,
    quizName: "Open Quiz",
    releaseDate: new Date(2025, 3, 11),
    dueDate: new Date(2026, 1, 1),
    targetScore: 100
  }
];
const mockPeople = [
  {
    userId: 1,
    username: "example_user1",
    isTeacher: false,
    //probably in theory want their active rewards data to display too
  },
  {
    userId: 2,
    username: "example_user2",
    isTeacher: false,
  },
  {
    userId: 3,
    username: "example_teacher",
    isTeacher: true,
  }
];

const Class = ({teacherView}) => {

  //in an effect hook (presumably, will have to retrieve class data and provide links to all user clases)
  const [peopleList, setPeopleList] = useState(mockPeople.concat(mockPeople)); //change this later
  const [quizList, setQuizList] = useState(mockQuizzes.concat(mockQuizzes));
  // also will have to read the class data obviously

  //TODO: read classId from url, then fetch people and quizzes accordingly

  const ClassSidebar = () => {
    return (
      <div style={{ height: "100%", width: "20vw", maxWidth: "20vw", background: "lightgrey", position: "fixed" }}>
        <h1 style={{ textAlign: "center" }}>Class Name</h1>
        {teacherView && <p style={{ marginLeft: "8px" }}><b>Join Code: </b>Code</p>}
        <p style={{ marginLeft: "8px" }}><b>Subject: </b>Class Subject</p>
        <p style={{ marginLeft: "8px" }}><b>Teacher: </b>Teacher</p>
        <p style={{ marginLeft: "8px" }}><b>Points Daily: </b>Points</p> {/* would be good to show user's progress toward the cap for the day */}
      </div>
    )
  }

  const displayPerson = (personDetails, index) => {
    return (
      <div key={`person${personDetails.personId}`} style={{ width: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "8px", border: "8px solid lightgrey", borderRadius: "8px" }}>
        <div className="personDetails" style={{ width: "80%", display: "flex", alignItems: "center", justifyContent: "spaceBetween", gap: "16px" }}>
          <AvatarDisplay dimension="64px" avatarName="test" borderName="test" />
          <h3 style={{ width: "25%" }}>{personDetails.username}</h3>
          <p style={{ width: "25%" }}>Title here</p>
          <p style={{ width: "25%" }}>{personDetails.isTeacher ? "Teacher" : "Student"}</p>
        </div>
        {(!personDetails.isTeacher && teacherView) && <button onClick={() => { removeMember(personDetails, index); }}>Remove User</button>}
      </div>
    )
  }

  const removeMember = (personDetails, index) => {
    //add logic to actually remove this person from the class in db
    if (window.confirm(`Are you sure you want to remove ${personDetails.username} from the class?`)) {
      const updatedPeople = [...peopleList];
      updatedPeople.splice(index, 1);
      setPeopleList(updatedPeople);
    }
  }

  const displayQuiz = (quizDetails) => {
    return (
      <div key={`quiz${quizDetails.quizId}`} style={{ width: "auto", display: "flex", alignItems: "center", justifyContent: "start", gap: "16px", padding: "8px", border: "8px solid lightgrey", borderRadius: "8px" }}>
        <a href='./takeQuiz' className="quizLink" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
          <h3 style={{ width: "20%" }}>{quizDetails.quizName}</h3>
          <p style={{ width: "20%" }}><b>Released: </b>{quizDetails.releaseDate.toDateString()}</p>
          <p style={{ width: "20%" }}><b>Due: </b>{quizDetails.dueDate.toDateString()}</p>
          <p style={{ width: "20%" }}><b>Target Score: </b>{quizDetails.targetScore || "None"}</p>
          <p style={{ width: "20%" }}><b>My Record: </b>todo</p>
        </a>
      </div>
    )
  }

  return (
    <div style={{ display: "flex" }}>
      <ClassSidebar />
      <div style={{ width: "100vw", minHeight: "95vh", height: "auto", marginLeft: "20vw", marginBottom: "16px" }}>
        <Tabs>
          <TabList>
            <Tab>All Quizzes</Tab>
            <Tab>Open Quizzes</Tab>
            <Tab>Upcoming Quizzes</Tab>
            <Tab>Past Quizzes</Tab>
            <Tab>People</Tab>
          </TabList>
          <TabPanel>
            <h2 style={{ marginLeft: "16px" }}>All Quizzes</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", margin: "0px 16px" }}>
              <a
                href={"/createQuiz?class=" + (window.location.search.slice(1))}
                style={{
                  width: "100%", display: "flex", alignItems: "center",
                  justifyContent: "center", background: "lightgrey",
                  borderRadius: "8px", textDecoration: "none", color: "black"
                }}>
                <h3 style={{ width: "20%" }}>Create New Quiz</h3>
              </a>
              {quizList.map((quiz) => displayQuiz(quiz))}
            </div>
          </TabPanel>
          <TabPanel>
            <h2 style={{ marginLeft: "16px" }}>Open Quizzes</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", margin: "0px 16px" }}>
              {quizList.filter((quiz) => { const now = new Date(); return quiz.dueDate > now && quiz.releaseDate <= now }).map((quiz) => displayQuiz(quiz))}
            </div>
          </TabPanel>
          <TabPanel>
            <h2 style={{ marginLeft: "16px" }}>Upcoming Quizzes</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", margin: "0px 16px" }}>
              {quizList.filter((quiz) => { const now = new Date(); return quiz.releaseDate >= now }).map((quiz) => displayQuiz(quiz))}
            </div>
          </TabPanel>
          <TabPanel>
            <h2 style={{ marginLeft: "16px" }}>Past Quizzes</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", margin: "0px 16px" }}>
              {quizList.filter((quiz) => { const now = new Date(); return quiz.dueDate < now }).map((quiz) => displayQuiz(quiz))}
            </div>
          </TabPanel>
          <TabPanel>
            <h2 style={{ marginLeft: "16px" }}>People</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", margin: "0px 16px" }}>
              {peopleList.map((person, index) => displayPerson(person, index))}
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};
export default Class;
