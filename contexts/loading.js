import { createContext, useState } from "react";
import Loader from "@/components/Loader";

export const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    document.body.classList.add('overflow-hidden')
  }else{
    document.body.classList.remove('overflow-hidden')
  }

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && <div className={"fullScreen"}><Loader /></div>}
      {children}
    </LoadingContext.Provider>
  );
}
