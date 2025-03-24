import ChallengeSubmissionsPage from "./pages/ChallengeSubmissionsPage";
import TeacherChallengesPage from "./pages/TeacherChallengesPage";
import SubmissionDetailPage from "./pages/SubmissionDetailPage";
import Navbar from "./components/NavBar";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Challenges from './pages/Challenges';
import ChallengeDetail from './pages/ChallengeDetail';
import StudentDashboard from './pages/StudentDashboard';
import CreateChallengePage from "./pages/CreateChallenge"
import TeacherInsightsDashboard from "./pages/TeacherInsightsDashboard";
function App() {
  return (
    <>
    <Navbar />
    <Router>
      <Routes>
        {/* Teacher Routes */}
        <Route path="/teacher/challenges/:challengeId/submissions" element={<ChallengeSubmissionsPage />} />
        <Route path="/teacher/challenges" element={<TeacherChallengesPage />} />
        <Route path="/teacher/submissions/:submissionId" element={<SubmissionDetailPage />} />
        <Route path="/" element={<StudentDashboard />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/challenges/:id" element={<ChallengeDetail />} />
        <Route path="/challenges/new" element={<CreateChallengePage />} />
        <Route path="/challenges/:id/insights" element={<TeacherInsightsDashboard />} />
        <Route path="*" element={<TeacherChallengesPage />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
