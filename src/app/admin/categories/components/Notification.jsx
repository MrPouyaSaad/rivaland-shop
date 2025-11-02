import { 
  XMarkIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';

const Notification = ({ error, success, onClose }) => {
  if (!error && !success) return null;

  const isError = !!error;
  const message = error || success;

  const styles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />
    }
  };

  const currentStyle = styles[isError ? 'error' : 'success'];

  return (
    <div className={`rounded-2xl border ${currentStyle.border} ${currentStyle.bg} p-4 mb-6 animate-in slide-in-from-top duration-300`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {currentStyle.icon}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${currentStyle.text}`}>
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`flex-shrink-0 p-1 rounded-lg hover:bg-white transition-colors duration-200 ${currentStyle.text} hover:opacity-70`}
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Notification;