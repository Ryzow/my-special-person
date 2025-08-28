"use client";

import "@/app/globals.css";
import { ReactNode } from "react";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="id" className="h-full">
      <head>
        <title>Seberapa Besar Cintaku</title>
        <meta name="description" content="Website romantis interaktif untuk menunjukkan seberapa besar cintamu" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="h-full bg-gradient-to-b from-rose-950 via-fuchsia-900 to-indigo-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
