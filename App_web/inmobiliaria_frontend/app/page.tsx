"use client";

import { useState } from "react";
export default function Home() {
  const [activeTab, setActiveTab] = useState("Remate");
  return (
    <div>
      <div className="py-50 px-4 bg-[url(/imagen/sala.jpg)]  bg-cover bg-center bg-no-repeat" ></div>
    </div>
  );
}
