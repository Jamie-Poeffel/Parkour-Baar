import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const SubmitMessage = async () => {
        try {
            const res = await fetch("http://localhost:3000/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name, email, message }),
            });

            if (!res.ok) throw new Error(`Fehler: ${res.status}`);
            const result = await res.json();
            return result;
        } catch (err) {
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = await SubmitMessage();

        if (result) {
            setToast({ type: "success", message: "Nachricht erfolgreich gesendet!" });
            setName("");
            setEmail("");
            setMessage("");
        } else {
            setToast({ type: "error", message: "Fehler beim Senden. Bitte versuche es später erneut." });
        }

        // Toast nach 3 Sekunden ausblenden
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <section className="bg-gradient-to-b from-gray-100 to-white py-16 sm:py-20 md:py-24 px-4" id="contact">
            <div className="max-w-3xl mx-auto space-y-10">
                <motion.h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center">
                    Kontakt
                </motion.h2>

                <motion.form
                    className="space-y-6 bg-white p-8 rounded-2xl shadow-lg relative"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="text"
                        name="name"
                        placeholder="Dein Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Deine E-Mail"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    <textarea
                        name="message"
                        placeholder="Deine Nachricht"
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    <button
                        type="submit"
                        className="w-full bg-gray-800 text-white font-semibold rounded-lg py-3 hover:bg-gray-900 transition-colors"
                    >
                        Nachricht senden
                    </button>

                    {/* Toast */}
                    <AnimatePresence>
                        {toast && (
                            <motion.div
                                key={toast.message}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className={`absolute top-[-60px] left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white font-medium shadow-lg ${toast.type === "success" ? "bg-green-500" : "bg-red-500"
                                    }`}
                            >
                                {toast.message}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.form>
            </div>
        </section>
    );
}
