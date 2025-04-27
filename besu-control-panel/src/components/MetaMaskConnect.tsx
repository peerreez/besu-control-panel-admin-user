"use client";
import { useState } from "react";
import { ethers } from "ethers";

export default function MetaMaskConnect() {
    const [account, setAccount] = useState<string | null>(null);
    const [error, setError] = useState<string>("");

    const connectWallet = async () => {
        if (!(window as any).ethereum) {
            setError("MetaMask no está instalado");
            return;
        }
        try {
            const provider = new ethers.BrowserProvider((window as any).ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            setAccount(accounts[0]);
            setError("");
        } catch (err: any) {
            setError("Error al conectar MetaMask");
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
    };

    return (
        <div className="flex flex-col items-center">
            {account ? (
                <div className="flex flex-col items-center">
                    <div className="mb-2 text-green-600 font-mono text-sm break-all">
                        Conectado: {account}
                    </div>
                    <button
                        onClick={disconnectWallet}
                        className="bg-gray-200 text-gray-700 px-4 py-1 rounded hover:bg-gray-300 text-sm"
                    >
                        Desconectar
                    </button>
                </div>
            ) : (
                <button
                    onClick={connectWallet}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Conectar MetaMask
                </button>
            )}
            {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
        </div>
    );
} 