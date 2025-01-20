import { createContext, useState } from "react";
import Loader from "@/components/Loader";

export const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState(100);

  if (typeof window !== "undefined") {
    if (isLoading) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, type, setType }}>
      {isLoading &&
        (type === 80 ? (
          <div className={"loaderAt80"}>
            <Loader />
          </div>
        ) : (
          <div className={"fullScreen"}>
            <Loader />
          </div>
        ))}
      {children}
    </LoadingContext.Provider>
  );
}
