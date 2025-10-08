"use client";

import React, { useState } from "react";
import StepIndicator from "./components/StepIndicator";
import CartStep from "./steps/cartStep";
import ShippingStep from "./steps/shippingStep";
import PaymentStep from "./steps/paymentStep";
import { useCart } from '@/contexts/CartContext';
import Layout from '../../components/layout/Layout';

const CartPage = () => {
  const { cartItems } = useCart();
  const [currentStep, setCurrentStep] = useState("cart");
  const [shippingInfo, setShippingInfo] = useState(null);

  const handleNextStep = (data) => {
    if (currentStep === "cart") setCurrentStep("shipping");
    else if (currentStep === "shipping") {
      setShippingInfo(data);
      setCurrentStep("payment");
    }
  };

  const handlePrevStep = () => {
    if (currentStep === "payment") setCurrentStep("shipping");
    else if (currentStep === "shipping") setCurrentStep("cart");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <StepIndicator currentStep={currentStep} />

        {/* Container با فاصله‌بندی فشرده‌تر */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5">
          {currentStep === "cart" && (
            <CartStep cartItems={cartItems} onNext={handleNextStep} />
          )}
          {currentStep === "shipping" && (
            <ShippingStep
              onNext={handleNextStep}
              onPrev={handlePrevStep}
            />
          )}
          {currentStep === "payment" && (
            <PaymentStep
              shippingInfo={shippingInfo}
              onPrev={handlePrevStep}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;