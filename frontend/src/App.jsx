import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthContext } from "./hooks/useAuthContext";

import Navbar from "./components/NavBar";
import ChallengeSubmissionsPage from "./pages/ChallengeSubmissionsPage";
import TeacherChallengesPage from "./pages/TeacherChallengesPage";
import SubmissionDetailPage from "./pages/SubmissionDetailPage";
import Challenges from "./pages/Challenges";
import ChallengeDetail from "./pages/ChallengeDetail";
import StudentDashboard from "./pages/StudentDashboard";
import CreateChallengePage from "./pages/CreateChallenge";
import TeacherInsightsDashboard from "./pages/TeacherInsightsDashboard";
import ChallengesInsightsPage from "./pages/ChallengeInsights";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

function App() {
  const { user } = useAuthContext();

  // Decide the redirect path based on the user's role.
  const redirectPath = user?.role === "teacher" ? "/teacher/challenges" : "/challenges";

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Login/Signup routes: if user exists, redirect accordingly */}
        <Route
          path="/signup"
          element={user ? <Navigate to={redirectPath} replace /> : <Signup />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to={redirectPath} replace /> : <Login />}
        />

        {/* Teacher-only routes */}
        {user && user.role === "teacher" && (
          <>
            <Route path="/teacher/challenges/:challengeId/submissions" element={<ChallengeSubmissionsPage />} />
            <Route path="/teacher/challenges" element={<TeacherChallengesPage />} />
            <Route path="/teacher/submissions/:submissionId" element={<SubmissionDetailPage />} />
            <Route path="/challenges/:id/insights" element={<TeacherInsightsDashboard />} />
            <Route path="/challenges/new" element={<CreateChallengePage />} />
            <Route path="/challenges/insights" element={<ChallengesInsightsPage />} />
            {/* Catch-all for teachers */}
            <Route path="*" element={<Navigate to="/teacher/challenges" replace />} />
          </>
        )}

        {/* Student-only routes */}
        {user && user.role === "student" && (
          <>
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/challenges/:id" element={<ChallengeDetail />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            {/* Catch-all for students */}
            <Route path="*" element={<Navigate to="/challenges" replace />} />
          </>
        )}

        {/* Fallback: if no user is logged in, redirect unknown routes to login */}
        {!user && (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
