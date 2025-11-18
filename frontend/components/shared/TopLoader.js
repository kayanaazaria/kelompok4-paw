"use client";

import { useEffect, useState } from "react";

export default function TopLoader() {
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem("app_initialized");
      if (seen) return; // already saw the initial loader

      setVisible(true);
      // animate to 90% quickly, then to 100% and hide
      setTimeout(() => setWidth(60), 80);
      setTimeout(() => setWidth(85), 240);
      setTimeout(() => setWidth(95), 480);
      setTimeout(() => setWidth(100), 900);
      setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem("app_initialized", "1");
      }, 1100);
    } catch (err) {
      // ignore sessionStorage errors
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed left-0 top-0 w-full h-1 z-50">
      <div className="h-1 bg-gray-200 w-full">
        <div
          className="h-1 bg-green-500 transition-all duration-300"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
