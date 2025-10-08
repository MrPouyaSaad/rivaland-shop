// components/Layout.js
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-yekan">
      <Header />
      <main className="flex-1 w-full mx-auto px-0 overflow-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;