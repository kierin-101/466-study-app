import { BrowserRouter, Routes, Route } from 'react-router'
import Dashboard from './components/dashboard'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import SignUp from './components/SignUp'
import Login from './components/Login'
import Logout from './components/Logout'
import ClassOverview from './components/ClassOverview'
import CreateClass from './components/CreateClass'
import JoinClass from './components/JoinClass'
import Class from './components/Class'
import CreateQuiz from './components/CreateQuiz'
import TakeQuiz from './components/TakeQuiz'
import Shop from './components/Shop'
import './App.css'
import { useEffect, useState } from 'react'


function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [teacherView, setTeacherView] = useState(false);
  const [myUsername, setMyUsername] = useState();
  const [myId, setMyId] = useState();

  useEffect(() => {
     //set user states
     fetch("http://localhost:5000/api/account/me", {
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
          throw new Error("Failed to retrieve user.");
        }
      })
      .then((data) => {
        console.log(data);
        setTeacherView(data.isTeacher);
        setMyUsername(data.username);
        setMyId(data.userId);
        setLoggedIn(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setTeacherView(false);
        setMyUsername(null);
        setMyId(null);
        setLoggedIn(false);
        setLoading(false);
      })
  }, []);

  const checkLoggedIn = () => {
    if (!loggedIn) {
      return <h2>You must be logged in to access this page.</h2>
    }
  }

  if (loading) {
    return <h2 style={{margin: "50vh auto", textAlign: "center"}}>Loading...</h2>
  }

  return (
    <>
      <NavBar loggedIn={loggedIn} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/quizzes" element={<h2>Quizzes</h2>} />
          <Route path="/shop" element={checkLoggedIn() || <Shop username={myUsername}/>} />
          <Route path="/classes" element={checkLoggedIn() || <ClassOverview teacherView={teacherView} />} />
          <Route path="/joinClass" element={checkLoggedIn() || <JoinClass teacherView={teacherView} />} />
          <Route path="/createClass" element={checkLoggedIn() || <CreateClass teacherView={teacherView} />} />
          <Route path="/class" element={checkLoggedIn() || <Class userId={myId} teacherView={teacherView} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/logout" element={<Logout onLogout={() => {setLoggedIn(false)}}/>} />
          <Route path="/createQuiz" element={checkLoggedIn() || <CreateQuiz />} />
          <Route path="/takeQuiz" element={checkLoggedIn() || <TakeQuiz  />} />
          {/* 404 Not Found  as a catchall*/}
          <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  )
}

export default App
