"use client";
import { useState } from "react";
import { ethers } from "ethers";

export default function AccountBalanceChecker() {
    const [address, setAddress] = useState("");
    const [balance, setBalance] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCheckBalance = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setBalance(null);
        setLoading(true);
        try {
            if (!ethers.isAddress(address)) {
                setError("Dirección inválida");
                setLoading(false);
                return;
            }
            if (!(window as any).ethereum) {
                setError("MetaMask no está instalado");
                setLoading(false);
                return;
            }
            const provider = new ethers.BrowserProvider((window as any).ethereum);
            const bal = await provider.getBalance(address);
            setBalance(ethers.formatEther(bal));
        } catch (err: any) {
            setError("No se pudo obtener el saldo");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleCheckBalance} className="space-y-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-100">Consultar saldo de cuenta</h2>
            <div>
                <label className="block text-sm mb-1 text-gray-300">Dirección</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition font-semibold"
                disabled={loading}
            >
                {loading ? "Consultando..." : "Consultar saldo"}
            </button>
            {balance !== null && (
                <div className="text-green-400 text-sm mt-2">Saldo: <span className="font-mono">{balance} ETH</span></div>
            )}
            {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
        </form>
    );
} 