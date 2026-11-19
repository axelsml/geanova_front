"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

import Loader from "@/components/Loader";
import Loader80 from "@/components/Loader80";


export const LoadingContext =
  createContext(undefined);


export function LoadingProvider({
  children,
}) {
  const [
    isLoading,
    setIsLoading,
  ] = useState(false);


  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setIsLoading,
      }}
    >

      {children}


      {isLoading && (
        <>
          <Loader80 />
        </>
      )}

    </LoadingContext.Provider>
  );
}


export function useLoading() {
  const context =
    useContext(LoadingContext);


  if (context === undefined) {
    throw new Error(
      "useLoading debe utilizarse dentro de LoadingProvider"
    );
  }


  return context;
}