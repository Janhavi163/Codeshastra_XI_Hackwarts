import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import HomePage from "./pages/Home";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect "/" to "/login" or another default page */}
        <Route path="/" element={<Navigate to="/register" />} />

        {/* Define your actual routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path ="/Home" element={<HomePage />}>
        </Route>

        {/* Catch-all for undefined routes (optional) */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;


