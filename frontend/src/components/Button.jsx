function Buttons ({ children, onClick, type = "button", variant ='primary' }) {
    const baseStyle = 'px-4 py-2 rounded-xl font-semibold transition-all duration-300'
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    };

    return (
        <button
        type={type}
        onClick={onClick}
        className="`${baseStyle} ${variants[variant]}`"
        >
            {children}
        </button>
    );
}

export default Buttons;