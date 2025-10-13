const ProfileStats = ({ orderStats, errors, onStatusFilter, activeFilter }) => {
  if (errors.orderStats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <span className="text-red-600 ml-2">⚠️</span>
          <p className="text-red-700 text-sm">{errors.orderStats}</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      key: 'all',
      count: orderStats.total || 0,
      label: 'همه سفارش‌ها',
      color: 'gray',
      status: 'all'
    },
    {
      key: 'pending_payment',
      count: orderStats.pending_payment || 0,
      label: 'در انتظار پرداخت',
      color: 'yellow',
      status: 'pending_payment'
    },
    {
      key: 'paid',
      count: orderStats.paid || 0,
      label: 'پرداخت شده',
      color: 'blue',
      status: 'paid'
    },
    {
      key: 'active',
      count: orderStats.active || 0,
      label: 'در حال انجام',
      color: 'purple',
      status: 'active'
    },
    {
      key: 'delivered',
      count: orderStats.delivered || 0,
      label: 'تحویل شده',
      color: 'green',
      status: 'delivered'
    },
    {
      key: 'cancelled',
      count: orderStats.cancelled || 0,
      label: 'لغو شده',
      color: 'red',
      status: 'cancelled'
    }
  ];

  const getColorClasses = (color, isActive) => {
    const baseClasses = "bg-white rounded-2xl shadow-lg p-4 text-center cursor-pointer transition-all duration-300 border-2 ";
    
    const colorMap = {
      yellow: isActive 
        ? 'border-yellow-500 bg-yellow-50' 
        : 'border-transparent hover:border-yellow-300 hover:bg-yellow-25',
      blue: isActive 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-transparent hover:border-blue-300 hover:bg-blue-25',
      purple: isActive 
        ? 'border-purple-500 bg-purple-50' 
        : 'border-transparent hover:border-purple-300 hover:bg-purple-25',
      green: isActive 
        ? 'border-green-500 bg-green-50' 
        : 'border-transparent hover:border-green-300 hover:bg-green-25',
      red: isActive 
        ? 'border-red-500 bg-red-50' 
        : 'border-transparent hover:border-red-300 hover:bg-red-25',
      gray: isActive 
        ? 'border-gray-500 bg-gray-50' 
        : 'border-transparent hover:border-gray-300 hover:bg-gray-25'
    };

    return baseClasses + (colorMap[color] || colorMap.gray);
  };

  const getTextColor = (color) => {
    const colorMap = {
      yellow: 'text-yellow-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      green: 'text-green-600',
      red: 'text-red-600',
      gray: 'text-gray-600'
    };
    return colorMap[color] || 'text-gray-600';
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">فیلتر سفارش‌ها</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.key}
            onClick={() => onStatusFilter(stat.status)}
            className={getColorClasses(stat.color, activeFilter === stat.status)}
          >
            <div className={`text-2xl font-bold mb-2 ${getTextColor(stat.color)}`}>
              {stat.count}
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileStats;