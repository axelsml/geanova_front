import { useEffect, useState } from "react";

const useInactivity = (timeout = 60000) => {
  // El tiempo de inactividad se establece en milisegundos (por defecto 1 minuto)
  const [isInactive, setIsInactive] = useState(false);
  let timeoutId;

  const resetTimeout = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setIsInactive(true);
    }, timeout);
    setIsInactive(false);
  };

  useEffect(() => {
    const handleActivity = () => resetTimeout();

    // Escucha eventos de actividad del usuario
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    // Iniciar el temporizador
    resetTimeout();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, []);

  return isInactive;
};

export default useInactivity;
