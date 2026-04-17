// ─── ErrorBoundary.jsx ────────────────────────────────────────────────────
// React error boundaries must be class components — there is no hook
// equivalent because they catch errors during render, not in event handlers.
// Wrapping route-level components means a crash in one page doesn't take
// down the entire app.

import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Something went wrong.' };
  }

  componentDidCatch(error, info) {
    // In production you'd send this to Sentry / Datadog
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="empty-icon">⚠️</div>
          <p className="empty-title">SOMETHING WENT WRONG</p>
          <p className="empty-desc">{this.state.message}</p>
          <button className="mood-btn" onClick={this.handleReset}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
