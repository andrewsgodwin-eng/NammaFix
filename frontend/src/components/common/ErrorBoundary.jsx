import React, { Component } from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';
import { Button } from './Button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('NammaFix React Caught Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    localStorage.removeItem('nammafix_preface_seen');
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white text-[#1A120E] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-[#E8E2D9] rounded-2xl p-6 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 mx-auto flex items-center justify-center shadow-inner">
              <AlertOctagon className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-black text-[#1A120E] tracking-tight">
              Application Encountered an Exception
            </h2>

            <p className="text-xs text-[#6B4A2E] leading-relaxed">
              A UI rendering error occurred. NammaFix core state has been isolated to prevent corruption.
            </p>

            {this.state.error?.message && (
              <div className="p-3 rounded-xl bg-[#FBF9F6] border border-[#E8E2D9] text-left font-mono text-[11px] text-rose-700 max-h-28 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                onClick={this.handleReload}
                variant="primary"
                fullWidth
                icon={RotateCcw}
              >
                Reload Window
              </Button>
              <Button
                onClick={this.handleReset}
                variant="secondary"
                fullWidth
                icon={Home}
              >
                Return Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
