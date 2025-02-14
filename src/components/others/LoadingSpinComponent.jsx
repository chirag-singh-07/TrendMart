const LoadingSpinComponent = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="inline-block w-[100px] h-[100px] text-black bg-primary-foreground rounded-full transform translate-x-3 translate-y-3">
        <svg
          className="animate-spin w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-75"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M12 16a3 3 0 01-3-3v-6a3 3 0 013-3h6a3 3 0 013 3v6a3 3 0 01-3 3z"
          />
        </svg>
        <span className="sr-only">Loading...</span>
        <div className="absolute top-0 left-0 w-full h-full bg-primary-foreground opacity-50"></div>
      </div>
    </div>
  );
};

export default LoadingSpinComponent;
