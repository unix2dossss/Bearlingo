import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        {/* add more routes like login, home later */}
      </Routes>
    </Router>
  );
}

export default App;