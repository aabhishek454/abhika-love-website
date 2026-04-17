import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:\n', error, '\n', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white p-8">
          <div className="bg-white/5 border border-red-500/30 p-8 rounded-[2rem] max-w-md w-full text-center">
            <h2 className="text-xl font-bold mb-4 text-red-400">Oops, something went wrong.</h2>
            <p className="text-white/60 mb-6 text-sm">{this.state.errorMessage}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-love-pink text-white px-6 py-3 rounded-full font-bold shadow-lg"
            >
              Reload Experience
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
