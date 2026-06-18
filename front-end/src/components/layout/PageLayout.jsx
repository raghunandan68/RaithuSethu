import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PageLayout({ children, maxWidth = "max-w-7xl" }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className={`mx-auto w-full flex-1 px-4 py-6 sm:px-6 ${maxWidth}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
