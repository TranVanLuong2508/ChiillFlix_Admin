import { ClientProviders } from "../providers/ClientProvider";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const metadata = {
  title: "ChillFlix | Admin",
  description: "Next.js App Router Admin Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
