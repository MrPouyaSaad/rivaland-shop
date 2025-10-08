export const validateShippingForm = (data) => {
  const errors = {};

  // نام و نام خانوادگی
  if (!data.firstName?.trim()) errors.firstName = "نام الزامی است";
  if (!data.lastName?.trim()) errors.lastName = "نام خانوادگی الزامی است";

  // شماره تماس
  if (!data.phone?.trim()) {
    errors.phone = "شماره تماس الزامی است";
  } else if (!/^09\d{9}$/.test(data.phone.trim())) {
    errors.phone = "شماره تماس معتبر نیست";
  }

  // ایمیل (اختیاری اما اگر وارد شده معتبر باشد)
  if (data.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "ایمیل معتبر نیست";
  }

  // استان و شهر
  if (!data.province?.trim()) errors.province = "استان را انتخاب کنید";
  if (!data.city?.trim()) errors.city = "شهر را انتخاب کنید";

  // آدرس
  if (!data.address?.trim()) errors.address = "آدرس را وارد کنید";

  // کد پستی
  if (!data.postalCode?.trim()) {
    errors.postalCode = "کد پستی را وارد کنید";
  } else if (!/^\d{10}$/.test(data.postalCode.trim())) {
    errors.postalCode = "کد پستی باید ۱۰ رقمی باشد";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};