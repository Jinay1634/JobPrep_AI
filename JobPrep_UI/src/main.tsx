import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Protected from "./pages/Protected.tsx";
import { Home } from "./pages/Home.tsx";
import { AuthProvider } from "../context/AuthContextProvider.tsx";
import Signup from "./pages/Signup.tsx";
import Interview from "./pages/Interview.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider>
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<Protected />}>
            <Route path="/home" element={<Home />} />
            <Route path="/app" element={<App />} />
            <Route path="/interview/:roleId" element={<Interview />} />
          </Route>
           <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>
);
