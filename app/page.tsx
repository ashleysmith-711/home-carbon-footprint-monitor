'use client'

import { useEffect, useState } from "react";
import GettingStarted from "./components/GettingStarted";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState<number | null>(null);

  useEffect(() => {
    if (customerId) {
      console.log('customerId', customerId);
      router.push(`/dashboard`);
    }
  }, [customerId]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <GettingStarted setId={setCustomerId}/>
    </main>
  );
}
