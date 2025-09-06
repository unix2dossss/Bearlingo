import React from 'react'
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import { Routes, Route } from 'react-router-dom';
import toast from "react-hot-toast";

const App = () => {
  return (
    <div>
      <button onClick={() => toast.success("yay toast works - frontend branch")} className="btn btn-outline">Click me</button>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
