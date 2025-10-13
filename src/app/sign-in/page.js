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

  // تابع برای استانداردسازی شماره تلفن
  const standardizePhoneNumber = (phone) => {
    // حذف همه کاراکترهای غیرعددی
    const cleaned = phone.replace(/\D/g, '');
    
    // اگر شماره با 0 شروع شده باشد، 0 اول را حذف می‌کنیم
    if (cleaned.startsWith('0')) {
      return cleaned.substring(1);
    }
    
    return cleaned;
  };

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
      // استانداردسازی شماره تلفن قبل از ارسال
      const standardizedPhone = standardizePhoneNumber(phoneNumber);
      
      // اعتبارسنجی شماره تلفن
      if (standardizedPhone.length !== 10) {
        throw new Error('شماره تلفن باید 10 رقم باشد');
      }

      await userApiService.sendCode(standardizedPhone);
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
      setMessage(error.message || 'خطا در ارسال کد، لطفاً دوباره تلاش کنید');
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
      // استانداردسازی شماره تلفن قبل از ارسال برای تأیید
      const standardizedPhone = standardizePhoneNumber(phoneNumber);
      
      const result = await userApiService.verifyCode(standardizedPhone, code);
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
      // استانداردسازی شماره تلفن قبل از ارسال مجدد
      const standardizedPhone = standardizePhoneNumber(phoneNumber);
      
      await userApiService.sendCode(standardizedPhone);
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

  // تابع برای فرمت کردن شماره تلفن در نمایش
  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    } else if (cleaned.length <= 10) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }
    return cleaned;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // فقط اعداد و فاصله مجاز
    const cleaned = value.replace(/[^\d\s]/g, '');
    setPhoneNumber(cleaned);
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
        <title>ســایـرون | ورود و ثبت‌نام</title>
        <meta name="description" content="ورود و ثبت‌نام در ســایـرون" />
        <link rel="icon" href="/favicon.ico" />
        {/* اصلاح viewport برای غیرفعال کردن زوم */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <style jsx global>{`
        /* غیرفعال کردن زوم در موبایل */
        * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        
        input, textarea {
          -webkit-user-select: text;
          -khtml-user-select: text;
          -moz-user-select: text;
          -ms-user-select: text;
          user-select: text;
          font-size: 16px !important; /* جلوگیری از زوم خودکار در iOS */
        }
        
        /* جلوگیری از زوم با دبل تاپ */
        html {
          touch-action: manipulation;
        }
        
        body {
          overflow-x: hidden;
          width: 100%;
          position: relative;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 overflow-hidden relative">
        {/* دکوراسیون پس‌زمینه - کوچک‌تر برای موبایل */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-purple-200 rounded-full filter blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-200 rounded-full filter blur-3xl opacity-40"></div>
        
        {/* لوگوی بزرگ انگلیسی و فارسی در پس‌زمینه - کوچک‌تر برای موبایل */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <div className="text-center">
            <div className="text-6xl md:text-[180px] font-black text-purple-500 mt-8 md:mt-[+60px]">S A I R O N</div>
            <div className="text-4xl md:text-[120px] font-black text-indigo-200 mt-2 md:mt-[-60px]">ســایـرون</div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-4 py-4">
          <div className="w-full max-w-sm">
            {/* نمایش پیام */}
            {message && (
              <div className={`mb-4 p-3 rounded-lg text-center text-sm ${message.includes('موفق') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}

            {/* لوگوی اصلی */}
            <div className="text-center mb-6 items-center justify-center flex flex-col">
              <div className="relative w-48 h-48">
                <Image
                  src="/Sairon.png"
                  alt="Sairon Logo"
                  fill
                  className="object-contain"
                  priority
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl';
                    fallback.innerHTML = '<span class="text-lg font-black text-white">ســایـرون</span>';
                    parent.appendChild(fallback);
                  }}
                />
              </div>
              <p className="text-gray-700 mt-3 text-base font-medium">به جمع همراهان ســایـرون خوش آمدید</p>
            </div>

            {/* کارت فرم */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              {step === 1 ? (
                <form onSubmit={handleSendCode}>
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 mb-2 font-medium text-right text-sm">
                      شماره موبایل
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-2 flex items-center justify-center bg-purple-100 text-purple-700 font-medium h-10 w-14 rounded-lg text-sm">
                        98+
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        className="w-full pr-3 pl-16 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-left direction-ltr placeholder:text-gray-400 text-sm"
                        placeholder="912 345 6789"
                        value={formatPhoneNumber(phoneNumber)}
                        onChange={handlePhoneChange}
                        required
                        maxLength={12} // 3 فاصله + 10 رقم
                        dir="ltr"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-right">
                      {phoneNumber.replace(/\D/g, '').length === 10 ? 
                        `شماره ارسالی به سرور: 98${standardizePhoneNumber(phoneNumber)}` : 
                        'کد تأیید برای این شماره ارسال خواهد شد'}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || standardizePhoneNumber(phoneNumber).length !== 10}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-sm"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        در حال ارسال...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        دریافت کد تأیید
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </span>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyCode}>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <label htmlFor="code-0" className="block text-gray-700 font-medium text-right text-sm">
                        کد تأیید
                      </label>
                      <button
                        type="button"
                        onClick={handleBackToPhone}
                        className="text-purple-600 text-xs hover:text-purple-800 transition flex items-center"
                      >
                        تغییر شماره موبایل
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex justify-center space-x-2 direction-ltr" dir="ltr">
                      {verificationCode.map((digit, index) => (
                        <input
                          key={index}
                          id={`code-${index}`}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          className="w-10 h-10 bg-purple-50 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-center text-lg font-bold text-purple-700"
                          value={digit}
                          onChange={(e) => handleCodeInput(e, index)}
                          onKeyDown={(e) => handleCodeKeyDown(e, index)}
                          onPaste={handlePaste}
                          maxLength={1}
                          autoFocus={index === 0 && verificationCode.join('') === ''}
                        />
                      ))}
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      کد ۵ رقمی ارسال شده به 
                      <span className="font-semibold text-purple-600"> 98{standardizePhoneNumber(phoneNumber)} </span> 
                      را وارد کنید
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || verificationCode.join('').length !== 5}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-sm"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        در حال بررسی...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        ورود به حساب
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    )}
                  </button>

                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      disabled={countdown > 0}
                      className={`text-xs transition flex items-center justify-center ${countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-purple-600 hover:text-purple-800'}`}
                      onClick={handleResendCode}
                    >
                      {countdown > 0 ? (
                        <span>ارسال مجدد پس از {formatTime(countdown)}</span>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div className="mt-6 text-center text-xs text-gray-600 p-3 rounded-xl bg-white/80 backdrop-blur-sm">
              <p>با ورود یا ثبت‌نام در ســایـرون، <button onClick={openTermsDialog} className="text-purple-600 font-medium hover:text-purple-800 underline transition">شرایط و قوانین</button> را می‌پذیرید.</p>
            </div>
          </div>
        </div>

        {/* دیالوگ باکس شرایط و قوانین */}
        {showTermsDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full max-h-[70vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 text-center">شرایط و قوانین ســایـرون</h2>
              </div>
              
              <div className="p-4 overflow-y-auto flex-grow">
                <div className="space-y-3 text-gray-700 text-right text-sm">
                  <p>با عضویت در ســایـرون، شما شرایط و قوانین زیر را می‌پذیرید:</p>
                  
                  <h3 className="font-semibold text-purple-600 mt-3">1. حریم خصوصی</h3>
                  <p>ما به حریم خصوصی شما احترام می‌گذاریم و اطلاعات شخصی شما را مطابق با قوانین جمهوری اسلامی ایران محافظت می‌کنیم.</p>
                  
                  <h3 className="font-semibold text-purple-600 mt-3">2. حساب کاربری</h3>
                  <p>شما مسئول حفظ امنیت حساب کاربری خود و تمام فعالیت‌هایی هستید که تحت حساب کاربری شما انجام می‌شود.</p>
                  
                  <h3 className="font-semibold text-purple-600 mt-3">3. خرید و فروش</h3>
                  <p>تمام معاملات باید مطابق با قوانین جمهوری اسلامی ایران انجام شود. ســایـرون در قبال کالاهای غیرمجاز مسئولیتی ندارد.</p>
                  
                  <h3 className="font-semibold text-purple-600 mt-3">4. بازگرداندن کالا</h3>
                  <p>مشتریان می‌توانند طبق ضوابط سایت در صورت عدم رضایت، کالا را مرجوع کنند.</p>
                  
                  <h3 className="font-semibold text-purple-600 mt-3">5. تغییر شرایط</h3>
                  <p>ســایـرون حق تغییر این شرایط را در هر زمان با اطلاع قبلی به کاربران محفوظ می‌دارد.</p>
                </div>
              </div>
              
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button 
                  onClick={closeTermsDialog}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition text-sm"
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