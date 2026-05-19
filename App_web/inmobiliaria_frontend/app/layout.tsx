import "./globals.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar></Navbar>
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
