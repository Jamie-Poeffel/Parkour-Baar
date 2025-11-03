export default function NotAllowed() {
    return (
        <div className="w-screen h-screen flex items-center justify-center bg-white text-black px-4">
            <div className="max-w-lg w-full text-center p-8 sm:p-12 border border-gray-300 rounded-2xl shadow-lg">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">Access Denied</h1>
                <p className="text-gray-700 mb-6 text-base sm:text-lg">
                    You do not have permission to view this page.
                </p>
                <a
                    href="/"
                    className="inline-block bg-black text-white px-6 py-3 rounded-xl font-semibold text-base sm:text-lg hover:bg-gray-800 transition-colors"
                >
                    Go Back Home
                </a>
            </div>
        </div>
    );
}
