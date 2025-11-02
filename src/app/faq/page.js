// app/faq/page.js
'use client';

import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { 
  ChevronDownIcon,
  ChevronUpIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  TruckIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const FAQPage = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqCategories = [
    {
      title: "سوالات عمومی",
      icon: "❓",
      questions: [
        {
          question: "فروشگاه آنلاین سایرون چه محصولاتی ارائه می‌دهد؟",
          answer: "ما تخصصی در زمینه لوازم جانبی موبایل، کامپیوتر و گجت‌های دیجیتال داریم. شامل: کابل و شارژر، هدفون و هندزفری، پاوربانک، پایه و هولدر، قاب و محافظ صفحه، ماوس و کیبورد، اسپیکر بلوتوث و سایر اکسسوری‌های تکنولوژی."
        },
        {
          question: "چگونه از اصالت کالاها مطمئن شوم؟",
          answer: "تمام محصولات ما از برندهای معتبر و دارای گارانتی اصالت هستند. همچنین سلامت فیزیکی کالا قبل از ارسال بررسی می‌شود."
        },
        {
          question: "آیا امکان خرید عمده وجود دارد؟",
          answer: "بله، برای خریدهای عمده با شماره ۰۹۰۲۸۴۳۰۸۳۰ تماس بگیرید تا شرایط ویژه و تخفیف‌های خاص را برای شما توضیح دهیم."
        },
        {
          question: "چگونه می‌توانم از جدیدترین محصولات مطلع شوم؟",
          answer: "می‌توانید در پیج اینستاگرام ما را دنبال کنید و یا در خبرنامه سایت ثبت نام کنید تا از جدیدترین محصولات و تخفیف‌ها باخبر شوید."
        }
      ]
    },
    {
      title: "خرید و پرداخت",
      icon: "💳",
      questions: [
        {
          question: "روش‌های پرداخت شما چیست؟",
          answer: "پرداخت آنلاین از درگاه بانکی، پرداخت در محل (برای شهر تهران)، واریز کارت به کارت. تمام درگاه‌های ما امن و مطمئن هستند."
        },
        {
          question: "آیا پرداخت در محل دارید؟",
          answer: "بله، برای شهر تهران امکان پرداخت در محل وجود دارد. برای سایر شهرها پس از تایید سفارش، هزینه ارسال محاسبه و اعلام می‌شود."
        },
        {
          question: "چگونه می‌توانم از تخفیف‌ها استفاده کنم؟",
          answer: "کدهای تخفیف از طریق پیج اینستاگرام و خبرنامه اعلام می‌شوند. همچنین برای خریدهای بالای ۲ میلیون تومان ارسال رایگان داریم."
        },
        {
          question: "آیا امکان ثبت سفارش تلفنی وجود دارد؟",
          answer: "قطعاً! می‌توانید از طریق واتساپ یا تماس تلفنی با شماره ۰۹۰۲۸۴۳۰۸۳۰ سفارش خود را ثبت کنید."
        }
      ]
    },
    {
      title: "ارسال و تحویل",
      icon: "🚚",
      questions: [
        {
          question: "مدت زمان ارسال سفارش چقدر است؟",
          answer: "برای تهران: ۱-۲ روز کاری - برای شهرستان: ۲-۴ روز کاری - پست پیشتاز برای تمام نقاط کشور"
        },
        {
          question: "هزینه ارسال چقدر است؟",
          answer: "خریدهای بالای ۲ میلیون تومان ارسال رایگان دارند. برای خریدهای کمتر، هزینه ارسال بر اساس شهر مقصد و وزن محاسبه می‌شود."
        },
        {
          question: "آیا امکان ارسال سریع دارید؟",
          answer: "بله، برای تهران امکان پیک موتوری در همان روز وجود دارد. هزینه پیک جداگانه محاسبه می‌شود."
        },
        {
          question: "چگونه می‌توانم وضعیت سفارشم را پیگیری کنم؟",
          answer: "پس از ثبت سفارش، کد رهگیری پست برای شما ارسال می‌شود. همچنین می‌توانید از طریق پشتیبانی واتساپ پیگیری کنید."
        }
      ]
    },
    {
      title: "گارانتی و پشتیبانی",
      icon: "🛡️",
      questions: [
        {
          question: "گارانتی محصولات شما چگونه است؟",
          answer: "تمام محصولات دارای گارانتی اصالت و سلامت فیزیکی هستند. مدت گارانتی بسته به نوع محصول از ۳ ماه تا ۱ سال متغیر است."
        },
        {
          question: "در صورت مشکل در محصول چه کار کنم؟",
          answer: "از طریق واتساپ یا تماس تلفنی با پشتیبانی فنی ما در ارتباط باشید. راهنمایی کامل دریافت خواهید کرد."
        },
        {
          question: "سیاست بازگرداندن کالا چگونه است؟",
          answer: "ما به کیفیت محصولات خود اطمینان داریم و معمولاً نیاز به مرجوعی نیست. در صورت هرگونه مشکل، ابتدا راهنمایی فنی دریافت می‌کنید و در صورتی که مشکل حل نشد، راهکار مناسب ارائه می‌شود."
        },
        {
          question: "آیا پشتیبانی بعد از خرید دارید؟",
          answer: "بله، پشتیبانی تلفنی و واتساپی ما حتی بعد از خرید نیز پاسخگوی سوالات فنی شما خواهد بود."
        }
      ]
    },
    {
      title: "فنی و تخصصی",
      icon: "🔧",
      questions: [
        {
          question: "چگونه محصول مناسب خود را انتخاب کنم؟",
          answer: "می‌توانید از طریق پشتیبانی فنی ما مشاوره رایگان دریافت کنید. کارشناسان ما بر اساس نیاز و بودجه شما بهترین محصول را پیشنهاد می‌دهند."
        },
        {
          question: "آیا راهنمای استفاده از محصولات را ارائه می‌دهید؟",
          answer: "بله، برای محصولات پیچیده‌تر راهنمای فارسی استفاده ارائه می‌شود. همچنین پشتیبانی فنی ما همیشه در دسترس است."
        },
        {
          question: "محصولات شما compatible با چه دستگاه‌هایی هستند؟",
          answer: "در صفحه هر محصول compatibility کامل ذکر شده است. در صورت شک می‌توانید از پشتیبانی سوال کنید."
        },
        {
          question: "تفاوت محصولات اورجینال و تقلبی را چگونه تشخیص دهم؟",
          answer: "ما مقاله‌ای کامل در این زمینه داریم. همچنین پشتیبانی فنی ما می‌تواند نکات تشخیص اصالت را به شما آموزش دهد."
        }
      ]
    }
  ];

  const quickActions = [
    {
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
      title: "پشتیبانی واتساپ",
      description: "پاسخ سریع به سوالات شما",
      link: "https://wa.me/989028430830",
      color: "bg-green-500"
    },
    {
      icon: <PhoneIcon className="w-6 h-6" />,
      title: "تماس تلفنی",
      description: "مشاوره تخصصی رایگان",
      link: "tel:09028430830",
      color: "bg-blue-500"
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: "گارانتی اصالت",
      description: "اطمینان از کیفیت محصول",
      link: "#guarantee",
      color: "bg-purple-500"
    },
    {
      icon: <TruckIcon className="w-6 h-6" />,
      title: "پیگیری سفارش",
      description: "بررسی وضعیت ارسال",
      link: "#tracking",
      color: "bg-orange-500"
    }
  ];

  return (
    <Layout>
      {/* هیرو سکشن */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full translate-x-1/2 translate-y-1/2 opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              سوالات <span className="text-yellow-400">متداول</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90 leading-relaxed max-w-3xl mx-auto">
              پاسخ به پرتکرارترین سوالات شما در مورد خرید لوازم جانبی موبایل و کامپیوتر
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="https://wa.me/989028430830"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg"
              >
                <ChatBubbleLeftRightIcon className="w-6 h-6 ml-2" />
                پرسش سوال جدید
              </a>
              <a 
                href="tel:09028430830"
                className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg backdrop-blur-sm"
              >
                <PhoneIcon className="w-6 h-6 ml-2" />
                مشاوره رایگان
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* دسترسی سریع */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.link}
                target={action.link.startsWith('http') ? '_blank' : '_self'}
                rel={action.link.startsWith('http') ? 'noopener noreferrer' : ''}
                className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center"
              >
                <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mx-auto mb-3`}>
                  {action.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* سوالات متداول */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              پاسخ به سوالات شما
            </h2>
            <p className="text-lg text-gray-600">
              سوالات خود را پیدا کنید یا از پشتیبانی ما بپرسید
            </p>
          </div>

          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
                  <div className="flex items-center">
                    <span className="text-2xl ml-3">{category.icon}</span>
                    <h3 className="text-2xl font-bold text-gray-900">{category.title}</h3>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {category.questions.map((item, itemIndex) => {
                    const fullIndex = `${categoryIndex}-${itemIndex}`;
                    const isOpen = openItems[fullIndex];
                    
                    return (
                      <div key={itemIndex} className="p-6">
                        <button
                          onClick={() => toggleItem(fullIndex)}
                          className="flex justify-between items-center w-full text-right focus:outline-none"
                        >
                          <span className="text-lg font-semibold text-gray-900">
                            {item.question}
                          </span>
                          {isOpen ? (
                            <ChevronUpIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDownIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        
                        {isOpen && (
                          <div className="mt-4 pr-8">
                            <p className="text-gray-600 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* سیاست مرجوعی */}
      <section id="guarantee" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheckIcon className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                سیاست گارانتی و پشتیبانی
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                ما به کیفیت محصولات خود اطمینان کامل داریم
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <ShieldCheckIcon className="w-6 h-6 text-blue-600 ml-2" />
                  گارانتی اصالت کالا
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-2 flex-shrink-0"></div>
                    <span>تمامی محصولات اورجینال و دارای گارانتی</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-2 flex-shrink-0"></div>
                    <span>بررسی سلامت فیزیکی قبل از ارسال</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-2 flex-shrink-0"></div>
                    <span>پشتیبانی فنی رایگان پس از خرید</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <QuestionMarkCircleIcon className="w-6 h-6 text-green-600 ml-2" />
                  راهنمایی و پشتیبانی
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-2 flex-shrink-0"></div>
                    <span>مشاوره رایگان قبل از خرید</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-2 flex-shrink-0"></div>
                    <span>راهنمایی فنی در صورت بروز مشکل</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-2 flex-shrink-0"></div>
                    <span>پاسخگویی سریع در واتساپ و تلفن</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                📝 نکته مهم:
              </h3>
              <p className="text-yellow-700">
                به دلیل کنترل کیفیت دقیق قبل از ارسال و اطمینان از اصالت کالاها، معمولاً نیاز به مرجوعی وجود ندارد. 
                در صورت هرگونه مشکل، ابتدا از پشتیبانی فنی راهنمایی رایگان دریافت می‌کنید و در صورتی که مشکل مربوط به محصول باشد، 
                راهکار مناسب ارائه خواهد شد.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA پایانی */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">پاسخ خود را پیدا نکردید؟</h2>
          <p className="text-xl text-blue-200 mb-8">
            تیم پشتیبانی ما آماده پاسخگویی به تمام سوالات شماست
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/989028430830"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5 ml-2" />
              پرسش در واتساپ
            </a>
            <a 
              href="tel:09028430830"
              className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <PhoneIcon className="w-5 h-5 ml-2" />
              تماس تلفنی
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQPage;