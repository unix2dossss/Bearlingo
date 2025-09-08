import React from 'react'
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CvModule from './pages/CVModule';
import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <div data-theme="lemonade">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/CvModule" element={<CvModule />} />
      </Routes>
    </div>
  )
}

export default App;
