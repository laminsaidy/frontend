import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import '../styles/components/ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Component Error:", error, errorInfo);

    // Log to error monitoring service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
      // this.logErrorToService(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.navigate('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>⚠️ Unexpected Error</h2>
            <p>We're sorry - something went wrong.</p>

            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Debug Information</summary>
                <p>{this.state.error?.toString()}</p>
                <pre>{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}
            <div className="error-actions">
              <button
                onClick={this.handleReset}
                className="error-retry-btn"
              >
                Retry
              </button>
              <a href="/" className="error-home-link">
                Return Home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Wrap with navigate prop
export default function ErrorBoundaryWrapper(props) {
  const navigate = useNavigate();
  return <ErrorBoundary {...props} navigate={navigate} />;
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  navigate: PropTypes.func.isRequired
};
