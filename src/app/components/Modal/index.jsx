const Modal = ({ open, onClose, children }) => {
  return (
    <div
      onClick={onClose}
      className={`
      fixed inset-0 flex justify-center items-center transition-colors
      ${open ? "visible bg-black/40" : "invisible"}
    `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
      bg-gray-300 rounded-lg shadow p-6 transition-all
      ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
      `}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-xl text-slate-400 hover:scale-125 hover:text-gray-600 duration-300 transition-all"
        >
          x
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
