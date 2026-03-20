import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

// import Landing          from './pages/Landing.jsx'
import Login            from './pages/Login.jsx'
import Register         from './pages/Register.jsx'
import Companies        from './pages/Companies.jsx'
// import TrackDetail      from './pages/TrackDetail.jsx'
// import LessonPlayer     from './pages/LessonPlayer.jsx'
import MockTest         from './pages/MockTest.jsx'
// import TestResult       from './pages/TestResult.jsx'
import Leaderboard      from './pages/Leaderboard.jsx'
// import MyProgress       from './pages/MyProgress.jsx'
// import InterviewQA      from './pages/InterviewQA.jsx'
// import InstructorDash   from './pages/InstructorDashboard.jsx'
// import AdminDash        from './pages/AdminDashboard.jsx'
import Dashboard        from './pages/Dashboard.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        // <Route path="/"                       element={<Landing />} />
        <Route path="/login"                  element={<Login />} />
        <Route path="/register"               element={<Register />} />
        <Route path="/companies"              element={<ProtectedRoute><Companies /></ProtectedRoute>} />
        <Route path="/companies/:slug"        element={<ProtectedRoute><TrackDetail /></ProtectedRoute>} />
        <Route path="/lesson/:lessonId"       element={<ProtectedRoute><LessonPlayer /></ProtectedRoute>} />
        <Route path="/test/:testId"           element={<ProtectedRoute><MockTest /></ProtectedRoute>} />
        <Route path="/test/result/:resultId"  element={<ProtectedRoute><TestResult /></ProtectedRoute>} />
        <Route path="/leaderboard"            element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/progress"               element={<ProtectedRoute><MyProgress /></ProtectedRoute>} />
        //<Route path="/interview-qa/:trackId"  element={<ProtectedRoute><InterviewQA /></ProtectedRoute>} />
        <Route path="/dashboard"              element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/instructor"             element={<ProtectedRoute role="instructor"><InstructorDash /></ProtectedRoute>} />
        //<Route path="/admin"                  element={<ProtectedRoute role="admin"><AdminDash /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}