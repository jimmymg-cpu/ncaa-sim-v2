import React from 'react';
import './globals.css';

export const metadata = {
  title: 'JJ NCAASIM2026',
  description: 'NCAA Basketball Simulation Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=Teko:wght@500;600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{
          __html: `
          body {
            background-color: #050505;
            color: #f1f5f9;
            overflow-x: hidden;
            font-family: 'Inter', sans-serif;
            background-image: radial-gradient(circle at 50% -20%, #171717 0%, #000000 70%);
            background-attachment: fixed;
          }
          .scanline {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100px;
            z-index: 10;
            background: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(0,0,0,0) 100%);
            opacity: 0.1;
            background-size: 100% 4px;
            animation: scanline 10s linear infinite;
            pointer-events: none;
          }
          @keyframes scanline {
            0% { top: -100px; }
            100% { top: 100%; }
          }
          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-track {
            background: #0f172a; 
          }
          ::-webkit-scrollbar-thumb {
            background: #334155; 
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #475569; 
          }
        `}} />
      </head>
      <body>
        <div id="root">{children}</div>
        <div className="scanline"></div>
      </body>
    </html>
  );
}
