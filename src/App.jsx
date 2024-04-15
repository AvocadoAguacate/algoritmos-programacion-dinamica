import './App.css'
import React from "react";
import { useNavigate } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react'
import Router from './routes/Router';
import NavBar from './components/navbar/NavBar';
function App() {
  const navigate = useNavigate();

  return (
    <NextUIProvider navigate={navigate}>
      <NavBar/>
      <Router/>
    </NextUIProvider>
  )
}

export default App
