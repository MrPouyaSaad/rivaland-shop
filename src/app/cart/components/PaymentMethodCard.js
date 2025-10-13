import React from "react";

const PaymentMethodCard = ({ method, selected = false, onSelect }) => {
  return (
    <div
      className={`border-2 rounded-lg p-4 cursor-pointer flex items-center gap-3
        ${selected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
      onClick={onSelect}
    >
      <div
        className={`w-4 h-4 rounded-full border-2 ${
          selected ? "border-blue-500 bg-blue-500" : "border-gray-300"
        }`}
      />

      {/* لوگو درگاه */}
      {method.logo && (
        <img src={method.logo} alt={method.name} className="w-10 h-10 object-contain" />
      )}

      <div>
        <h4 className="font-medium">{method.name}</h4>
        {method.description && (
          <p className="text-sm text-gray-500">{method.description}</p>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodCard;
