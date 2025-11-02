// app/privacy/page.js
'use client';

import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { 
  ShieldCheckIcon,
  DocumentTextIcon,
  EyeIcon,
  UserIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  DevicePhoneMobileIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

const PrivacyPage = () => {
  const [activeSection, setActiveSection] = useState('data-collection');

  const privacySections = [
    {
      id: 'data-collection',
      title: 'جمع‌آوری اطلاعات',
      icon: <DocumentTextIcon className="w-6 h-6" />,
      content: {
        description: 'ما تنها اطلاعات ضروری برای ارائه خدمات بهتر را جمع‌آوری می‌کنیم:',
        points: [
          'اطلاعات هویتی (نام، نام خانوادگی) برای تحویل سفارش',
          'اطلاعات تماس (شماره تلفن، آدرس ایمیل) برای پیگیری سفارش',
          'آدرس پستی برای ارسال کالا',
          'اطلاعات پرداخت (فقط از طریق درگاه‌های امن بانکی)'
        ]
      }
    },
    {
      id: 'data-usage',
      title: 'استفاده از اطلاعات',
      icon: <EyeIcon className="w-6 h-6" />,
      content: {
        description: 'اطلاعات شما تنها برای اهداف زیر استفاده می‌شود:',
        points: [
          'پردازش و تحویل سفارش‌های شما',
          'ارائه پشتیبانی و خدمات پس از فروش',
          'ارسال اطلاع‌رسانی‌های مربوط به سفارش',
          'ارائه پیشنهادات ویژه و تخفیف‌ها (در صورت موافقت شما)',
          'بهبود کیفیت خدمات و تجربه کاربری'
        ]
      }
    },
    {
      id: 'data-protection',
      title: 'حفاظت از اطلاعات',
      icon: <LockClosedIcon className="w-6 h-6" />,
      content: {
        description: 'ما از اطلاعات شما با بالاترین استانداردهای امنیتی محافظت می‌کنیم:',
        points: [
          'استفاده از پروتکل SSL برای رمزنگاری داده‌ها',
          'ذخیره‌سازی امن اطلاعات در سرورهای داخلی',
          'دسترسی محدود به اطلاعات تنها برای پرسنل مجاز',
          'حذف دوره‌ای اطلاعات غیرضروری',
          'بررسی مستمر سیستم‌های امنیتی'
        ]
      }
    },
    {
      id: 'third-party',
      title: 'اشتراک‌گذاری سازمان',
      icon: <UserIcon className="w-6 h-6" />,
      content: {
        description: 'اطلاعات شما را با هیچ شخص یا سازمانی به جز موارد زیر به اشتراک نمی‌گذاریم:',
        points: [
          'شرکت‌های پستی برای تحویل سفارش',
          'درگاه‌های پرداخت بانکی برای تراکنش‌های مالی',
          'پاسخ به درخواست‌های قانونی مقامات ذیصلاح',
          'شرکت‌های بیمه در صورت نیاز'
        ]
      }
    },
    {
      id: 'user-rights',
      title: 'حقوق کاربران',
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      content: {
        description: 'کاربر گرامی، شما دارای حقوق زیر هستید:',
        points: [
          'دسترسی به اطلاعات شخصی ذخیره‌شده',
          'درخواست تصحیح اطلاعات نادرست',
          'درخواست حذف حساب کاربری',
          'عدم دریافت ایمیل‌های تبلیغاتی',
          'دریافت گزارش از اطلاعات جمع‌آوری‌شده'
        ]
      }
    },
    {
      id: 'cookies',
      title: 'سیاست کوکی‌ها',
      icon: <DevicePhoneMobileIcon className="w-6 h-6" />,
      content: {
        description: 'ما از کوکی‌ها برای بهبود تجربه کاربری استفاده می‌کنیم:',
        points: [
          'ذخیره تنظیمات شخصی سازی شده',
          'بهبود عملکرد وب‌سایت',
          'تجزیه و تحلیل آمار بازدیدها',
          'ذخیره سبد خرید موقت',
          'بهبود امنیت و جلوگیری از تقلب'
        ]
      }
    }
  ];

  const securityFeatures = [
    {
      icon: <LockClosedIcon className="w-8 h-8" />,
      title: 'رمزنگاری پیشرفته',
      description: 'استفاده از SSL 256-bit برای محافظت از داده‌ها'
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: 'حفاظت دائمی',
      description: 'نظارت 24/7 بر سیستم‌های امنیتی'
    },
    {
      icon: <CreditCardIcon className="w-8 h-8" />,
      title: 'پرداخت امن',
      description: 'تراکنش‌های مالی از طریق درگاه‌های بانکی معتبر'
    },
    {
      icon: <DocumentTextIcon className="w-8 h-8" />,
      title: 'شفافیت کامل',
      description: 'اطلاع رسانی شفاف درباره استفاده از داده‌ها'
    }
  ];

  const contactMethods = [
    {
      title: 'پشتیبانی واتساپ',
      description: 'برای سوالات فوری',
      link: 'https://wa.me/989028430830',
      type: 'whatsapp'
    },
    {
      title: 'ایمیل',
      description: 'برای درخواست‌های رسمی',
      link: 'mailto:saironstore.ir@gmail.com',
      type: 'email'
    },
    {
      title: 'تماس تلفنی',
      description: 'برای مشاوره',
      link: 'tel:09028430830',
      type: 'phone'
    }
  ];

  return (
    <Layout>
      {/* هیرو سکشن */}
      <section className="relative bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-green-500 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500 rounded-full translate-x-1/2 translate-y-1/2 opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center mx-auto mb-8">
              <ShieldCheckIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              حریم <span className="text-emerald-400">خصوصی</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90 leading-relaxed max-w-3xl mx-auto">
              حفظ امنیت و حریم خصوصی شما اولویت اصلی ماست
            </p>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 inline-block">
              <p className="text-lg">
                آخرین بروزرسانی: <span className="text-emerald-300">1404/07/30</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ویژگی‌های امنیتی */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              امنیت اطلاعات شما
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              با بالاترین استانداردهای امنیتی از داده‌های شما محافظت می‌کنیم
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center border border-green-100">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* محتوای اصلی */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* سایدبار ناوبری */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DocumentTextIcon className="w-5 h-5 ml-2 text-green-600" />
                  عناوین اصلی
                </h3>
                <nav className="space-y-2">
                  {privacySections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-right p-3 rounded-xl transition-all duration-200 flex items-center justify-between ${
                        activeSection === section.id
                          ? 'bg-green-500 text-white'
                          : 'text-gray-700 hover:bg-green-50'
                      }`}
                    >
                      <span className="flex items-center">
                        <span className="ml-3">{section.icon}</span>
                        {section.title}
                      </span>
                      {activeSection === section.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* محتوای بخش‌ها */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {privacySections.map((section) => (
                  <div
                    key={section.id}
                    id={section.id}
                    className={`p-8 transition-all duration-300 ${
                      activeSection === section.id ? 'block' : 'hidden'
                    }`}
                  >
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 ml-4">
                        {section.icon}
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                        {section.title}
                      </h2>
                    </div>

                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                        {section.content.description}
                      </p>
                      
                      <ul className="space-y-4">
                        {section.content.points.map((point, index) => (
                          <li key={index} className="flex items-start text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                            <span className="text-justify leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* بخش پایانی */}
              <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 mt-8 text-white">
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                  <ShieldCheckIcon className="w-6 h-6 ml-3" />
                  تعهد ما به حریم خصوصی شما
                </h3>
                <p className="text-green-100 text-lg leading-relaxed mb-6">
                  ما متعهد می‌شویم که حریم خصوصی شما را کاملاً رعایت کرده و از اطلاعات شخصی‌تان 
                  تنها برای بهبود خدمات و تجربه خرید شما استفاده کنیم. هرگونه تغییر در سیاست‌های 
                  حریم خصوصی از طریق همین صفحه به اطلاع شما خواهد رسید.
                </p>
                
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                  <h4 className="font-semibold mb-4 text-lg">برای سوالات بیشتر:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {contactMethods.map((method, index) => (
                      <a
                        key={index}
                        href={method.link}
                        target={method.type === 'whatsapp' ? '_blank' : '_self'}
                        rel={method.type === 'whatsapp' ? 'noopener noreferrer' : ''}
                        className="bg-white/20 hover:bg-white/30 rounded-xl p-4 text-center transition-all duration-200 backdrop-blur-sm"
                      >
                        <div className="font-semibold mb-1">{method.title}</div>
                        <div className="text-green-200 text-sm">{method.description}</div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA پایانی */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-12 border border-green-200">
            <ShieldCheckIcon className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              آیا سوالی درباره حریم خصوصی دارید؟
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              تیم پشتیبانی ما آماده پاسخگویی به تمام سوالات و نگرانی‌های شما در زمینه حریم خصوصی است.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/989028430830"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5 ml-2" />
                گفتگو در واتساپ
              </a>
              <a 
                href="mailto:saironstore.ir@gmail.com"
                className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center border border-gray-300"
              >
                <DocumentTextIcon className="w-5 h-5 ml-2" />
                ارسال ایمیل
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPage;