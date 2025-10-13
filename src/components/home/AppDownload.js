'use client';

const AppDownload = () => {
  const appFeatures = [
    {
      icon: "⚡",
      title: "سریع و آسان",
      description: "خرید در چند ثانیه با رابط کاربری ساده"
    },
    {
      icon: "🎁",
      title: "تخفیف‌های ویژه",
      description: "دسترسی به پیشنهادات ویژه کاربران اپلیکیشن"
    },
    {
      icon: "🔔",
      title: "اعلان فوری",
      description: "مطلع شدن از جدیدترین محصولات و حراجی‌ها"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Content */}
          <div className="lg:w-1/2 text-center lg:text-right">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              اپلیکیشن <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">ســایـرون</span>
            </h2>
            
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              تجربه خرید بهتر و سریع‌تر با اپلیکیشن موبایل ســایـرون. 
              از تمامی امکانات وب‌سایت به همراه ویژگی‌های اختصاصی بهره‌مند شوید.
            </p>

            {/* App Features */}
            <div className="space-y-4 mb-8">
              {appFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-4 space-x-reverse">
                  <span className="text-2xl bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-2">
                    {feature.icon}
                  </span>
                  <div className="text-right">
                    <h4 className="font-semibold text-white">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center space-y-4 sm:space-y-0 sm:space-x-4 space-x-reverse">
              <a
                href="#"
                className="bg-black hover:bg-gray-800 border border-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center hover:scale-105"
              >
                <span className="ml-2">📱</span>
                دانلود از اپ استور
              </a>
              <a
                href="#"
                className="bg-black hover:bg-gray-800 border border-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center hover:scale-105"
              >
                <span className="ml-2">🤖</span>
                دانلود از گوگل پلی
              </a>
            </div>

            {/* QR Code */}
            <div className="mt-8 flex justify-center lg:justify-start">
              <div className="bg-white p-3 rounded-xl">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-4xl">
                  📱
                </div>
                <p className="text-black text-xs mt-2">اسکن کنید</p>
              </div>
            </div>
          </div>

          {/* App Mockup */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-72 h-96 bg-gradient-to-b from-blue-500 to-purple-500 rounded-3xl p-4 shadow-2xl">
                <div className="bg-white rounded-2xl h-full flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl text-white mx-auto mb-4">
                      R
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">ســایـرون</h3>
                    <p className="text-gray-600 text-sm">در حال بارگذاری...</p>
                    <div className="mt-6 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AppDownload;