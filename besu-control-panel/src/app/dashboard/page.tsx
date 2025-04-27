"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import MetaMaskConnect from "../../components/MetaMaskConnect";
import TransferForm from "../../components/TransferForm";

export default function DashboardPage() {
    const { isAuthenticated, role, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated || role !== 'user') {
            router.replace("/login");
        }
    }, [isAuthenticated, role, router]);

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 rounded shadow p-6 border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-100">Panel de usuario</h1>
                    <button
                        onClick={logout}
                        className="text-sm text-red-400 hover:underline"
                    >
                        Cerrar sesión
                    </button>
                </div>
                <MetaMaskConnect />
                <div className="mt-8">
                    <TransferForm />
                </div>
            </div>
        </div>
    );
}