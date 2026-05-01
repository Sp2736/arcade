import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'ARCADE',
  description: 'Academic Resource Center and Development Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* The Providers wrapper gives all components access to useSession() */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}