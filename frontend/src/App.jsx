import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChallengeSubmissionsPage from "./pages/ChallengeSubmissionsPage";
import TeacherChallengesPage from "./pages/TeacherChallengesPage";
import SubmissionDetailPage from "./pages/SubmissionDetailPage";
import Navbar from "./components/NavBar";
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
        <Route path="*" element={<TeacherChallengesPage />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
