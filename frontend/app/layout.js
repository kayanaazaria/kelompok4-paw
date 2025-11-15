import { Inter } from 'next/font/google';
import './globals.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
    subsets: ['latin'],
    weight: ['400', '600', '700'], 
    variable: '--font-poppins', 
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} font-sans`}>
      <head>
        <title>Proyek PAW</title>
        {}
      </head>
      <body>
        {}
        {children}
      </body>
    </html>
  );
}