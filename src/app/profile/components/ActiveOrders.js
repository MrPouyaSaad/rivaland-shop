import Link from 'next/link';
import OrderCard from './OrderCard';

const ActiveOrders = ({ 
  activeOrders, 
  errors, 
  getStatusInfo, 
  getOrderSteps, 
  formatDate, 
  handleCancelOrder 
}) => {
  return (
    <div className="space-y-6">
      {/* نمایش ارور سفارش‌های فعال */}
      {errors.activeOrders && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-red-600 ml-2">⚠️</span>
            <p className="text-red-700 text-sm">{errors.activeOrders}</p>
          </div>
          <button 
            onClick={() => fetchActiveOrders(activeFilter)}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      )}

      {/* نمایش ارور لغو سفارش */}
      {errors.cancelOrder && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-red-600 ml-2">⚠️</span>
            <p className="text-red-700 text-sm">{errors.cancelOrder}</p>
          </div>
        </div>
      )}
      
      {!errors.activeOrders && activeOrders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-4">هیچ سفارشی پیدا نشد</h3>
          <Link href="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            شروع به خرید
          </Link>
        </div>
      ) : (
        !errors.activeOrders && activeOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            getStatusInfo={getStatusInfo}
            getOrderSteps={getOrderSteps}
            formatDate={formatDate}
            handleCancelOrder={handleCancelOrder}
          />
        ))
      )}
    </div>
  );
};

export default ActiveOrders;