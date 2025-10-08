import './globals.css';
import { CartProvider } from '@/contexts/CartContext';
export const metadata = {
  title: 'ریوالند - Riva Land',
  description: 'فروشگاه اینترنتی ریوالند - خرید آنلاین لوازم جانبی موبایل و کامپیوتر',
  icons: {
    icon: '/r.png', // یا '/favicon.ico'
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-gray-50">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}