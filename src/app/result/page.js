'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Head from 'next/head';
import Image from 'next/image';

function PaymentResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const status = searchParams.get('status');
    const orderId = searchParams.get('orderId');
    const refNum = searchParams.get('refNum');
    const amount = searchParams.get('amount');
    const reason = searchParams.get('reason');
    
    setResult({
      status: status || 'error',
      orderId: orderId,
      refNum: refNum,
      amount: amount,
      reason: reason
    });
    setLoading(false);
  }, [searchParams]);

  const getStatusConfig = (status) => {
    const configs = {
      success: {
        icon: '✅',
        title: 'پرداخت موفق',
        message: 'پرداخت شما با موفقیت انجام شد.',
        color: 'text-emerald-600',
        bgColor: 'bg-white',
        borderColor: 'border-emerald-200',
        buttonColor: 'bg-emerald-600 hover:bg-emerald-700 text-white'
      },
      failed: {
        icon: '❌',
        title: 'پرداخت ناموفق',
        message: 'متأسفانه پرداخت شما انجام نشد.',
        color: 'text-rose-600',
        bgColor: 'bg-white',
        borderColor: 'border-rose-200',
        buttonColor: 'bg-rose-600 hover:bg-rose-700 text-white'
      },
      canceled: {
        icon: '⏹️',
        title: 'پرداخت لغو شد',
        message: 'پرداخت توسط شما لغو شد.',
        color: 'text-amber-600',
        bgColor: 'bg-white',
        borderColor: 'border-amber-200',
        buttonColor: 'bg-amber-600 hover:bg-amber-700 text-white'
      },
      verify_failed: {
        icon: '⚠️',
        title: 'خطا در تأیید',
        message: 'تراکنش توسط بانک تأیید نشد.',
        color: 'text-orange-600',
        bgColor: 'bg-white',
        borderColor: 'border-orange-200',
        buttonColor: 'bg-orange-600 hover:bg-orange-700 text-white'
      },
      suspicious: {
        icon: '🔍',
        title: 'تراکنش مشکوک',
        message: 'تراکنش نیاز به بررسی بیشتر دارد.',
        color: 'text-violet-600',
        bgColor: 'bg-white',
        borderColor: 'border-violet-200',
        buttonColor: 'bg-violet-600 hover:bg-violet-700 text-white'
      },
      error: {
        icon: '🚨',
        title: 'خطای سیستمی',
        message: 'خطایی در پردازش پرداخت رخ داد.',
        color: 'text-slate-600',
        bgColor: 'bg-white',
        borderColor: 'border-slate-200',
        buttonColor: 'bg-slate-600 hover:bg-slate-700 text-white'
      }
    };

    return configs[status] || configs.error;
  };

  const formatAmount = (amount) => {
    if (!amount) return '۰ ریال';
    const numAmount = parseInt(amount);
    return new Intl.NumberFormat('fa-IR').format(numAmount) + ' ریال';
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleRetryPayment = () => {
    if (result?.orderId) {
      router.push(`/checkout?orderId=${result.orderId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-300 border-t-slate-600 mx-auto"></div>
          <p className="mt-4 text-slate-500 text-sm">در حال دریافت اطلاعات پرداخت...</p>
        </div>
      </div>
    );
  }

  const config = getStatusConfig(result?.status || 'error');

  return (
    <>
      <Head>
        <title>نتیجه پرداخت - سایرون استور</title>
        <meta name="description" content="نتیجه پرداخت سفارش شما" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex justify-center pt-12 pb-8">
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <h1 className="text-xl font-light tracking-wide text-slate-800">سایرون استور</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 pb-12">
          <div className="w-full max-w-md">
            {/* Status Card */}
            <div className={`rounded-2xl ${config.bgColor} border ${config.borderColor} shadow-sm p-8 mb-6`}>
              {/* Status Icon */}
              <div className="text-center mb-8">
                <div className="text-5xl mb-4 filter grayscale">{config.icon}</div>
                <h2 className={`text-xl font-medium ${config.color} mb-2`}>
                  {config.title}
                </h2>
                <p className="text-slate-600 text-sm">{config.message}</p>
              </div>

              {/* Payment Details */}
              {(result?.orderId || result?.refNum || result?.amount) && (
                <div className="bg-slate-50 rounded-xl p-5 mb-6">
                  <h3 className="font-medium text-slate-700 mb-3 text-center text-sm">اطلاعات تراکنش</h3>
                  <div className="space-y-2.5">
                    {result.orderId && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-xs">شماره سفارش:</span>
                        <span className="font-mono text-slate-800 text-sm">{result.orderId}</span>
                      </div>
                    )}
                    {result.refNum && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-xs">شماره پیگیری:</span>
                        <span className="font-mono text-blue-500 text-sm">{result.refNum}</span>
                      </div>
                    )}
                    {result.amount && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-xs">مبلغ:</span>
                        <span className="font-medium text-emerald-600 text-sm">{formatAmount(result.amount)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reason (if any) */}
              {result?.reason && (
                <div className="bg-amber-50 rounded-lg p-4 mb-6 border border-amber-200">
                  <div className="flex items-start">
                    <span className="text-amber-500 ml-2 text-sm">💡</span>
                    <div>
                      <p className="text-amber-700 text-xs font-medium">توضیحات:</p>
                      <p className="text-amber-600 text-xs mt-1">{result.reason}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {result?.status === 'success' && (
                  <button
                    onClick={handleBackToHome}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors ${config.buttonColor}`}
                  >
                    بازگشت به فروشگاه
                  </button>
                )}
                
                {(result?.status === 'failed' || result?.status === 'canceled') && (
                  <div className="space-y-2">
                    <button
                      onClick={handleRetryPayment}
                      className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors ${config.buttonColor}`}
                    >
                      تلاش مجدد پرداخت
                    </button>
                    <button
                      onClick={handleBackToHome}
                      className="w-full py-2.5 px-4 rounded-lg border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
                    >
                      بازگشت به خانه
                    </button>
                  </div>
                )}

                {result?.status === 'error' && (
                  <button
                    onClick={handleBackToHome}
                    className="w-full py-3 px-4 rounded-lg bg-slate-600 hover:bg-slate-700 text-white font-medium text-sm transition-colors"
                  >
                    بازگشت به خانه
                  </button>
                )}
              </div>
            </div>

            {/* Help Section */}
            <div className="text-center">
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-medium text-slate-700 mb-3 text-sm">نیاز به کمک دارید؟</h3>
                <div className="flex flex-col sm:flex-row justify-center gap-2">
                  <a 
                    href="tel:02112345678"
                    className="inline-flex items-center justify-center px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-xs"
                  >
                    <span className="ml-1">📞</span>
                    <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
                  </a>
                  <a 
                    href="mailto:support@saironstore.ir"
                    className="inline-flex items-center justify-center px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-xs"
                  >
                    <span className="ml-1">✉️</span>
                    <span>پشتیبانی</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-slate-400 text-xs">
                با تشکر از اعتماد شما به سایرون استور
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PaymentResult() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-300 border-t-slate-600 mx-auto"></div>
          <p className="mt-4 text-slate-500 text-sm">در حال دریافت اطلاعات پرداخت...</p>
        </div>
      </div>
    }>
      <PaymentResultContent />
    </Suspense>
  );
}