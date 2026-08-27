import "./globals.css";

import AppShell from "@/components/layout/AppShell";

import {
  GeanovaThemeProvider,
} from "@/components/providers/GeanovaThemeProvider";

import {
  LoadingProvider,
} from "@/contexts/loading";

export const metadata = {
  title: "Geanova",
  description:
    "Sistema administrativo inmobiliario",
};

export default function RootLayout({
  children,
}) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
    >
      <body>
        <GeanovaThemeProvider>

          <LoadingProvider>

            <AppShell>
              {children}
            </AppShell>

          </LoadingProvider>

        </GeanovaThemeProvider>
      </body>
    </html>
  );
}