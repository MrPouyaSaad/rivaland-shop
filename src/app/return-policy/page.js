// app/return-policy/page.js
'use client';

import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { 
  TruckIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  XCircleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const ReturnPolicyPage = () => {
  const [activeTab, setActiveTab] = useState('return');

  const policies = [
    {
      id: 'return',
      title: 'بازگرداندن کالا',
      icon: <XCircleIcon className="w-6 h-6" />,
      color: 'from-red-500 to-orange-500',
      bgColor: 'red',
      content: {
        title: 'سیاست بازگشت کالا',
        description: 'با توجه به کنترل کیفیت دقیق قبل از ارسال، بازگشت کالا نداریم',
        features: [
          {
            icon: <CheckCircleIcon className="w-5 h-5" />,
            title: 'کنترل کیفیت قبل از ارسال',
            description: 'تمام محصولات قبل از بسته‌بندی از نظر سلامت فیزیکی و عملکرد بررسی می‌شوند'
          },
          {
            icon: <CheckCircleIcon className="w-5 h-5" />,
            title: 'ضمانت اصالت کالا',
            description: 'همه محصولات اورجینال و دارای گارانتی اصالت هستند'
          },
          {
            icon: <CheckCircleIcon className="w-5 h-5" />,
            title: 'پشتیبانی فنی رایگان',
            description: 'در صورت هرگونه مشکل، پشتیبانی فنی ما راهنمایی کامل ارائه می‌دهد'
          }
        ],
        note: 'به دلیل اطمینان از کیفیت و اصالت محصولات، نیاز به بازگشت کالا وجود ندارد. در صورت بروز هرگونه مشکل، تیم پشتیبانی ما تا حل کامل مشکل در کنار شما خواهد بود.'
      }
    },
    {
      id: 'tracking',
      title: 'پیگیری سفارش',
      icon: <TruckIcon className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'blue',
      content: {
        title: 'پیگیری سفارش‌های پستی',
        description: 'روش‌های مختلف برای پیگیری وضعیت سفارش شما',
        features: [
          {
            icon: <DocumentTextIcon className="w-5 h-5" />,
            title: 'ارسال کد رهگیری',
            description: 'کد رهگیری پست بلافاصله پس از تحویل مرسوله به اداره پست برای شما ارسال می‌شود'
          },
          {
            icon: <ClockIcon className="w-5 h-5" />,
            title: 'مشاهده از بخش سفارشات',
            description: 'می‌توانید از بخش "سفارشات من" در پنل کاربری وضعیت سفارش را مشاهده کنید'
          },
          {
            icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />,
            title: 'پشتیبانی مستقیم',
            description: 'در صورت هرگونه تأخیر یا مشکل در ارسال، از طریق واتساپ پیگیری کنید'
          }
        ],
        note: 'سفارش شما معمولاً طی 1-2 روز کاری آماده و به پست تحویل داده می‌شود. پس از تحویل به پست، کد رهگیری برای شما ارسال خواهد شد.'
      }
    },
    {
      id: 'warranty',
      title: 'گارانتی محصول',
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'green',
      content: {
        title: 'گارانتی و ضمانت محصولات',
        description: 'اطمینان از اصالت و سلامت فیزیکی محصولات',
        features: [
          {
            icon: <ShieldCheckIcon className="w-5 h-5" />,
            title: 'گارانتی اصالت کالا',
            description: 'تمام محصولات اورجینال و دارای ضمانت اصالت هستند'
          },
          {
            icon: <CheckCircleIcon className="w-5 h-5" />,
            title: 'سلامت فیزیکی',
            description: 'بررسی کامل سلامت فیزیکی محصول قبل از ارسال'
          },
          {
            icon: <XCircleIcon className="w-5 h-5" />,
            title: 'گارانتی سازنده',
            description: 'گارانتی‌های مربوط به سازنده به عهده شرکت مربوطه می‌باشد'
          }
        ],
        note: 'ما تضمین می‌کنیم محصولات کاملاً اورجینال و سالم باشند. گارانتی‌های جانبی مربوط به شرکت‌های سازنده مستقیماً با خود شرکت‌ها پیگیری می‌شود.'
      }
    }
  ];

  const trackingSteps = [
    {
      step: 1,
      title: 'ثبت سفارش',
      description: 'سفارش شما در سیستم ثبت می‌شود',
      time: 'بلافاصله'
    },
    {
      step: 2,
      title: 'آماده‌سازی',
      description: 'محصول بسته‌بندی و آماده ارسال می‌شود',
      time: '1-2 روز کاری'
    },
    {
      step: 3,
      title: 'تحویل به پست',
      description: 'مرسوله به اداره پست تحویل داده می‌شود',
      time: 'روز ارسال'
    },
    {
      step: 4,
      title: 'ارسال کد رهگیری',
      description: 'کد رهگیری برای شما ارسال می‌شود',
      time: 'بلافاصله پس از تحویل به پست'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
        icon: 'text-red-600'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        icon: 'text-blue-600'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        icon: 'text-green-600'
      }
    };
    return colors[color] || colors.blue;
  };

  const activePolicy = policies.find(policy => policy.id === activeTab);
  const colorClasses = getColorClasses(activePolicy.bgColor);

  return (
    <Layout>
      {/* هیرو سکشن */}
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full translate-x-1/2 translate-y-1/2 opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center mx-auto mb-8">
              <DocumentTextIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              قوانین و <span className="text-blue-400">مقررات</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90 leading-relaxed max-w-3xl mx-auto">
              شفافیت در خدمات، اطمینان در خرید
            </p>
          </div>
        </div>
      </section>

      {/* تب‌های ناوبری */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {policies.map((policy) => (
              <button
                key={policy.id}
                onClick={() => setActiveTab(policy.id)}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === policy.id
                    ? `bg-gradient-to-r ${policy.color} text-white shadow-lg transform scale-105`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="ml-2">{policy.icon}</span>
                {policy.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* محتوای اصلی */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* هدر محتوا */}
            <div className={`bg-gradient-to-r ${activePolicy.color} p-8 text-white`}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center ml-4">
                  {activePolicy.icon}
                </div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold">{activePolicy.content.title}</h2>
                  <p className="text-white/90 mt-2">{activePolicy.content.description}</p>
                </div>
              </div>
            </div>

            {/* بدنه محتوا */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {activePolicy.content.features.map((feature, index) => (
                  <div key={index} className={`${colorClasses.bg} border ${colorClasses.border} rounded-xl p-6 text-center`}>
                    <div className={`w-12 h-12 ${colorClasses.bg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <div className={colorClasses.icon}>
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* نکته مهم */}
              <div className={`${colorClasses.bg} border ${colorClasses.border} rounded-xl p-6`}>
                <div className="flex items-start">
                  <DocumentTextIcon className={`w-6 h-6 ml-3 mt-1 ${colorClasses.icon} flex-shrink-0`} />
                  <div>
                    <h4 className={`font-semibold mb-2 ${colorClasses.text}`}>نکته مهم</h4>
                    <p className="text-gray-700 leading-relaxed">{activePolicy.content.note}</p>
                  </div>
                </div>
              </div>

              {/* بخش اضافی برای پیگیری سفارش */}
              {activeTab === 'tracking' && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">مراحل پیگیری سفارش</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {trackingSteps.map((step) => (
                      <div key={step.step} className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto mb-3">
                          {step.step}
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                        <p className="text-gray-600 text-xs mb-2">{step.description}</p>
                        <div className="text-blue-600 text-xs font-medium">{step.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA پشتیبانی */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-12 text-white text-center">
            <ShieldCheckIcon className="w-16 h-16 mx-auto mb-6 text-blue-300" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">نیاز به راهنمایی بیشتر دارید؟</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              تیم پشتیبانی ما آماده پاسخگویی به تمام سوالات شما در زمینه قوانین و مقررات است.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/989028430830"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5 ml-2" />
                پشتیبانی واتساپ
              </a>
              <a 
                href="tel:09028430830"
                className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center backdrop-blur-sm"
              >
                <PhoneIcon className="w-5 h-5 ml-2" />
                تماس تلفنی
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ReturnPolicyPage;