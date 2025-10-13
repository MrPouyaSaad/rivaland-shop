
import Link from 'next/link';
const OrderProgress = ({ steps, order, formatDate }) => {
  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-gray-800">روند سفارش</h4>
        {order.trackingCode && (
          <Link 
            href={`/tracking/${order.trackingCode}`} 
            className="text-blue-600 text-sm hover:text-blue-700 flex items-center"
          >
            رهگیری کامل
            <span className="mr-1">↗</span>
          </Link>
        )}
      </div>
      
      <div className="relative">
        <div className="absolute left-0 right-0 top-3 h-1 bg-gray-300"></div>
        <div 
          className="absolute left-0 top-3 h-1 bg-green-500 transition-all duration-500"
          style={{
            width: `${(steps.filter(step => step.status === 'completed').length / (steps.length - 1)) * 100}%`
          }}
        ></div>
        
        <div className="flex justify-between relative">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs z-10 mb-2 transition-all ${
                step.status === 'completed' 
                  ? 'bg-green-500 text-white shadow-lg transform scale-110' 
                  : step.status === 'current'
                  ? 'bg-blue-500 text-white shadow-lg transform scale-110'
                  : step.status === 'cancelled'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {step.status === 'completed' ? '✓' : 
                 step.status === 'cancelled' ? '✕' : 
                 index + 1}
              </div>
              <div className="text-xs">
                <p className={`font-medium ${
                  step.status === 'completed' || step.status === 'current'
                    ? 'text-gray-800'
                    : 'text-gray-500'
                }`}>
                  {step.name}
                </p>
                {step.date && (
                  <p className="text-gray-400 mt-1 text-xs">
                    {formatDate(step.date)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderProgress;