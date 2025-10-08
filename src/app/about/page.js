// app/about/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/layout/Layout';
import { 
  PhoneIcon, 
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  TruckIcon,
  StarIcon,
  HeartIcon,
  ClockIcon,
  MapPinIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  BoltIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

const AboutPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <TruckIcon className="w-8 h-8" />,
      title: "ارسال سریع و رایگان",
      description: "ارسال رایگان برای خریدهای بالای ۱ میلیون تومان و تحویل در تهران در همان روز"
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "ضمانت اصالت کالا",
      description: "تمام محصولات دارای گارانتی اصالت و سلامت فیزیکی هستند"
    },
    {
      icon: <ClockIcon className="w-8 h-8" />,
      title: "پشتیبانی 24/7",
      description: "پشتیبانی تلفنی و آنلاین در تمام ساعات شبانه‌روز"
    },
    {
      icon: <StarIcon className="w-8 h-8" />,
      title: "رضایت 98% مشتریان",
      description: "بیش از ۱۰۰۰ نظر مثبت از مشتریان راضی ما"
    }
  ];

  const teamMembers = [
    {
      name: "محمد رضایی",
      position: "مدیرفروش",
      image: "/images/team/member1.jpg",
      description: "متخصص در زمینه لوازم جانبی موبایل با ۸ سال سابقه"
    },
    {
      name: "فاطمه محمدی",
      position: "پشتیبانی فنی",
      image: "/images/team/member2.jpg",
      description: "کارشناس فنی محصولات برقی و دیجیتال"
    },
    {
      name: "علی کریمی",
      position: "مدیر انبار",
      image: "/images/team/member3.jpg",
      description: "مسئول کنترل کیفیت و مدیریت موجودی"
    }
  ];

  const productCategories = [
    {
      icon: <DevicePhoneMobileIcon className="w-6 h-6" />,
      title: "لوازم جانبی موبایل",
      items: ["کابل شارژر", "هدفون و هندزفری", "پاوربانک", "هولدر و پایه", "قاب و محافظ"]
    },
    {
      icon: <ComputerDesktopIcon className="w-6 h-6" />,
      title: "لوازم جانبی کامپیوتر",
      items: ["ماوس و کیبورد", "کول پد لپ تاپ", "هاب USB", "پایه مانیتور", "کابل‌های ارتباطی"]
    },
    {
      icon: <BoltIcon className="w-6 h-6" />,
      title: "محصولات برقی",
      items: ["شارژر فست‌شارژ", "کابل دیتا", "آداپتور", "محافظ برق", "باتری external"]
    },
    {
      icon: <CpuChipIcon className="w-6 h-6" />,
      title: "اکسسوری‌های تکنولوژی",
      items: ["پایه تلویزیون", "اسپیکر بلوتوث", "هارد اکسترنال", "فلش مموری", "مبدل و تبدیل"]
    }
  ];

  const stats = [
    { number: "۵۰۰۰+", label: "محصول متنوع" },
    { number: "۲۵۰۰۰+", label: "مشتری راضی" },
    { number: "۹۸%", label: "رضایت مشتری" },
    { number: "۱۲", label: "سال تجربه" }
  ];

  return (
    <Layout>
      {/* هیرو سکشن */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full translate-x-1/2 translate-y-1/2 opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-right">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                داستان <span className="text-yellow-400">ما</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 opacity-90 leading-relaxed">
                بیش از یک دهه تجربه در ارائه بهترین لوازم جانبی موبایل و کامپیوتر
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
                <a 
                  href="https://wa.me/989143660476"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5 ml-2" />
                  ارتباط در واتساپ
                </a>
                <a 
                  href="tel:02144436676"
                  className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center backdrop-blur-sm"
                >
                  <PhoneIcon className="w-5 h-5 ml-2" />
                  ۰۲۱-۴۴۳۶۶۷۶
                </a>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/10 p-4 rounded-xl text-center">
                    <DevicePhoneMobileIcon className="w-12 h-12 mx-auto mb-3 text-yellow-400" />
                    <h3 className="font-semibold">لوازم موبایل</h3>
                    <p className="text-sm opacity-80 mt-1">۲۰۰۰+ محصول</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl text-center">
                    <ComputerDesktopIcon className="w-12 h-12 mx-auto mb-3 text-blue-400" />
                    <h3 className="font-semibold">لوازم کامپیوتر</h3>
                    <p className="text-sm opacity-80 mt-1">۱۵۰۰+ محصول</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl text-center">
                    <BoltIcon className="w-12 h-12 mx-auto mb-3 text-green-400" />
                    <h3 className="font-semibold">محصولات برقی</h3>
                    <p className="text-sm opacity-80 mt-1">۱۰۰۰+ محصول</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl text-center">
                    <CpuChipIcon className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                    <h3 className="font-semibold">اکسسوری‌ها</h3>
                    <p className="text-sm opacity-80 mt-1">۵۰۰+ محصول</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* آمار و ارقام */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* داستان ما */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                از یک فروشگاه کوچک تا بزرگترین فروشگاه آنلاین
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                در سال ۱۳۹۱ با یک فروشگاه فیزیکی کوچک در تهران شروع کردیم. عشق به تکنولوژی و نیاز بازار به محصولات باکیفیت، 
                ما را بر آن داشت تا تخصص خود را بر روی لوازم جانبی موبایل و کامپیوتر متمرکز کنیم.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                امروز با افتخار به یکی از معتبرترین فروشگاه‌های آنلاین در زمینه لوازم جانبی تبدیل شده‌ایم و 
                با بیش از ۵۰۰۰ محصول متنوع، پاسخگوی نیازهای متنوع مشتریان هستیم.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">🎯</div>
                  <h4 className="font-semibold mt-2">ماموریت ما</h4>
                  <p className="text-sm text-gray-600 mt-1">ارائه بهترین محصولات با مناسب‌ترین قیمت</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">👁️</div>
                  <h4 className="font-semibold mt-2">چشم‌انداز</h4>
                  <p className="text-sm text-gray-600 mt-1">پیشرو در صنعت لوازم جانبی دیجیتال</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 lg:p-12">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <HeartIcon className="w-8 h-8 text-red-500 mb-3" />
                    <h3 className="font-semibold text-lg mb-2">تعهد به کیفیت</h3>
                    <p className="text-gray-600 text-sm">فقط محصولات باکیفیت و اورجینال</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
                    <StarIcon className="w-8 h-8 text-yellow-500 mb-3" />
                    <h3 className="font-semibold text-lg mb-2">رضایت مشتری</h3>
                    <p className="text-gray-600 text-sm">اولویت اول ما رضایت شماست</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <ShieldCheckIcon className="w-8 h-8 text-green-500 mb-3" />
                    <h3 className="font-semibold text-lg mb-2">ضمانت بازگشت</h3>
                    <p className="text-gray-600 text-sm">۷ روز ضمانت بازگشت وجه</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
                    <TruckIcon className="w-8 h-8 text-blue-500 mb-3" />
                    <h3 className="font-semibold text-lg mb-2">تحویل سریع</h3>
                    <p className="text-gray-600 text-sm">ارسال به سراسر کشور</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* دسته‌بندی محصولات */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              تخصص ما در چه زمینه‌هایی است؟
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              با تمرکز بر چهار حوزه اصلی، بهترین محصولات را برای شما گردآوری کرده‌ایم
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-blue-600 mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ویژگی‌های منحصر به فرد */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              چرا ما را انتخاب می‌کنند؟
            </h2>
            <p className="text-lg text-gray-600">ویژگی‌هایی که ما را از دیگران متمایز می‌کند</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br rounded-2xl p-6 cursor-pointer transition-all duration-300 transform ${
                  activeFeature === index 
                    ? 'from-blue-500 to-purple-600 text-white scale-105 shadow-xl' 
                    : 'from-gray-50 to-gray-100 text-gray-900 hover:scale-105'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`mb-4 ${activeFeature === index ? 'text-white' : 'text-blue-600'}`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${activeFeature === index ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={activeFeature === index ? 'text-blue-100' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* تیم ما */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">تیم متخصص ما</h2>
            <p className="text-lg text-blue-200 max-w-3xl mx-auto">
              تیمی از متخصصان passionate که عاشق کمک به شما هستند
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <div className="text-blue-300 mb-3">{member.position}</div>
                <p className="text-blue-200 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* تماس با ما */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 lg:p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">آماده پاسخگویی به شما هستیم</h2>
                <p className="text-blue-100 text-lg mb-8">
                  برای هرگونه سوال، پیشنهاد یا انتقاد، تیم پشتیبانی ما آماده خدمت‌رسانی است.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <PhoneIcon className="w-6 h-6 ml-3 text-yellow-400" />
                    <div>
                      <div className="font-semibold">تلفن تماس</div>
                      <div className="text-blue-100">۰۲۱-۴۴۳۶۶۷۶</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <ChatBubbleLeftRightIcon className="w-6 h-6 ml-3 text-green-400" />
                    <div>
                      <div className="font-semibold">واتساپ</div>
                      <div className="text-blue-100">۰۹۱۴-۳۶۶-۰۴۷۶</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <EnvelopeIcon className="w-6 h-6 ml-3 text-red-400" />
                    <div>
                      <div className="font-semibold">ایمیل</div>
                      <div className="text-blue-100">info@techaccessory.ir</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPinIcon className="w-6 h-6 ml-3 text-purple-400" />
                    <div>
                      <div className="font-semibold">آدرس</div>
                      <div className="text-blue-100">تهران، خیابان ولیعصر</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 lg:p-8">
                <h3 className="text-xl font-semibold mb-6">ساعات کاری</h3>
                <div className="space-y-4">
                  <div className="flex justify-between pb-3 border-b border-white/20">
                    <span>شنبه تا چهارشنبه</span>
                    <span>۹:۰۰ - ۲۱:۰۰</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-white/20">
                    <span>پنجشنبه</span>
                    <span>۹:۰۰ - ۱۸:۰۰</span>
                  </div>
                  <div className="flex justify-between">
                    <span>جمعه</span>
                    <span>۱۰:۰۰ - ۱۶:۰۰</span>
                  </div>
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <a 
                    href="https://wa.me/989143660476"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center"
                  >
                    <ChatBubbleLeftRightIcon className="w-5 h-5 ml-2" />
                    شروع گفتگو
                  </a>
                  <a 
                    href="tel:02144436676"
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center"
                  >
                    <PhoneIcon className="w-5 h-5 ml-2" />
                    تماس تلفنی
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;