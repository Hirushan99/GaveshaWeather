import React, { useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import HomePage from './GaveshaHome';
import LoginPage from './GaveshaLogin';
import SignUpForm from "./GaveshaSignUp";
import WeatheerTable from "./WeatheerTable";

function App() {
  const [marks, setMarks] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage setMarks={setMarks} />} />
        <Route path="/signUp" element={<SignUpForm />} />
        <Route path="/home" element={<HomeWrapper setMarks={setMarks} marks={marks} />} />
        <Route path="/weatherTable" element={<WeatheerTable />} />
      </Routes>
    </BrowserRouter>
  );
}

function HomeWrapper({ setMarks, marks }) {
  const location = useLocation();
  const { userId, username } = location.state || {};

  return <HomePage userId={userId} username={username} marks={marks} setMarks={setMarks} />;
}

export default App;
