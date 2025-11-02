import fetch from 'node-fetch';

const BASE_URL = 'https://saironstore.liara.run';
// برای تست لوکال: const BASE_URL = 'http://localhost:5000';

async function testPayment() {
    console.log('🧪 شروع تست درگاه پرداخت...\n');
    
    // مرحله 1: دریافت توکن
    console.log('1. دریافت توکن از درگاه...');
    try {
        const response = await fetch(`${BASE_URL}/api/payments/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_TEST_JWT_TOKEN' // جایگزین کنید
            },
            body: JSON.stringify({
                orderId: `test_${Date.now()}`,
                amount: 1000,
                cellNumber: '09123456789'
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        console.log('✅ دریافت توکن موفق:');
        console.log('   - توکن:', data.token ? `${data.token.substring(0, 20)}...` : 'null');
        console.log('   - آدرس پرداخت:', data.paymentUrl);
        console.log('   - شماره سفارش:', data.orderId);

        // مرحله 2: نمایش لینک پرداخت
        console.log('\n2. لینک تست پرداخت:');
        console.log(`   🔗 https://sep.shaparak.ir/OnlinePG/SendToken?token=${data.token}`);
        
        return data.token;

    } catch (error) {
        console.log('❌ خطا در دریافت توکن:');
        console.log('   - پیام خطا:', error.message);
        
        if (error.message.includes('401')) {
            console.log('   💡 نکته: توکن JWT معتبر نیست');
        } else if (error.message.includes('500')) {
            console.log('   💡 نکته: خطای سرور - لاگ سرور را بررسی کنید');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
            console.log('   💡 نکته: خطای شبکه - اتصال اینترنت را بررسی کنید');
        }
        
        return null;
    }
}

// اجرای تست
testPayment().then(token => {
    if (token) {
        console.log('\n🎯 برای تکمیل تست:');
        console.log('   - لینک بالا را در مرورگر باز کنید');
        console.log('   - با کارت تست پرداخت کنید');
        console.log('   - پس از پرداخت، به کال‌بک هدایت می‌شوید');
    } else {
        console.log('\n❌ تست ناموفق بود. لطفاً خطاها را رفع کنید.');
    }
});