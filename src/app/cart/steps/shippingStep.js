import React, { useState } from "react";
import ShippingForm from "../components/ShippingForm";
import Button from "@/components/ui/Button";
import { validateShippingForm } from "../utils/validation";
import { userApiService } from "@/services/api";

const ShippingStep = ({ onNext, onPrev }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "", 
    phone: "",
    email: "",
    province: "",
    city: "",
    address: "",
    postalCode: "",
    provinceId: "",
    cityId: ""
  });
  const [errors, setErrors] = useState({});
  const [saveOptions, setSaveOptions] = useState({
    updateProfile: false,
    saveAsAddress: false,
    addressTitle: ""
  });
  const [loading, setLoading] = useState(false);

  // تابع برای دریافت گزینه‌های ذخیره از کامپوننت فرزند
  const handleSaveOptions = (options) => {
    setSaveOptions(options);
  };

  const handleSubmit = async () => {
    // اعتبارسنجی فرم
    const validation = validateShippingForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    
    try {
      // 1. اگر تیک بروزرسانی پروفایل فعال بود
      if (saveOptions.updateProfile) {
        await userApiService.updateProfile({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email
        });
        console.log("پروفایل با موفقیت بروزرسانی شد");
      }

      // 2. اگر تیک ذخیره آدرس فعال بود
      if (saveOptions.saveAsAddress && saveOptions.addressTitle) {
        await userApiService.createUserAddress({
          title: saveOptions.addressTitle,
          receiver: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          province: formData.province,
          city: formData.city,
          address: formData.address,
          postalCode: formData.postalCode,
          isDefault: false
        });
        console.log("آدرس جدید با موفقیت ذخیره شد");
      }

      // 3. ادامه به مرحله بعد
      onNext(formData);
      
    } catch (error) {
      console.error("Error in saving options:", error);
      alert("خطا در ذخیره اطلاعات. لطفا دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-xl font-semibold mb-6">اطلاعات ارسال</h2>

      <ShippingForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSaveOptions={handleSaveOptions}
      />

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrev} disabled={loading}>
          بازگشت
        </Button>
        <Button onClick={handleSubmit} loading={loading}>
          ادامه به پرداخت
        </Button>
      </div>
    </div>
  );
};

export default ShippingStep;