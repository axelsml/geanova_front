"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

import Loader from "@/components/Loader";


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
        <div
          className="global-loader-overlay"
          role="status"
          aria-live="polite"
          aria-label="Cargando"
        >
          <div className="global-loader-content">
            <Loader />
          </div>
        </div>
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