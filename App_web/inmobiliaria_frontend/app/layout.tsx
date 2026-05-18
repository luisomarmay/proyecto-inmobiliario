import "./globals.css";
import Navigation from "./Components/Navigation";
export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation></Navigation>
        {children}
      </body>
    </html>
  );
}
