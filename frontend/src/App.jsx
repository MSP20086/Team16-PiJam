import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Challenges from './pages/Challenges';
import ChallengeDetail from './pages/ChallengeDetail';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/challenges/:id" element={<ChallengeDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
