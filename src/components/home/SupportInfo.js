'use client';

import Image from 'next/image';

const SupportInfo = () => {
  const supportFeatures = [
    {
      icon: "/icons/shipping.png",
      title: "ارسال رایگان",
      description: "ارسال رایگان برای خریدهای بالای ۲ میلیون تومان"
    },
    {
      icon: "/icons/secure-payment.png",
      title: "پرداخت امن",
      description: "پرداخت آنلاین مطمئن با تمامی کارت‌های بانکی"
    },
    {
      icon: "/icons/support.png",
      title: "پشتیبانی ۹-۲۱",
      description: "پشتیبانی آنلاین از ساعت ۹ صبح تا ۹ شب"
    },
    {
      icon: "/icons/guaranteed.png",
      title: "تضمین کیفیت",
      description: "تضمین اصالت و کیفیت تمامی محصولات"
    }
  ];

  return (
    <section className="py-6 md:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-3 sm:px-6">
        {/* Header */}
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
            چرا ســایـرون را انتخاب کنید؟
          </h1>
          <p className="text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            با اطمینان خرید کنید و از بهترین خدمات بهره‌مند شوید
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 md:mb-16">
          {supportFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg md:rounded-xl p-3 sm:p-6 text-center shadow-md md:shadow-lg hover:shadow-lg md:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 md:hover:-translate-y-1 group border border-gray-100"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 mx-auto mb-2 sm:mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg md:rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 md:group-hover:scale-110">
                <div className="relative w-6 h-6 sm:w-8 sm:h-8 md:w-14 md:h-14">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    fill
                    className="object-contain filter brightness-0 invert"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      const fallback = document.createElement('div');
                      fallback.className = 'text-white text-xs md:text-lg font-bold';
                      fallback.textContent = '📦';
                      parent.appendChild(fallback);
                    }}
                  />
                </div>
              </div>
              
              <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">
                {feature.title}
              </h2>
              
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Support Contact Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl md:rounded-2xl p-4 md:p-8 text-white">
          <div className="text-center mb-4 md:mb-8">
            <h2 className="text-lg sm:text-xl md:text-3xl font-bold mb-1 md:mb-3">نیاز به کمک دارید؟</h2>
            <p className="text-blue-100 text-xs sm:text-sm md:text-lg">تیم پشتیبانی ما از ۹ صبح تا ۹ شب پاسخگوی شماست</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 max-w-4xl mx-auto">
            {/* Phone Support 1 */}
            <div className="bg-white/10 rounded-lg md:rounded-xl p-3 md:p-6 text-center backdrop-blur-sm">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-1 md:mb-3 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:w-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-1 md:mb-2 text-xs sm:text-sm md:text-base">پشتیبانی تلفنی</h3>
              <a 
                href="tel:02123456789" 
                className="text-white hover:text-blue-200 transition-colors font-mono text-xs sm:text-sm md:text-lg block"
              >
                بزودی
              </a>
              <p className="text-blue-100 text-xs mt-1">خط اول پشتیبانی</p>
            </div>

            {/* Phone Support 2 */}
            <div className="bg-white/10 rounded-lg md:rounded-xl p-3 md:p-6 text-center backdrop-blur-sm">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-1 md:mb-3 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:w-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-1 md:mb-2 text-xs sm:text-sm md:text-base">پشتیبانی تلفنی</h3>
              <a 
                href="tel:02123456790" 
                className="text-white hover:text-blue-200 transition-colors font-mono text-xs sm:text-sm md:text-lg block"
              >
                بزودی
              </a>
              <p className="text-blue-100 text-xs mt-1">خط دوم پشتیبانی</p>
            </div>

            {/* WhatsApp & Email */}
            <div className="bg-white/10 rounded-lg md:rounded-xl p-3 md:p-6 text-center backdrop-blur-sm col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-1 md:mb-3 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:w-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91zm-5.63 12.57c-.24-.13-.71-.45-.83-.79-.12-.34-.12-.64.13-1.01.2-.29.45-.49.78-.76.77-.64 1.22-.78 1.57-.78.35 0 .57.03.78.15.22.12.34.35.67 1.07.33.71.47 1.03.78 1.03.31 0 .78-.48 1.22-1.01.44-.53.78-.78 1.22-.78.44 0 .67.12.89.45.22.33.78 1.57 1.22 2.13.44.56.78.78 1.34.78.56 0 1.12-.34 1.56-1.01.44-.67.78-1.45.78-2.24 0-.79-.45-1.34-.89-1.34-.44 0-.89.22-1.56.67-.67.45-1.34.67-1.78.67-.44 0-.78-.22-1.34-.67-.56-.45-1.12-.67-1.78-.67-.67 0-1.45.22-2.24.67-.79.45-1.34 1.12-1.34 1.78 0 .22.03.44.1.67z"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-1 md:mb-2 text-xs sm:text-sm md:text-base">راه‌های ارتباطی</h3>
              <div className="space-y-1 md:space-y-2">
                <a 
                  href="https://wa.me/989123456789" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-green-300 transition-colors text-xs block"
                >
                  واتساپ پشتیبانی
                </a>
                <a 
                  href="mailto:saironofficial@gmail.com" 
                  className="text-white hover:text-blue-200 transition-colors text-xs block"
                >
                  saironofficial@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 md:gap-4 mt-4 md:mt-8">
            <a
              href="tel:02123456789"
              className="bg-white text-blue-600 px-4 py-2 md:px-8 md:py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-1 md:gap-2 shadow-md md:shadow-lg hover:shadow-lg md:hover:shadow-xl w-full sm:w-auto text-xs md:text-base"
            >
              <svg className="w-3 h-3 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              تماس سریع
            </a>
            <a
              href="https://wa.me/989123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-4 py-2 md:px-8 md:py-3 rounded-full font-semibold hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-1 md:gap-2 shadow-md md:shadow-lg hover:shadow-lg md:hover:shadow-xl w-full sm:w-auto text-xs md:text-base"
            >
              <svg className="w-3 h-3 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91zm-5.63 12.57c-.24-.13-.71-.45-.83-.79-.12-.34-.12-.64.13-1.01.2-.29.45-.49.78-.76.77-.64 1.22-.78 1.57-.78.35 0 .57.03.78.15.22.12.34.35.67 1.07.33.71.47 1.03.78 1.03.31 0 .78-.48 1.22-1.01.44-.53.78-.78 1.22-.78.44 0 .67.12.89.45.22.33.78 1.57 1.22 2.13.44.56.78.78 1.34.78.56 0 1.12-.34 1.56-1.01.44-.67.78-1.45.78-2.24 0-.79-.45-1.34-.89-1.34-.44 0-.89.22-1.56.67-.67.45-1.34.67-1.78.67-.44 0-.78-.22-1.34-.67-.56-.45-1.12-.67-1.78-.67-.67 0-1.45.22-2.24.67-.79.45-1.34 1.12-1.34 1.78 0 .22.03.44.1.67z"/>
              </svg>
              پیام در واتساپ
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportInfo;