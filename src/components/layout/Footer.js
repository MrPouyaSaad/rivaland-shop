'use client';

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-200 mt-20">
      <div className="container mx-auto px-4 py-16">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Social */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ریوالند
              </span>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              ارائه کننده بهترین محصولات با کیفیت عالی و قیمت مناسب. تجربه خریدی لذت بخش در ریوالند.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4 space-x-reverse">
              {[
                { icon: "📘", label: "فیس‌بوک", url: "#" },
                { icon: "📸", label: "اینستاگرام", url: "#" },
                { icon: "🐦", label: "توییتر", url: "#" },
                { icon: "📺", label: "یوتیوب", url: "#" }
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.url}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-lg hover:bg-gradient-to-r from-blue-500 to-purple-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white flex items-center">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full ml-2"></span>
              دسترسی سریع
            </h3>
            <ul className="space-y-3">
              {[
                { name: "درباره ما", href: "/about" },
                { name: "تماس با ما", href: "/contact" },
                { name: "سوالات متداول", href: "/faq" },
                { name: "وبلاگ", href: "/blog" },
                { name: "قوانین و مقررات", href: "/terms" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group text-sm"
                  >
                    <span className="w-1 h-1 bg-gray-600 rounded-full ml-2 group-hover:bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white flex items-center">
              <span className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full ml-2"></span>
              خدمات مشتریان
            </h3>
            <ul className="space-y-3">
              {[
                { name: "پیگیری سفارش", href: "/track-order" },
                { name: "بازگرداندن کالا", href: "/return-policy" },
                { name: "گارانتی محصولات", href: "/warranty" },
                { name: "حریم خصوصی", href: "/privacy" },
                { name: "روش های پرداخت", href: "/payment-methods" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group text-sm"
                  >
                    <span className="w-1 h-1 bg-gray-600 rounded-full ml-2 group-hover:bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - فقط اطلاعات تماس */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white flex items-center">
              <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full ml-2"></span>
              راه‌های ارتباطی
            </h3>
            <div className="space-y-3">
              {[
                { 
                  icon: "📍", 
                  text: "تهران، خیابان آزادی، دانشگاه شریف",
                  color: "from-blue-500 to-cyan-500"
                },
                { 
                  icon: "📞", 
                  text: "۰۲۱-۱۲۳۴۵۶۷۸",
                  color: "from-green-500 to-emerald-500"
                },
                { 
                  icon: "✉️", 
                  text: "info@rivaland.ir",
                  color: "from-purple-500 to-pink-500"
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3 space-x-reverse">
                  <span className={`text-lg bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                    {item.icon}
                  </span>
                  <span className="text-gray-400 text-sm flex-1">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* سطر دوم: خبرنامه و Trust Seals در کنار هم */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Newsletter */}
          <div className="bg-gray-800/50 rounded-2xl p-6">
            <h4 className="font-semibold mb-3 text-white text-lg">عضویت در خبرنامه</h4>
            <p className="text-gray-400 text-sm mb-4">
              جدیدترین تخفیف‌ها و پیشنهادات ویژه را دریافت کنید
            </p>
            <div className="flex flex-col space-y-3">
              <input 
                type="email"
                placeholder="آدرس ایمیل شما"
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 text-white placeholder-gray-400"
              />
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                عضویت در خبرنامه
              </button>
            </div>
          </div>

          {/* Trust Seals */}
          <div className="bg-gray-800/50 rounded-2xl p-6 flex flex-col items-center justify-center">
            <h4 className="font-semibold mb-4 text-white text-lg text-center">گواهی‌ها و نمادها</h4>
            {/* کد اصلاح شده اینماد بدون rel="noopener noreferrer" */}
            <a 
              referrerPolicy='origin'
              target='_blank' 
              href='https://trustseal.enamad.ir/?id=655010&Code=fWTlbiIu8k91MoHGXvb04jlediWuZlzi'
            >
              <img 
                referrerPolicy='origin'
                src='https://trustseal.enamad.ir/logo.aspx?id=655010&Code=fWTlbiIu8k91MoHGXvb04jlediWuZlzi' 
                alt='نماد اعتماد الکترونیکی' 
                className="hover:scale-105 transition-transform duration-300 mx-auto"
                style={{cursor: 'pointer'}} 
                code='fWTlbiIu8k91MoHGXvb04jlediWuZlzi'
              />
            </a>
            <p className="text-gray-400 text-sm text-center mt-4">
              این وبسایت دارای نماد اعتماد الکترونیکی می‌باشد
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} ریوالند. کلیه حقوق محفوظ است.
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {["💳", "🏦", "📱", "💻"].map((method, index) => (
                <span key={index} className="text-lg bg-gray-700 p-2 rounded-lg">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;