import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import HomePage from "./pages/Home";
import Chat from "./pages/Chat"; // ✅ Add this

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ HomePage route */}
        <Route path="/Home" element={<HomePage />} />

        {/* ✅ Chat route - make sure this is NOT nested */}
        <Route path="/team-chat" element={<Chat />} />

        {/* 404 Route */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;


