'use client'

import { use, useEffect, useState } from "react";
import GettingStarted from "./components/GettingStarted";
import Dashboard from "./components/Dashboard";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);
  // console.log({isLoggedIn})
  useEffect(() => {
    if (customerId) {
      // setIsLoggedIn(true);
      console.log('customerId', customerId);
      router.push(`/dashboard?id=${customerId}`);
    }
  }, [customerId]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <GettingStarted setId={setCustomerId}/>
    </main>
  );
}
