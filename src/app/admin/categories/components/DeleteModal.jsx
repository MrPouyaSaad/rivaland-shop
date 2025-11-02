import { XMarkIcon, ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline';
import Notification from './Notification';

const DeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemName, 
  itemType = 'آیتم',
  description,
  loading = false,
  error = '',
  onClearError
}) => {
  const handleConfirm = async () => {
    await onConfirm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* هدر مودال */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
            حذف {itemType}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            disabled={loading}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* محتوای مودال */}
        <div className="p-6">
          {/* نمایش خطا */}
          {error && (
            <Notification 
              error={error}
              onClose={onClearError}
            />
          )}

          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              آیا از حذف "{itemName}" مطمئن هستید؟
            </h3>
            
            {description ? (
              <p className="text-sm text-gray-600 mb-2">{description}</p>
            ) : (
              <p className="text-sm text-gray-600 mb-4">
                این عمل قابل بازگشت نیست و تمام اطلاعات مربوط به این {itemType} حذف خواهد شد.
              </p>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 text-right">
                ⚠️ توجه: در صورت وجود محصولات وابسته به این {itemType}، امکان حذف وجود ندارد.
              </p>
            </div>
          </div>

          {/* دکمه‌های اقدام */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              انصراف
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  در حال حذف...
                </>
              ) : (
                <>
                  <TrashIcon className="w-4 h-4" />
                  حذف {itemType}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;