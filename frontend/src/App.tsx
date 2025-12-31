import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProblemList from './pages/ProblemList';
import CreateProblem from './pages/CreateProblem';
import ProblemDetail from './pages/ProblemDetail';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Navigate to="/problems" />} />
                    <Route path="/problems" element={<ProblemList />} />
                    <Route path="/problems/create" element={<CreateProblem />} />
                    <Route path="/problems/:id" element={<ProblemDetail />} />
                    <Route path="/" element={<Navigate to="/login" />} />                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
