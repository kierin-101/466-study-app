import { BrowserRouter, Routes, Route } from 'react-router'
import Dashboard from './components/dashboard'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import SignUp from './components/SignUp'
import Login from './components/Login'
import CreateQuiz from './components/createQuiz'
import TakeQuiz from './components/takeQuiz'
import './App.css'

function App() {
  return (
    <>
      <NavBar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/quizzes" element={<h2>Quizzes</h2>} />
          <Route path="/shop" element={<h2>Shop</h2>} />
          <Route path="/class" element={<h2>Class</h2>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/logout" element={<h2>Logout</h2>} />
          <Route path="/createQuiz" element={<CreateQuiz />} />
          <Route path="/takeQuiz" element={<TakeQuiz />} />
          {/* 404 Not Found  as a catchall*/}
          <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  )
}

export default App
