"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
    const { login, role } = useAuth();
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(username, password)) {
            if (username === "admin") {
                router.push("/admin");
            } else {
                router.push("/dashboard");
            }
        } else {
            setError("Usuario o contraseña incorrectos");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-8 rounded shadow-md w-full max-w-sm border border-gray-700"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">Iniciar sesión</h2>
                <div className="mb-4">
                    <label className="block mb-1 text-gray-300">Usuario</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-gray-300">Contraseña</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}
                <button
                    type="submit"
                    className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition-colors font-semibold"
                >
                    Entrar
                </button>
            </form>
        </div>
    );
} 