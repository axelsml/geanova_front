"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ConfigProvider,
  theme as antdTheme,
} from "antd";

const GeanovaThemeContext = createContext(null);

export function GeanovaThemeProvider({
  children,
}) {
  const [tema, setTema] = useState("light");

  useEffect(() => {
    const guardado =
      localStorage.getItem("geanova-theme");

    const inicial =
      guardado === "dark"
        ? "dark"
        : "light";

    aplicarTema(inicial);
    setTema(inicial);
  }, []);

  const cambiarTema = () => {
    const nuevo =
      tema === "dark"
        ? "light"
        : "dark";

    setTema(nuevo);

    aplicarTema(nuevo);

    localStorage.setItem(
      "geanova-theme",
      nuevo
    );
  };

  const configAntd = useMemo(() => {
    const oscuro = tema === "dark";

    return {
      algorithm: oscuro
        ? antdTheme.darkAlgorithm
        : antdTheme.defaultAlgorithm,

      token: {
        colorPrimary: "#438dcc",

        colorSuccess: "#23a26d",
        colorWarning: "#d99a20",
        colorError: "#dc4c4c",

        borderRadius: 10,

        controlHeight: 40,

        fontFamily:
          "'Montserrat', sans-serif",

        colorBgBase: oscuro
          ? "#081321"
          : "#f5f8fc",

        colorBgContainer: oscuro
          ? "#0e1d2d"
          : "#ffffff",

        colorBgElevated: oscuro
          ? "#122438"
          : "#ffffff",

        colorBorder: oscuro
          ? "#22384c"
          : "#e2e8f0",

        colorText: oscuro
          ? "#f1f5f9"
          : "#1f2937",

        colorTextSecondary: oscuro
          ? "#b1becd"
          : "#64748b",
      },

      components: {
        Button: {
          borderRadius: 10,
          controlHeight: 40,
          fontWeight: 600,
        },

        Input: {
          borderRadius: 10,
          controlHeight: 40,
        },

        InputNumber: {
          borderRadius: 10,
          controlHeight: 40,
        },

        Select: {
          borderRadius: 10,
          controlHeight: 40,
        },

        Modal: {
          borderRadiusLG: 14,
        },

        Table: {
          headerBg: oscuro
            ? "#122438"
            : "#f8fafc",

          headerColor: oscuro
            ? "#b1becd"
            : "#64748b",

          rowHoverBg: oscuro
            ? "#172b40"
            : "#f1f6fb",
        },
      },
    };
  }, [tema]);

  return (
    <GeanovaThemeContext.Provider
      value={{
        tema,
        cambiarTema,
      }}
    >
      <ConfigProvider
        theme={configAntd}
      >
        {children}
      </ConfigProvider>
    </GeanovaThemeContext.Provider>
  );
}

export function useGeanovaTheme() {
  const context =
    useContext(GeanovaThemeContext);

  if (!context) {
    throw new Error(
      "useGeanovaTheme debe utilizarse dentro de GeanovaThemeProvider"
    );
  }

  return context;
}

function aplicarTema(tema) {
  document.documentElement.setAttribute(
    "data-theme",
    tema
  );
}