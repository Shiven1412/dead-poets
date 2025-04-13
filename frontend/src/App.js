import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/header'; // Import the Header component
import Home from './pages/home';
import About from './pages/About';
import Contact from './pages/Contact';
import Signup from './components/SignUp';
import Login from './components/Login';
import UserProfile from './pages/UserProfile';

const AppContainer = styled.div`
  text-align: center;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Header /> {/* Include the Header component */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
