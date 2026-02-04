import { Link } from "react-router-dom";

export default function Debug() {
    const vars = [
        'VITE_FIREBASE_API_KEY',
        'VITE_FIREBASE_AUTH_DOMAIN',
        'VITE_FIREBASE_PROJECT_ID',
        'VITE_FIREBASE_STORAGE_BUCKET',
        'VITE_FIREBASE_MESSAGING_SENDER_ID',
        'VITE_FIREBASE_APP_ID',
        'VITE_FIREBASE_MEASUREMENT_ID'
    ];

    return (
        <div className="min-h-screen bg-black text-white p-8 font-mono">
            <h1 className="text-3xl font-bold mb-6 text-yellow-500">🛠️ Environment Debugger</h1>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 max-w-2xl">
                <h2 className="text-xl mb-4 border-b border-gray-700 pb-2">Netlify Configuration Check</h2>

                <ul className="space-y-3">
                    {vars.map(key => {
                        const isPresent = !!import.meta.env[key];
                        return (
                            <li key={key} className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">{key}</span>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${isPresent ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                    {isPresent ? '✅ DETECTED' : '❌ MISSING'}
                                </span>
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-8 p-4 bg-gray-800 rounded text-sm text-gray-300">
                    <p className="mb-2"><strong className="text-white">Status:</strong> {vars.every(k => import.meta.env[k]) ? "Ready to Launch 🚀" : "Configuration Error ⚠️"}</p>
                    {!vars.every(k => import.meta.env[k]) && (
                        <p className="mt-2 text-red-400">
                            Please go to Netlify &gt; Site Settings &gt; Environment Variables and ensure all Missing keys are added with exactly these names.
                        </p>
                    )}
                </div>
            </div>

            <Link to="/" className="mt-8 inline-block text-blue-400 hover:underline">&larr; Back to Home</Link>
        </div>
    );
}
