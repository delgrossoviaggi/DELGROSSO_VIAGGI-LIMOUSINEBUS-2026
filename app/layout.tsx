export const metadata = {
  title: "DELGROSSO VIAGGI & Limousine Bus",
  description: "DelGrosso Viaggi & Limousine Bus – Eventi, foto, preventivi e prenotazioni.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto" }}>
        {children}
      </body>
    </html>
  );
}