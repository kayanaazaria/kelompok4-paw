import { Inter } from 'next/font/google';
import './globals.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
    subsets: ['latin'],
    weight: ['400', '600', '700'], 
    variable: '--font-poppins', 
    display: 'swap',
});

export const metadata = {
  title: 'SLI Solanum Agrotech', 
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} font-sans`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" href="/path-to-font.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}