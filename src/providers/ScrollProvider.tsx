"use client";
import React, { createContext, useContext, useRef } from "react";

type Section = "upload" | "generate" | "visualize";

type ScrollContextType = {
  uploadRef: React.RefObject<HTMLDivElement | null>;
  generateRef: React.RefObject<HTMLDivElement | null>;
  visualizeRef: React.RefObject<HTMLDivElement | null>;
  scrollTo: (section: Section) => void;
};

const ScrollContext = createContext<ScrollContextType | null>(null);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const uploadRef = useRef<HTMLDivElement>(null);
  const generateRef = useRef<HTMLDivElement>(null);
  const visualizeRef = useRef<HTMLDivElement>(null);

  const scrollTo = (section: Section) => {
    const map = {
      upload: uploadRef,
      generate: generateRef,
      visualize: visualizeRef,
    };
    map[section]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <ScrollContext.Provider
      value={{ uploadRef, generateRef, visualizeRef, scrollTo }}
    >
      {children}
    </ScrollContext.Provider>
  );
}

export const useScroll = () => {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useScroll must be used within ScrollProvider");
  return ctx;
};
