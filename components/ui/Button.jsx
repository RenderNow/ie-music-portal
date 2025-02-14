// components/ui/Button.jsx
export default function Button({ children, onClick, className }) {
    return (
      <button
        onClick={onClick}
        className={`px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${className}`}
      >
        {children}
      </button>
    );
  }
  