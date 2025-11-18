import { Inter } from 'next/font/google';
import './globals.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'], 
    variable: '--font-poppins', 
    display: 'swap',
});

export const metadata = {
  title: 'SLI Solanum Agrotech', 
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={poppins.className} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}