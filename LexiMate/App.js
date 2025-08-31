import React, { useState } from "react";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {" "}
      {isLoggedIn ? (
        <HomeScreen onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <LoginScreen onLogin={() => setIsLoggedIn(true)} />
      )}{" "}
    </>
  );
}
