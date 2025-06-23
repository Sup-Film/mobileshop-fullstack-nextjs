"use client";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export default function Modal({
  title,
  children,
  isOpen,
  onClose,
  size = "lg",
  className = "",
}: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in ">
      <div
        className={`bg-gray-900 rounded-2xl shadow-2xl p-8 w-full border border-gray-700 relative animate-modal-pop ${sizes[size]} ${className} max-h-[90vh] overflow-y-auto`}>
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-blue-400 text-2xl transition-colors duration-150"
          onClick={onClose}
          aria-label="ปิด">
          ×
        </button>
        <h2 className="text-2xl font-bold text-blue-300 mb-6 text-center drop-shadow animate-fade-in-title">
          {title}
        </h2>
        <div>{children}</div>
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes modal-pop {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes fade-in-title {
          0% {
            opacity: 0;
            letter-spacing: 0.2em;
          }
          100% {
            opacity: 1;
            letter-spacing: 0.05em;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .animate-modal-pop {
          animation: modal-pop 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .animate-fade-in-title {
          animation: fade-in-title 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      `}</style>
    </div>
  );
}
