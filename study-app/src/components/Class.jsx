import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import AvatarDisplay from "./AvatarDisplay";

const Class = ({ userId, teacherView }) => {
  const classId = new URLSearchParams(window.location.search).get("class"); //grabs class_id from the url
  const [classData, setClassData] = useState({
    class_id: null,
    class_name: null,
    subject: null,
    daily_point_cap: null,
  });
  const [peopleList, setPeopleList] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [isMember, setIsMember] = useState(false); // To verify user is a class member
  const [loading, setLoading] = useState(true); // Prevent premature blocking of members from accessing the page when data is being fetched

  useEffect(() => {
    // call class details API
    fetch(`http://localhost:5000/api/class/${classId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to retrieve class data");
        }
      })
      .then((data) => {
        setClassData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    //call class members api
    fetch(`http://localhost:5000/api/class/${classId}/members`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to retrieve class members data");
        }
      })
      .then((data) => {
        setPeopleList(data);
        if (
          data.filter((person) => {
            return person.user_id === userId;
          }).length
        ) {
          setIsMember(true);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    //call class quizzes api
    fetch(`http://localhost:5000/api/class/${classId}/quizzes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to retrieve class quizzes data");
        }
      })
      .then((data) => {
        setQuizList(
          data.quizzes.map((quiz) => {
            const highScore = fetch(
              `http://localhost:5000/api/quiz/retrieve-high-scores/${quiz.quiz_id}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
              .then((response) => {
                if (response.ok) {
                  return response.json();
                } else {
                  throw new Error("Failed to retrieve class quizzes data");
                }
              })
              .then((data) => {
                console.log(data);
                const userRecord = data.filter((record) => record.user_id === userId)[0]?.high_score;
                return userRecord === undefined ? "N/A" : userRecord;
              })
              .catch((error) => {
                console.error("Error: ", error);
                return "Could not find...";
              });
            return { ...quiz, high_score: highScore };
          })
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [classId]);

  // Basic details of the class are shown on a fixed sidebar.
  const ClassSidebar = () => {
    return (
      <div
        style={{
          height: "100%",
          width: "20vw",
          maxWidth: "20vw",
          background: "lightgrey",
          position: "fixed",
        }}
      >
        <h1 style={{ textAlign: "center" }}>{classData.class_name}</h1>
        {teacherView && (
          <p style={{ marginLeft: "8px" }}>
            <b>Join Code: </b>
            {classData.class_id}
          </p>
        )}
        <p style={{ marginLeft: "8px" }}>
          <b>Subject: </b>
          {classData.subject}
        </p>
        <p style={{ marginLeft: "8px" }}>
          <b>Points Daily: </b>
          {classData.daily_point_cap}
        </p>{" "}
        {/* would be good to show user's progress toward the cap for the day */}
      </div>
    );
  };

  // Displays a given class member's profile; retains index for the teacher view case so the list can be adjusted by the client
  // once the server successfully removes someone rather than needing an extra database fetch to update the list.
  const displayPerson = (personDetails, index) => {
    const avatar = personDetails.active_rewards?.filter((reward) => {
      return reward.reward_type_id === 1;
    })[0]?.reward_name;
    const title = personDetails.active_rewards?.filter((reward) => {
      return reward.reward_type_id === 2;
    })[0]?.reward_name;
    const theme = personDetails.active_rewards?.filter((reward) => {
      return reward.reward_type_id === 3;
    })[0]?.reward_name;

    return (
      <div
        key={`person${personDetails.user_id}`}
        style={{
          width: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "8px",
          border: "8px solid lightgrey",
          borderRadius: "8px",
        }}
      >
        <div
          className="personDetails"
          style={{
            width: "80%",
            display: "flex",
            alignItems: "center",
            justifyContent: "spaceBetween",
            gap: "16px",
          }}
        >
          <AvatarDisplay
            dimension="64px"
            avatarName={avatar}
            borderName={theme}
          />
          <h3 style={{ width: "25%" }}>{personDetails.username}</h3>
          <p style={{ width: "25%" }}>{title}</p>
          <p style={{ width: "25%" }}>
            {personDetails.is_teacher ? "Teacher" : "Student"}
          </p>
        </div>
        {!personDetails.is_teacher && teacherView && (
          <button
            onClick={() => {
              removeMember(personDetails, index);
            }}
          >
            Remove User
          </button>
        )}
      </div>
    );
  };

  // Only shown to active users who are teachers, they can remove a student from their class by pressing the button beside their name.
  // Asks the server to delete the class from the target user's list of active classes.
  const removeMember = (personDetails, index) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${personDetails.username} from the class?`
      )
    ) {
      // call user removal API
      fetch(
        `http://localhost:5000/api/class/${classId}/user/${personDetails.user_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to remove user");
          }
        })
        .then((data) => {
          const updatedPeople = [...peopleList];
          updatedPeople.splice(index, 1);
          setPeopleList(updatedPeople);
          alert("Successfully removed user.");
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("There was an issue removing the user. Please try again.");
        });
    }
  };

  const displayQuiz = (quizDetails) => {
    return (
      <div
        key={`quiz${quizDetails.quiz_id}`}
        style={{
          width: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          gap: "16px",
          padding: "8px",
          border: "8px solid lightgrey",
          borderRadius: "8px",
        }}
      >
        <a
          href={`./takeQuiz?quiz=${quizDetails.quiz_id}`}
          className="quizLink"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <h3 style={{ width: "20%" }}>{quizDetails.title}</h3>
          <p style={{ width: "20%" }}>
            <b>Released: </b>
            {new Date(quizDetails.release_timestamp).toDateString()}
          </p>
          <p style={{ width: "20%" }}>
            <b>Due: </b>
            {new Date(quizDetails.due_timestamp).toDateString()}
          </p>
          <p style={{ width: "20%" }}>
            <b>Target Score: </b>
            {quizDetails.target_score || "None"}
          </p>
          <p style={{ width: "20%" }}>
            <b>My Record: </b>
            {quizDetails.high_score}
          </p>
        </a>
      </div>
    );
  };

  if (loading) {
    return (
      <h2 style={{ margin: "50vh auto", textAlign: "center" }}>Loading...</h2>
    );
  }

  // Should not provide class access to people who are not in the class.
  if (!isMember) {
    return <h2>You are not a member of this class.</h2>;
  }

  return (
    <div style={{ display: "flex" }}>
      <ClassSidebar />
      <div
        style={{
          width: "100vw",
          minHeight: "95vh",
          height: "auto",
          marginLeft: "20vw",
          marginBottom: "16px",
        }}
      >
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                margin: "0px 16px",
              }}
            >
              <a
                href={"/createQuiz?" + window.location.search.slice(1)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "lightgrey",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: "black",
                }}
              >
                <h3 style={{ width: "20%" }}>Create New Quiz</h3>
              </a>
              {quizList.map((quiz) => displayQuiz(quiz))}
            </div>
          </TabPanel>
          <TabPanel>
            <h2 style={{ marginLeft: "16px" }}>Open Quizzes</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                margin: "0px 16px",
              }}
            >
              {quizList
                .filter((quiz) => {
                  const now = new Date();
                  return (
                    new Date(quiz.due_timestamp) > now &&
                    new Date(quiz.release_timestamp) <= now
                  );
                })
                .map((quiz) => displayQuiz(quiz))}
            </div>
          </TabPanel>
          <TabPanel>
            <h2 style={{ marginLeft: "16px" }}>Upcoming Quizzes</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                margin: "0px 16px",
              }}
            >
              {quizList
                .filter((quiz) => {
                  const now = new Date();
                  return new Date(quiz.release_timestamp) >= now;
                })
                .map((quiz) => displayQuiz(quiz))}
            </div>
          </TabPanel>
          <TabPanel>
            <h2 style={{ marginLeft: "16px" }}>Past Quizzes</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                margin: "0px 16px",
              }}
            >
              {quizList
                .filter((quiz) => {
                  const now = new Date();
                  return new Date(quiz.due_timestamp) < now;
                })
                .map((quiz) => displayQuiz(quiz))}
            </div>
          </TabPanel>
          <TabPanel>
            <h2 style={{ marginLeft: "16px" }}>People</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                margin: "0px 16px",
              }}
            >
              {peopleList.map((person, index) => displayPerson(person, index))}
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};
export default Class;
