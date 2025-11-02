// app/contact/page.js
'use client';

import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { 
  PhoneIcon, 
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  PaperAirplaneIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const contactMethods = [
    {
      icon: <DevicePhoneMobileIcon className="w-8 h-8" />,
      title: "تماس تلفنی",
      description: "مستقیماً با ما تماس بگیرید",
      contacts: [
        {
          number: "۰۹۰۲۸۴۳۰۸۳۰",
          link: "tel:09028430830"
        },
        {
          number: "۰۹۳۳۷۳۵۷۳۰۲", 
          link: "tel:09337357302"
        }
      ],
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <ChatBubbleLeftRightIcon className="w-8 h-8" />,
      title: "واتساپ",
      description: "پیام سریع در واتساپ",
      contacts: [
        {
          number: "۰۹۰۲۸۴۳۰۸۳۰",
          link: "https://wa.me/989028430830"
        },
        {
          number: "۰۹۳۳۷۳۵۷۳۰۲",
          link: "https://wa.me/989337357302"
        }
      ],
      color: "from-green-400 to-green-600"
    },
    {
      icon: <PaperAirplaneIcon className="w-8 h-8" />,
      title: "تلگرام",
      description: "ارسال پیام در تلگرام", 
      contacts: [
        {
          number: "۰۹۰۲۸۴۳۰۸۳۰",
          link: "https://t.me/09028430830"
        },
        {
          number: "۰۹۳۳۷۳۵۷۳۰۲",
          link: "https://t.me/09337357302"
        }
      ],
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: <EnvelopeIcon className="w-8 h-8" />,
      title: "ایمیل",
      description: "ارسال ایمیل به ما",
      contacts: [
        {
          number: "saironstore.ir@gmail.com",
          link: "mailto:saironstore.ir@gmail.com"
        }
      ],
      color: "from-red-400 to-red-600"
    }
  ];

  const workingHours = [
    { day: "شنبه تا چهارشنبه", hours: "۹:۰۰ - ۲۱:۰۰" },
    { day: "پنجشنبه", hours: "۹:۰۰ - ۱۸:۰۰" },
    { day: "جمعه", hours: "۱۰:۰۰ - ۱۶:۰۰" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
              در <span className="text-yellow-400">تماس</span> باشید
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90 leading-relaxed max-w-3xl mx-auto">
              ما اینجا هستیم تا به سوالات شما پاسخ دهیم و بهترین خدمات را ارائه کنیم
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="https://wa.me/989028430830"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg"
              >
                <ChatBubbleLeftRightIcon className="w-6 h-6 ml-2" />
                گفتگو در واتساپ
              </a>
              <a 
                href="tel:09028430830"
                className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg backdrop-blur-sm"
              >
                <PhoneIcon className="w-6 h-6 ml-2" />
                ۰۹۰۲۸۴۳۰۸۳۰
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* روش‌های تماس */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              راه‌های ارتباط با ما
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              از طریق روش‌های مختلف می‌توانید با ما در ارتباط باشید
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className={`bg-gradient-to-r ${method.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4`}>
                  {method.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{method.description}</p>
                <div className="space-y-2">
                  {method.contacts.map((contact, contactIndex) => (
                    <a
                      key={contactIndex}
                      href={contact.link}
                      target={contact.link.startsWith('http') ? '_blank' : '_self'}
                      rel={contact.link.startsWith('http') ? 'noopener noreferrer' : ''}
                      className="block bg-gray-50 hover:bg-gray-100 rounded-xl p-3 transition-all duration-200 text-center font-medium text-gray-800 hover:text-blue-600"
                    >
                      {contact.number}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* فرم تماس و اطلاعات */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* فرم تماس */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">پیام خود را ارسال کنید</h2>
              <p className="text-gray-600 mb-8">
                فرم زیر را پر کنید تا در اسرع وقت با شما تماس بگیریم
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      نام کامل *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="نام خود را وارد کنید"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      شماره تماس *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="09xxxxxxxxx"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    آدرس ایمیل
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    موضوع *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="موضوع پیام"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    پیام شما *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                    placeholder="متن پیام خود را اینجا بنویسید..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white py-4 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  <PaperAirplaneIcon className="w-5 h-5 ml-2 rotate-90" />
                  ارسال پیام
                </button>
              </form>
            </div>
            
            {/* اطلاعات تماس */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">اطلاعات تماس</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <PhoneIcon className="w-6 h-6 ml-4 mt-1 text-yellow-400 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">شماره‌های تماس</h4>
                      <div className="space-y-2">
                        <a href="tel:09028430830" className="block hover:text-yellow-300 transition-colors">
                          ۰۹۰۲۸۴۳۰۸۳۰
                        </a>
                        <a href="tel:09337357302" className="block hover:text-yellow-300 transition-colors">
                          ۰۹۳۳۷۳۵۷۳۰۲
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <EnvelopeIcon className="w-6 h-6 ml-4 mt-1 text-red-400 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">آدرس ایمیل</h4>
                      <a 
                        href="mailto:saironstore.ir@gmail.com"
                        className="hover:text-red-300 transition-colors"
                      >
                        saironstore.ir@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPinIcon className="w-6 h-6 ml-4 mt-1 text-green-400 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">آدرس فروشگاه</h4>
                      <p className="text-blue-100">
                    تبریز، ائلگلی، سینا ، گلبرگ، پلاک صفر
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* ساعات کاری */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">ساعات کاری</h3>
                
                <div className="space-y-4">
                  {workingHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium text-gray-700">{schedule.day}</span>
                      <span className="text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="flex items-center">
                    <ClockIcon className="w-5 h-5 text-yellow-600 ml-2" />
                    <span className="text-yellow-800 font-medium">پشتیبانی ۲۴/۷ در واتساپ و تلگرام</span>
                  </div>
                </div>
              </div>
              
              {/* دکمه‌های سریع */}
              <div className="grid grid-cols-2 gap-4">
                <a 
                  href="https://wa.me/989028430830"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5 ml-2" />
                  واتساپ
                </a>
                <a 
                  href="https://t.me/09028430830"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center"
                >
                  <PaperAirplaneIcon className="w-5 h-5 ml-2" />
                  تلگرام
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">هنوز سوالی دارید؟</h2>
          <p className="text-xl text-blue-200 mb-8">
            تیم پشتیبانی ما آماده پاسخگویی به تمام سوالات شماست
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:09028430830"
              className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <PhoneIcon className="w-5 h-5 ml-2" />
              تماس فوری
            </a>
            <a 
              href="https://wa.me/989028430830"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5 ml-2" />
              گفتگوی آنلاین
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;