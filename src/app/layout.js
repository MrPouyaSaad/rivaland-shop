import './globals.css';
import { CartProvider } from '@/contexts/CartContext';

export const metadata = {
  title: 'سایرون - Sairon | فروشگاه اینترنتی لوازم جانبی موبایل و کامپیوتر',
  description: 'فروشگاه اینترنتی سایرون - خرید آنلاین لوازم جانبی موبایل، کامپیوتر و گجت‌های هوشمند با ارسال سریع و ضمانت اصالت کالا.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/sairon-logo.png',
  },
  openGraph: {
    title: 'سایرون - Sairon',
    description: 'خرید آنلاین لوازم جانبی موبایل و کامپیوتر با ارسال سریع',
    url: 'https://saironstore.ir', // دامنه واقعی رو جایگزین کن
    siteName: 'Sairon',
    images: [
      {
        url: '/Sairon.png', // اگه داری
        width: 1200,
        height: 630,
        alt: 'فروشگاه اینترنتی سایرون',
      },
    ],
    locale: 'fa_IR',
    type: 'website',
  },
};

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
