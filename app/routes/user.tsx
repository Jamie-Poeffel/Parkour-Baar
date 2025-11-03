import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
    const [attendance, setAttendance] = useState<"here" | "not-coming" | null>(null);

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden">
            {/* 🔹 Animated Background */}
            <motion.img
                src="https://scontent.fzrh5-1.fna.fbcdn.net/v/t1.6435-9/67964436_650975038732495_5056275830041214976_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=JqBDF03Ig0QQ7kNvwEFkYwS&_nc_oc=AdlYs0aMpvUnBPVHRyzjzCgxhT2LesEVBhL2xOSaS87-EvBfeBtv0V-s_B6qhf9zftQ&_nc_zt=23&_nc_ht=scontent.fzrh5-1.fna&_nc_gid=9QWWfv7YZdFmqznG7BaFhw&oh=00_AfaxU2ooooRUnN_gntTEgqYYyqgk_wnTeVGjkhYZFfh6DQ&oe=68F1F77C"
                alt="Parkour background"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.1, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
            />

            {/* 🔹 Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

            {/* 🔹 Content */}
            <div className="relative z-10 w-full max-w-7xl px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Attendance Section */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl flex flex-col justify-center p-8 md:p-10 min-h-[400px]"
                >
                    <div className="flex flex-col items-center text-center space-y-6">
                        <h2 className="text-3xl font-bold tracking-tight">Module 1 Attendance</h2>
                        <p className="text-gray-200 text-base max-w-sm">
                            Please confirm your attendance for today’s session.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm justify-center">
                            <button
                                onClick={() => setAttendance("here")}
                                className={`w-full py-3 rounded-xl font-semibold border transition-all active:scale-95 ${attendance === "here"
                                    ? "bg-green-500 border-green-500 scale-105"
                                    : "bg-green-500/70 hover:bg-green-600 border-green-400"
                                    }`}
                            >
                                I’m here
                            </button>

                            <button
                                onClick={() => setAttendance("not-coming")}
                                className={`w-full py-3 rounded-xl font-semibold border transition-all active:scale-95 ${attendance === "not-coming"
                                    ? "bg-red-500 border-red-500 scale-105"
                                    : "bg-red-500/70 hover:bg-red-600 border-red-400"
                                    }`}
                            >
                                I’m not coming
                            </button>
                        </div>

                        {attendance && (
                            <p className="text-gray-200 text-sm">
                                ✅ You marked:{" "}
                                <span className="font-semibold text-white">
                                    {attendance === "here" ? "Present" : "Not coming"}
                                </span>
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* Training Plan Section */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl flex flex-col justify-center p-8 md:p-10 min-h-[400px]"
                >
                    <div className="flex flex-col items-center text-center space-y-6">
                        <h2 className="text-3xl font-bold tracking-tight">Module 2 Training Plan</h2>
                        <p className="text-gray-200 text-base max-w-sm">
                            Here’s your next scheduled training session:
                        </p>

                        {(() => {
                            // 🗓️ Calculate next Monday
                            const today = new Date();
                            const day = today.getDay();
                            const daysUntilMonday = (8 - day) % 7 || 7; // always next Monday, even if today is Monday
                            const nextMonday = new Date(today);
                            nextMonday.setDate(today.getDate() + daysUntilMonday);

                            const dateStr = nextMonday.toLocaleDateString(undefined, {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            });

                            return (
                                <ul className="w-full max-w-md space-y-3">
                                    <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white/10 px-4 py-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all text-base md:text-lg">
                                        <div className="text-center sm:text-left">
                                            <span className="font-semibold text-white block">{dateStr}</span>
                                            <span className="text-gray-300 text-sm">
                                                Jump technique & balance drills
                                            </span>
                                        </div>
                                        <span className="mt-2 sm:mt-0 text-sm text-green-400 font-medium">
                                            🟢 Upcoming
                                        </span>
                                    </li>
                                </ul>
                            );
                        })()}
                    </div>
                </motion.div>

            </div>

            {/* 🔹 Footer (optional) */}
            <div className="relative z-10 mt-8 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} Parkour Baar
            </div>
        </div>
    );
}
