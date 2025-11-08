"use client";

import { useEffect } from "react";

export function ThemeManager({ children }: { children: React.ReactNode }) {
  
  useEffect(() => {
    // Función para verificar la hora y aplicar el tema
    const updateTheme = () => {
      const currentHour = new Date().getHours();
      const htmlElement = document.documentElement;

      // Lógica de "medianoche" (ej. de 00:00 a 6:00 AM)
      if (currentHour >= 19 || currentHour < 6) {
        htmlElement.classList.add("dark");
      } else {
        htmlElement.classList.remove("dark");
      }
    };

    // 1. Ejecutar al cargar la página
    updateTheme();

    // 2. Opcional: Re-verificar cada hora
    // Si dejas la app abierta, esto la cambiará sin recargar
    const interval = setInterval(updateTheme, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}