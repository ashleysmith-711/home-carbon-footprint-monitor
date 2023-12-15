'use client'

import { useState } from "react";
import GettingStarted from "./components/GettingStarted";
import Dashboard from "./components/Dashboard";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {!isLoggedIn && <GettingStarted />}
      {isLoggedIn && <Dashboard />}
    </main>
  );
}
