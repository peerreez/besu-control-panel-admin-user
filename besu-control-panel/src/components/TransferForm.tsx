"use client";
import { useState } from "react";
import { ethers } from "ethers";

export default function TransferForm() {
    const [to, setTo] = useState("");
    const [amount, setAmount] = useState("");
    const [txHash, setTxHash] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setTxHash("");
        setLoading(true);
        try {
            if (!(window as any).ethereum) {
                setError("MetaMask no está instalado");
                setLoading(false);
                return;
            }
            const provider = new ethers.BrowserProvider((window as any).ethereum);
            const signer = await provider.getSigner();
            const tx = await signer.sendTransaction({
                to,
                value: ethers.parseEther(amount)
            });
            setTxHash(tx.hash);
        } catch (err: any) {
            setError("Error al enviar la transacción");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleTransfer} className="space-y-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-100">Transferir ETH</h2>
            <div>
                <label className="block text-sm mb-1 text-gray-300">Dirección destino</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    value={to}
                    onChange={e => setTo(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className="block text-sm mb-1 text-gray-300">Monto (ETH)</label>
                <input
                    type="number"
                    min="0"
                    step="any"
                    className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition font-semibold"
                disabled={loading}
            >
                {loading ? "Enviando..." : "Enviar"}
            </button>
            {txHash && (
                <div className="text-sm text-blue-400 break-all mt-2">
                    Transacción enviada: <a href={`#`} className="underline">{txHash}</a>
                </div>
            )}
            {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
        </form>
    );
} 