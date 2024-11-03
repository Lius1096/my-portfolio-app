import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Login from './components/Login';  // Importer la page de connexion
import Signup from './components/Signup'; // Importer la page d'inscription
import UserDashboard from './components/UserDashboard'; // Importe ton UserDashboard
import AdminDashboard from './components/AdminDashboard'; // Importe ton UserDashboard
import ForgotPassword from './components/ForgotPassword';
import Hero from './components/Hero';
import About from './components/About';
import Expertise from './components/Expertises';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Skills from './components/Skills';
import Reviews from './components/Avis';
import { Navigate } from 'react-router-dom';
import ProjectRequestForm from './components/ProjectRequestForm';
import DeleteUser from './components/DeleteUser';
import Goodbye from './components/Goodbye';


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Vérifier si un token est présent
  return token ? children : <Navigate to="/login" />;
};



const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />      {/* Route pour la connexion */}
        <Route path="/hero" element={<Hero />} />      {/* Route pour la connexion */}
        <Route path="/about" element={<About />} />      {/* Route pour la connexion */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/expertises" element={<Expertise />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/portfolio" element={<Portfolio />} />
         <Route path="/signup" element={<Signup />} />    {/* Route pour l'inscription */}
         <Route path="/userdashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
         <Route path="/admindashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
         <Route path="/demande-projet" element={<ProjectRequestForm />} />
         <Route path="/goodbye" element={<Goodbye />} />
         <Route path="/delete-user" element={<DeleteUser />} />
         <Route path="*" element={<NotFound />} />



      </Routes>
    </Router>
  );
}

export default App;
