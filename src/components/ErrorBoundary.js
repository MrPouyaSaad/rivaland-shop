// components/ErrorBoundary.js
'use client';
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
          <h3 className="text-red-800 font-medium">مشکلی در نمایش این بخش پیش آمد</h3>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            تلاش مجدد
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;