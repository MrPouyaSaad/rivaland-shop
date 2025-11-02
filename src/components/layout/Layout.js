// components/Layout.js
import Header from './Header';
import Footer from './Footer';

export const metadata = {
  title: {
    default: 'فروشگاه اینترنتی ســایـرون | خرید آنلاین لوازم جانبی موبایل و کامپیوتر',
    template: '%s | فروشگاه اینترنتی ســایـرون'
  },
  description: 'سایرون استور ارائه‌دهنده انواع لوازم جانبی موبایل، کامپیوتر و گجت‌های هوشمند با ارسال سریع و ضمانت اصالت کالا.',
  keywords: ['سایرون', 'فروشگاه اینترنتی', 'لوازم جانبی موبایل', 'خرید شارژر', 'کاور گوشی', 'هدفون', 'لوازم جانبی کامپیوتر', 'گجت هوشمند'],
  authors: [{ name: 'سایرون استور' }],
  creator: 'سایرون استور',
  publisher: 'سایرون استور',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://saironstore.ir'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'فروشگاه اینترنتی ســایـرون',
    description: 'خرید اینترنتی لوازم جانبی موبایل و کامپیوتر با بهترین قیمت از سایرون استور.',
    url: 'https://saironstore.ir',
    siteName: 'سایرون استور',
    images: [
      {
        url: '/Sairon.png',
        width: 800,
        height: 600,
        alt: 'لوگوی فروشگاه اینترنتی سایرون',
      },
    ],
    locale: 'fa_IR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'فروشگاه اینترنتی ســایـرون',
    description: 'خرید اینترنتی لوازم جانبی موبایل و کامپیوتر',
    images: ['/Sairon.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// اسکیما دیتا برای فروشگاه
const storeSchema = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  'name': 'فروشگاه اینترنتی ســایـرون',
  'description': 'فروشگاه تخصصی لوازم جانبی موبایل، کامپیوتر و گجت‌های هوشمند',
  'url': 'https://saironstore.ir',
  'telephone': '+98-21-12345678',
  'address': {
    '@type': 'PostalAddress',
    'addressCountry': 'IR',
    'addressLocality': 'Tehran',
    'addressRegion': 'Tehran'
  },
  'openingHours': 'Mo-Su 00:00-23:59',
  'priceRange': '$$',
  'image': '/Sairon.png',
  'sameAs': []
};

const Layout = ({ children }) => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
      />
      <div className="min-h-screen flex flex-col font-yekan" itemScope itemType="https://schema.org/WebPage">
        <Header />
        <main className="flex-1 w-full mx-auto px-0 overflow-hidden" itemScope itemType="https://schema.org/WebPageElement">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;