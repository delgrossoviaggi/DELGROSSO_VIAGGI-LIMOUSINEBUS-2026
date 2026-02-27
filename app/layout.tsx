import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

export const metadata: Metadata = {
  title: "Del Grosso Viaggi & Limousine Bus",
  description: "Servizi professionali per eventi, party tour, viaggi organizzati e trasferte. Comfort, stile e affidabilità.",
  metadataBase: new URL("https://www.delgrossoviaggi.it"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <Navbar />
        <main className="container py-10">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
