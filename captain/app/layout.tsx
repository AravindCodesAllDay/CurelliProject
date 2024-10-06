import { Metadata } from "next";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Curelli Admin",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_API;

  if (!clientId) {
    console.error(
      "Google API client ID is not defined in environment variables"
    );
    return <div>Error: Missing Google API client ID</div>;
  }

  return (
    <html lang="en">
      <GoogleOAuthProvider clientId={clientId}>
        <body>
          <ToastContainer />

          {children}
        </body>
      </GoogleOAuthProvider>
    </html>
  );
}
