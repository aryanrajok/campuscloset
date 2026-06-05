import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CampusCloset — Buy & Sell Student Placement Wear",
  description:
    "India's #1 peer-to-peer marketplace for student formal placement wear. Buy and sell suits, blazers, shoes, ties and more within your campus at up to 60% off.",
  keywords: [
    "student marketplace",
    "placement wear",
    "second hand suit",
    "campus fashion",
    "formal wear India",
    "affordable blazer",
    "college placement dress",
  ],
  openGraph: {
    title: "CampusCloset — Buy & Sell Student Placement Wear",
    description: "Premium formals from seniors. Save up to 60%.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
