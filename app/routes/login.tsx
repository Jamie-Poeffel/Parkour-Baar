// routes/login.tsx
import { type LoaderFunctionArgs } from "react-router";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { AiFillApple } from "react-icons/ai";

export async function loader({ request }: LoaderFunctionArgs) {
    return null;
}

export default function Login() {
    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Hintergrundbild mit Animation + Blur */}
            <motion.div
                className="absolute inset-0 bg-cover bg-center filter brightness-50 blur-sm"
                style={{
                    backgroundImage: "app\\assets\\Home_picture.jpg",
                }}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
            />

            {/* Login-Formular */}
            <div className="relative z-10 flex items-center justify-center w-full h-full px-4">
                <form className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl p-8 shadow-lg w-full max-w-md flex flex-col gap-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Login</h2>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Passwort"
                        className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition font-semibold"
                    >
                        Einloggen
                    </button>

                    <div className="flex items-center gap-2 my-4">
                        <hr className="flex-grow border-gray-300" />
                        <span className="text-gray-500">oder</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>

                    {/* OAuth Buttons */}
                    <div className="flex flex-col gap-3">
                        <a
                            href="http://localhost:3000/oauth/google"
                            className="flex items-center justify-center gap-2 border border-gray-300 rounded p-3 hover:bg-gray-100 transition"
                        >
                            <FcGoogle size={24} />
                            Mit Google anmelden
                        </a>
                        <a
                            href="http://localhost:3000/oauth/apple"
                            className="flex items-center justify-center gap-2 border border-gray-300 rounded p-3 hover:bg-gray-100 transition"
                        >
                            <AiFillApple size={24} />
                            Mit Apple anmelden
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
