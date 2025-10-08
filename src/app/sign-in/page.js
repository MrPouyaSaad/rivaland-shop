'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { userApiService  } from '@/services/api';
import Image from 'next/image';

export default function AuthPage() {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const inputRefs = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const calculateTimeout = () => {
    if (resendCount < 2) return 120; // 2 دقیقه برای 2 بار اول
    if (resendCount < 4) return 300; // 5 دقیقه برای 2 بار بعدی
    return 600; // 10 دقیقه برای بار پنجم به بعد
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      await userApiService.sendCode(phoneNumber);
      setStep(2);
      setResendCount(prev => prev + 1);
      setCountdown(calculateTimeout());
      setMessage('کد تأیید با موفقیت ارسال شد');
      
      // پاک کردن کدهای قبلی
      setVerificationCode(['', '', '', '', '']);
      
      // فوکوس روی اولین فیلد کد
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 100);
    } catch (error) {
      console.error('ارسال کد ناموفق بود:', error);
      setMessage('خطا در ارسال کد، لطفاً دوباره تلاش کنید');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const code = verificationCode.join('');
      const result = await userApiService.verifyCode(phoneNumber, code);
      console.log('ورود موفق:', result);
      router.push('/');
    } catch (error) {
      console.error('کد اشتباه است:', error);
      setMessage('کد وارد شده صحیح نیست');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    setMessage('');

    try {
      await userApiService.sendCode(phoneNumber);
      setResendCount(prev => prev + 1);
      setCountdown(calculateTimeout());
      setMessage('کد جدید ارسال شد');
      
      // پاک کردن کدهای قبلی
      setVerificationCode(['', '', '', '', '']);
      
      // فوکوس روی اولین فیلد کد
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (error) {
      console.error('ارسال مجدد کد ناموفق بود:', error);
      setMessage('خطا در ارسال کد، لطفاً دوباره تلاش کنید');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep(1);
    setMessage('');
  };

  const handleCodeInput = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      
      if (value !== '' && index < 4) {
        const nextInput = inputRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleCodeKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (/^\d{5}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setVerificationCode(newCode);
      if (inputRefs.current[4]) {
        inputRefs.current[4].focus();
      }
    }
  };

  const openTermsDialog = () => {
    setShowTermsDialog(true);
  };

  const closeTermsDialog = () => {
    setShowTermsDialog(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <>
      <Head>
        <title>ریوا لند | ورود و ثبت‌نام</title>
        <meta name="description" content="ورود و ثبت‌نام در ریوا لند" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 overflow-hidden relative">
        {/* دکوراسیون پس‌زمینه */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-200 rounded-full filter blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200 rounded-full filter blur-3xl opacity-40"></div>
        
        {/* لوگوی بزرگ انگلیسی و فارسی در پس‌زمینه */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="text-center">
            <div className="text-[180px] font-black text-purple-500 mt-[+60px]">RIVA LAND</div>
            <div className="text-[120px] font-black text-indigo-200 mt-[-60px]">ریوالند</div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-4 py-8">
          <div className="w-full max-w-md">
            {/* نمایش پیام */}
            {message && (
              <div className={`mb-4 p-3 rounded-lg text-center ${message.includes('موفق') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}

            {/* لوگوی اصلی */}
            <div className="text-center mb-10 items-center justify-center flex flex-col">
              
                <div className="relative w-48 h-24">
                  <Image
                    src="/Riva-Land.png"
                    alt="Riva Land Logo"
                    fill
                    className="object-contain"
                    priority
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      const fallback = document.createElement('div');
                      fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl';
                      fallback.innerHTML = '<span class="text-2xl font-black text-white">ریوالند</span>';
                      parent.appendChild(fallback);
                    }}
                  />
                </div>
             
              <p className="text-gray-700 mt-4 text-lg font-medium">به جمع همراهان ریـوالـند خوش آمدید</p>
            </div>

            {/* کارت فرم */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {step === 1 ? (
                <form onSubmit={handleSendCode}>
                  <div className="mb-6">
                    <label htmlFor="phone" className="block text-gray-700 mb-3 font-medium text-right">
                      شماره موبایل
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 flex items-center justify-center bg-purple-100 text-purple-700 font-medium h-12 w-16 rounded-xl">
                        98+
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        className="w-full pr-4 pl-20 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-left direction-ltr placeholder:text-gray-400"
                        placeholder="912 345 6789"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        required
                        pattern="[0-9]{10}"
                        maxLength={10}
                        dir="ltr"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-3 text-right">کد تأیید برای این شماره ارسال خواهد شد</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || phoneNumber.length !== 10}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        در حال ارسال...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        دریافت کد تأیید
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </span>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyCode}>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <label htmlFor="code-0" className="block text-gray-700 font-medium text-right">
                        کد تأیید
                      </label>
                      <button
                        type="button"
                        onClick={handleBackToPhone}
                        className="text-purple-600 text-sm hover:text-purple-800 transition flex items-center"
                      >
                        تغییر شماره موبایل
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex justify-center space-x-3 direction-ltr" dir="ltr">
                      {verificationCode.map((digit, index) => (
                        <input
                          key={index}
                          id={`code-${index}`}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          className="w-12 h-12 bg-purple-50 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-center text-xl font-bold text-purple-700"
                          value={digit}
                          onChange={(e) => handleCodeInput(e, index)}
                          onKeyDown={(e) => handleCodeKeyDown(e, index)}
                          onPaste={handlePaste}
                          maxLength={1}
                          autoFocus={index === 0 && verificationCode.join('') === ''}
                        />
                      ))}
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-4 text-center">
                      کد ۵ رقمی ارسال شده به 
                      <span className="font-semibold text-purple-600"> {phoneNumber} </span> 
                      را وارد کنید
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || verificationCode.join('').length !== 5}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        در حال بررسی...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        ورود به حساب
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    )}
                  </button>

                  <div className="mt-6 text-center">
                    <button
                      type="button"
                      disabled={countdown > 0}
                      className={`text-sm transition flex items-center justify-center ${countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-purple-600 hover:text-purple-800'}`}
                      onClick={handleResendCode}
                    >
                      {countdown > 0 ? (
                        <span>ارسال مجدد پس از {formatTime(countdown)}</span>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          ارسال مجدد کد
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* فوتر */}
            <div className="mt-8 text-center text-sm text-gray-600 p-4 rounded-2xl bg-white/80 backdrop-blur-sm">
              <p>با ورود یا ثبت‌نام در ریوا لند، <button onClick={openTermsDialog} className="text-purple-600 font-medium hover:text-purple-800 underline transition">شرایط و قوانین</button> را می‌پذیرید.</p>
            </div>
          </div>
        </div>

        {/* دیالوگ باکس شرایط و قوانین */}
        {showTermsDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 text-center">شرایط و قوانین ریوا لند</h2>
              </div>
              
              <div className="p-6 overflow-y-auto flex-grow">
                <div className="space-y-4 text-gray-700 text-right">
                  <p>با عضویت در ریوا لند، شما شرایط و قوانین زیر را می‌پذیرید:</p>
                  
                  <h3 className="font-semibold text-purple-600 mt-4">1. حریم خصوصی</h3>
                  <p>ما به حریم خصوصی شما احترام می‌گذاریم و اطلاعات شخصی شما را مطابق با قوانین جمهوری اسلامی ایران محافظت می‌کنیم.</p>
                  
                  <h3 className="font-semibold text-purple-600 mt-4">2. حساب کاربری</h3>
                  <p>شما مسئول حفظ امنیت حساب کاربری خود و تمام فعالیت‌هایی هستید که تحت حساب کاربری شما انجام می‌شود.</p>
                  
                  <h3 className="font-semibold text-purple-600 mt-4">3. خرید و فروش</h3>
                  <p>تمام معاملات باید مطابق با قوانین جمهوری اسلامی ایران انجام شود. ریوا لند در قبال کالاهای غیرمجاز مسئولیتی ندارد.</p>
                  
                  <h3 className="font-semibold text-purple-600 mt-4">4. بازگرداندن کالا</h3>
                  <p>مشتریان می‌توانند طبق ضوابط سایت در صورت عدم رضایت، کالا را مرجوع کنند.</p>
                  
                  <h3 className="font-semibold text-purple-600 mt-4">5. تغییر شرایط</h3>
                  <p>ریوا لند حق تغییر این شرایط را در هر زمان با اطلاع قبلی به کاربران محفوظ می‌دارد.</p>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button 
                  onClick={closeTermsDialog}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-purple-700 transition"
                >
                  فهمیدم
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}