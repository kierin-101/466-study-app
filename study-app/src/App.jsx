import { BrowserRouter, Routes, Route } from 'react-router'
import Dashboard from './components/dashboard'
import NavBar from './components/navbar'
import Footer from './components/footer'
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
          <Route path="/logout" element={<h2>Logout</h2>} />
          {/* 404 Not Found  as a catchall*/}
          <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  )
}

export default App
