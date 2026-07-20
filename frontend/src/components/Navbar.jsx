import React, { useState } from "react";

function Navbar({ user, currentView, setCurrentView, handleLogout, onOpenLogin }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isAdmin = user?.Role === 'admin' ||
        user?.role === 'admin' ||
        user?.data?.role === 'admin' ||
        user?.data?.Role === 'admin' ||
        user?.user?.role === 'admin';

    const navItems = [
        { label: 'Shop', view: 'pembeli' },
        { label: 'Archive', view: 'archive' },
        { label: 'Cart', view: 'cart' },
        { label: 'History', view: 'history' },
        ...(isAdmin ? [{ label: 'Admin Panel', view: 'admin' }] : [])
    ];

    const handleNavClick = (view) => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            {/* Overlay untuk mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            <nav className="w-full bg-black text-white sticky top-0 z-50 px-4 md:px-16 py-4 flex items-center justify-between border-b border-white/5 font-folklore">
                {/* Logo */}
                <div
                    onClick={() => handleNavClick('pembeli')}
                    className="text-lg md:text-xl font-folklore tracking-tight cursor-pointer select-none flex-shrink-0"
                >
                    The Eras Store
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-10 text-sm font-medium text-white/60">
                    {navItems.map((item) => (
                        <button
                            key={item.view}
                            onClick={() => handleNavClick(item.view)}
                            className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap ${
                                currentView === item.view ? 'text-white font-bold' : ''
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}

                    {user && (
                        <span className="text-xs bg-white/10 text-white/80 px-2.5 py-1 rounded-md tracking-wider font-semibold whitespace-nowrap">
                            {user.Username || user.username || "User"}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="bg-white hover:bg-white/90 text-black text-xs md:text-sm font-bold px-4 md:px-5 py-2 rounded-full transition-all active:scale-95 cursor-pointer shadow-sm whitespace-nowrap flex-shrink-0"
                        >
                            Logout
                        </button>
                    ) : (
                        <button
                            onClick={onOpenLogin}
                            className="bg-white hover:bg-white/90 text-black text-xs md:text-sm font-bold px-4 md:px-5 py-2 rounded-full transition-all active:scale-95 cursor-pointer shadow-sm whitespace-nowrap flex-shrink-0"
                        >
                            Login
                        </button>
                    )}

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden flex flex-col gap-1.5 p-2 hover:bg-white/10 rounded-md transition-colors"
                        aria-label="Toggle mobile menu"
                    >
                        <div
                            className={`w-5 h-0.5 bg-white transition-all duration-300 ${
                                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                            }`}
                        />
                        <div
                            className={`w-5 h-0.5 bg-white transition-all duration-300 ${
                                isMobileMenuOpen ? 'opacity-0' : ''
                            }`}
                        />
                        <div
                            className={`w-5 h-0.5 bg-white transition-all duration-300 ${
                                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                            }`}
                        />
                    </button>
                </div>
            </nav>

            <div
                className={`fixed top-16 left-0 right-0 bg-black border-b border-white/5 z-40 md:hidden transition-all duration-300 overflow-hidden font-folklore ${
                    isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'
                }`}
            >
                <div className="flex flex-col py-4 px-4 gap-2">
                    {navItems.map((item) => (
                        <button
                            key={item.view}
                            onClick={() => handleNavClick(item.view)}
                            className={`text-left px-4 py-3 rounded-md transition-colors text-sm font-medium ${
                                currentView === item.view
                                    ? 'bg-white/10 text-white font-bold'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}

                    {user && (
                        <div className="px-4 py-3 border-t border-white/10 mt-2">
                            <span className="text-xs text-white/60">Logged in as</span>
                            <p className="text-sm font-semibold text-white">
                                {user.Username || user.username || "User"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Navbar;