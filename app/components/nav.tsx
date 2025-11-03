import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="fixed top-4 left-0 right-0 z-50 px-2 md:px-2">
            <div className="bg-white h-12 rounded-full shadow-lg flex justify-between items-center px-3 md:px-2">
                {/* 🔹 Logo */}
                <a href="/" className="flex items-center">
                    <img
                        src="https://parcourbaar.vercel.app/dark_icon.png"
                        alt="logo"
                        className="w-8 h-8 object-contain"
                    />
                </a>

                {/* 🔹 Desktop Links */}
                <div className="hidden md:flex gap-6 items-center">
                    <NavItem label="Über" href="/#ueber" />
                    <NavItem label="Services" href="/#services" />
                    <NavItem label="Kontakt" href="/#contact" />
                </div>

                {/* 🔹 Right Side */}
                <div className="flex items-center sm:gap-3">
                    <a
                        href="/login"
                        className="hidden md:block px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                        Login
                    </a>

                    {/* Hamburger Menu for Mobile */}
                    <button
                        className="md:hidden w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition"
                        onClick={() => setMenuOpen((prev) => !prev)}
                    >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* 🔹 Mobile Menu Drawer */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden mt-3 bg-white rounded-2xl shadow-lg p-4 flex flex-col gap-3 text-gray-700"
                    >
                        <NavItem label="Über" href="/#ueber" />
                        <NavItem label="Services" href="/#services" />
                        <NavItem label="Kontakt" href="/#contact" />
                        <a
                            href="/login"
                            className="block px-4 py-2 text-center rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition"
                        >
                            Login
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

interface NavItemProps {
    label: string;
    href: string;
}

const NavItem: React.FC<NavItemProps> = ({ label, href }) => (
    <a
        href={href}
        className="px-4 py-2 rounded-full text-gray-800 hover:bg-blue-500 hover:text-white transition-colors duration-300"
    >
        {label}
    </a>
);

export default Navbar;
