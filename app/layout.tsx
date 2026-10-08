import "./globals.css";

import Nav from "@/components/Nav";

export const metadata = {
  title: "Agrovest - farm to fork, proven",
  description: "Traceable marketplace for small-scale agriculture",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden bg-cream text-leaf">
        <Nav />

        <main className="mx-auto max-w-6xl p-6">{children}</main>
      </body>
    </html>
  );
}
