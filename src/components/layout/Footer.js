'use client';

import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <>
      {/* اسکیما دیتا برای فوتر */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "فروشگاه اینترنتی سایرون",
            "url": "https://saironstore.ir",
            "logo": "https://saironstore.ir/sairon-logo.png",
            "description": "فروشگاه اینترنتی سایرون - ارائه بهترین محصولات لوازم جانبی موبایل و کامپیوتر با کیفیت عالی و قیمت مناسب",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "تبریز، ائلگلی، سینا، گلبرگ، پلاک صفر",
              "addressLocality": "تبریز",
              "addressRegion": "آذربایجان شرقی",
              "addressCountry": "IR"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+98-413-446-5870",
              "contactType": "پشتیبانی",
              "email": "saironstore.ir@gmail.com",
              "areaServed": "IR",
              "availableLanguage": ["fa", "en"]
            },
            "sameAs": [
              "#",
              "#",
              "#",
              "#"
            ]
          })
        }}
      />

      <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-200 mt-20" role="contentinfo" itemScope itemType="https://schema.org/WPFooter">
        <div className="container mx-auto px-4 py-12 md:py-16">
          
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-10 md:mb-12">
            
            {/* Brand & Social */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 space-x-reverse" itemScope itemType="https://schema.org/Organization">
                <Link href="/" aria-label="صفحه اصلی فروشگاه اینترنتی سایرون">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="relative w-8 h-8">
                      <Image
                        src="/sairon-logo.png"
                        alt="لوگو فروشگاه اینترنتی سایرون - تخصص در لوازم جانبی موبایل و کامپیوتر"
                        fill
                        className="object-contain"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          const fallback = document.createElement('div');
                          fallback.className = 'text-white font-bold text-lg';
                          fallback.textContent = 'س';
                          parent.appendChild(fallback);
                        }}
                      />
                    </div>
                  </div>
                </Link>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent" itemProp="name">
                  سایرون
                </span>
              </div>
              
              <p className="text-gray-400 text-sm leading-relaxed" itemProp="description">
                فروشگاه اینترنتی سایرون - ارائه بهترین محصولات لوازم جانبی موبایل و کامپیوتر با کیفیت عالی و قیمت مناسب
              </p>
              
              {/* Social Media */}
              <div className="flex space-x-4 space-x-reverse">
                {[
                  { 
                    icon: "📘", 
                    label: "صفحه فیس‌بوک سایرون", 
                    url: "#",
                    name: "Facebook"
                  },
                  { 
                    icon: "📸", 
                    label: "صفحه اینستاگرام سایرون", 
                    url: "#",
                    name: "Instagram"
                  },
                  { 
                    icon: "🐦", 
                    label: "صفحه توییتر سایرون", 
                    url: "#",
                    name: "Twitter"
                  },
                  { 
                    icon: "📺", 
                    label: "کانال یوتیوب سایرون", 
                    url: "#",
                    name: "YouTube"
                  }
                ].map((social, index) => (
                  <Link
                    key={index}
                    href={social.url}
                    className="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-full flex items-center justify-center text-base md:text-lg hover:bg-gradient-to-r from-blue-500 to-purple-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                    aria-label={social.label}
                    title={social.label}
                    itemProp="sameAs"
                  >
                    <span role="img" aria-label={social.name}>{social.icon}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full ml-2" aria-hidden="true"></span>
                دسترسی سریع
              </h3>
              <ul className="space-y-2 md:space-y-3" role="list">
                {[
                  { 
                    name: "درباره ما", 
                    href: "/about", 
                    title: "درباره فروشگاه سایرون - تاریخچه و اهداف ما" 
                  },
                  { 
                    name: "تماس با ما", 
                    href: "/contact", 
                    title: "تماس با فروشگاه سایرون - راه‌های ارتباطی" 
                  },
                  { 
                    name: "سوالات متداول", 
                    href: "/faq", 
                    title: "سوالات متداول فروشگاه سایرون - راهنمای خرید" 
                  },
                  { 
                    name: "حریم خصوصی", 
                    href: "/privacy", 
                    title: "سیاست حریم خصوصی سایرون - حفاظت از اطلاعات" 
                  }
                ].map((link, index) => (
                  <li key={index} role="listitem">
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group text-xs md:text-sm"
                      title={link.title}
                      aria-label={link.title}
                    >
                      <span className="w-1 h-1 bg-gray-600 rounded-full ml-2 group-hover:bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" aria-hidden="true"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full ml-2" aria-hidden="true"></span>
                خدمات مشتریان
              </h3>
              <ul className="space-y-2 md:space-y-3" role="list">
                {[
                  { 
                    name: "قوانین و مقررات", 
                    href: "/return-policy", 
                    title: "قوانین بازگرداندن کالا، پیگیری سفارش و گارانتی محصولات در سایرون" 
                  },
                  { 
                    name: "پیگیری سفارش", 
                    href: "/return-policy#tracking", 
                    title: "پیگیری سفارش های پستی در سایرون - وضعیت سفارش" 
                  },
                  { 
                    name: "بازگرداندن کالا", 
                    href: "/return-policy#return", 
                    title: "سیاست بازگرداندن کالا در سایرون - شرایط مرجوعی" 
                  },
                  { 
                    name: "گارانتی محصولات", 
                    href: "/return-policy#warranty", 
                    title: "گارانتی محصولات فروشگاه سایرون - ضمانت اصالت کالا" 
                  }
                ].map((link, index) => (
                  <li key={index} role="listitem">
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group text-xs md:text-sm"
                      title={link.title}
                      aria-label={link.title}
                    >
                      <span className="w-1 h-1 bg-gray-600 rounded-full ml-2 group-hover:bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300" aria-hidden="true"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div itemScope itemType="https://schema.org/ContactPoint">
              <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full ml-2" aria-hidden="true"></span>
                راه‌های ارتباطی
              </h3>
              <div className="space-y-2 md:space-y-3">
                {[
                  { 
                    icon: "📞", 
                    text: "041-34465870",
                    color: "from-green-500 to-emerald-500",
                    link: "tel:+984134465870",
                    title: "تماس تلفنی با پشتیبانی سایرون",
                    type: "telephone"
                  },
                  { 
                    icon: "💬", 
                    text: "واتساپ پشتیبانی",
                    color: "from-green-500 to-green-600", 
                    link: "https://wa.me/989028430830",
                    title: "ارتباط از طریق واتساپ با سایرون",
                    type: "whatsapp"
                  },
                  { 
                    icon: "✉️", 
                    text: "saironstore.ir@gmail.com",
                    color: "from-purple-500 to-pink-500",
                    link: "mailto:saironstore.ir@gmail.com",
                    title: "ارسال ایمیل به سایرون",
                    type: "email"
                  },
                  { 
                    icon: "📍", 
                    text: "تبریز، ائلگلی، سینا، گلبرگ، پلاک صفر",
                    color: "from-blue-500 to-purple-500",
                    link: "https://maps.google.com/?q=تبریز، ائلگلی، سینا، گلبرگ، پلاک صفر",
                    title: "آدرس دفتر سایرون روی نقشه",
                    type: "address"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-2 md:space-x-3 space-x-reverse">
                    <span className={`text-base md:text-lg bg-gradient-to-r ${item.color} bg-clip-text text-transparent flex-shrink-0 mt-0.5`} aria-hidden="true">
                      {item.icon}
                    </span>
                    <a 
                      href={item.link}
                      className="text-gray-400 text-xs md:text-sm flex-1 leading-relaxed hover:text-white transition-colors duration-300"
                      target={item.link.startsWith('http') ? '_blank' : '_self'}
                      rel={item.link.startsWith('http') ? 'noopener noreferrer' : ''}
                      title={item.title}
                      aria-label={item.title}
                      itemProp={item.type}
                    >
                      {item.text}
                    </a>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* سطر دوم: خبرنامه و Trust Seals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-12">
            
            {/* Newsletter */}
            <div className="bg-gray-800/50 rounded-xl md:rounded-2xl p-4 md:p-6">
              <h4 className="font-semibold mb-3 text-white text-base md:text-lg">
                عضویت در خبرنامه سایرون
              </h4>
              <p className="text-gray-400 text-xs md:text-sm mb-4">
                جدیدترین تخفیف‌ها و محصولات لوازم جانبی موبایل و کامپیوتر را دریافت کنید
              </p>
              <div className="flex flex-col space-y-3">
                <input 
                  type="email"
                  placeholder="آدرس ایمیل شما"
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 text-white placeholder-gray-400 text-sm"
                  aria-label="ایمیل خود را برای عضویت در خبرنامه سایرون وارد کنید"
                  aria-required="false"
                />
                <button 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm md:text-base"
                  aria-label="عضویت در خبرنامه فروشگاه سایرون برای دریافت آخرین تخفیف‌ها"
                  type="button"
                >
                  عضویت در خبرنامه
                </button>
              </div>
            </div>

            {/* Trust Seals */}
            <div className="bg-gray-800/50 rounded-xl md:rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center">
              <h4 className="font-semibold mb-3 md:mb-4 text-white text-base md:text-lg text-center">
                گواهی اعتماد الکترونیکی
              </h4>
              <a
                referrerPolicy="origin"
                target="_blank"
                href="https://trustseal.enamad.ir/?id=659468&Code=61cr3iUI3mHakXHdrhbGqY8BIddpdXLz"
                title="نماد اعتماد الکترونیکی فروشگاه سایرون - معتبر از وزارت صنعت"
                aria-label="نماد اعتماد الکترونیکی فروشگاه سایرون"
                rel="noopener noreferrer"
              >
                <img
                  referrerPolicy="origin"
                  src="https://trustseal.enamad.ir/logo.aspx?id=659468&Code=61cr3iUI3mHakXHdrhbGqY8BIddpdXLz"
                  alt="نماد اعتماد الکترونیکی فروشگاه اینترنتی سایرون - دارای مجوز از وزارت صنعت، معدن و تجارت"
                  style={{ cursor: "pointer" }}
                  code="61cr3iUI3mHakXHdrhbGqY8BIddpdXLz"
                  className="max-w-full h-auto"
                  loading="lazy"
                  width="100"
                  height="100"
                />
              </a>
              <p className="text-gray-400 text-xs md:text-sm text-center mt-3 md:mt-4">
                فروشگاه اینترنتی سایرون دارای نماد اعتماد الکترونیکی
              </p>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-6 md:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Copyright */}
              <div className="text-gray-500 text-xs md:text-sm text-center md:text-right">
                <span itemProp="copyrightYear">{new Date().getFullYear()}</span> © 
                <span itemProp="copyrightHolder"> فروشگاه اینترنتی سایرون</span>. کلیه حقوق محفوظ است.
              </div>
              
              {/* Additional Info */}
              <div className="text-gray-500 text-xs text-center md:text-left">
                <span itemProp="description">تخصص در لوازم جانبی موبایل و کامپیوتر</span>
              </div>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;