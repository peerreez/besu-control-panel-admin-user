"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import AccountBalanceChecker from "../../components/AccountBalanceChecker";

export default function AdminPage() {
    const { isAuthenticated, role, logout } = useAuth();
    const router = useRouter();
    const [showTransfer, setShowTransfer] = useState(false);

    // Panel de nodos (lógica antigua)
    const [logs, setLogs] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [containers, setContainers] = useState<string[]>([]);
    const [selectedContainer, setSelectedContainer] = useState<string>('');
    const [containerDetails, setContainerDetails] = useState<string[][]>([]);
    const [containerStatuses, setContainerStatuses] = useState<{ [key: string]: string }>({});

    const buttonClass = "bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors duration-200";

    useEffect(() => {
        if (!isAuthenticated || role !== 'admin') {
            router.replace("/login");
        }
    }, [isAuthenticated, role, router]);

    useEffect(() => {
        const fetchContainers = async () => {
            try {
                const res = await fetch('/api/nodes/container');
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                if (data.status === 'success') {
                    const nodeNames = data.output.split('\n').filter(Boolean).map((line: string) => line.split(' ')[1]);
                    setContainers(nodeNames);
                } else {
                    throw new Error(data.error || 'Unknown error');
                }
            } catch (error) {
                setStatus('Error fetching containers');
                setLogs(error instanceof Error ? error.message : String(error));
            }
        };
        fetchContainers();
    }, []);

    const handleViewStatus = async () => {
        setLoading(true);
        setLogs('');
        try {
            const res = await fetch('/api/nodes/list');
            const data = await res.json();
            if (data.status === 'success') {
                const details = data.output.split('\n').filter(Boolean).map((line: string) => line.split(' '));
                setContainerDetails(details);
                const newStatuses: { [key: string]: string } = {};
                details.forEach((detail: string[]) => {
                    newStatuses[detail[1]] = detail[2];
                });
                setContainerStatuses(newStatuses);
            } else {
                setStatus('Error fetching container status');
                setLogs(data.error || 'Unknown error');
            }
        } catch (err) {
            setStatus('Error');
            setLogs(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    const handleViewLogs = async () => {
        setContainerDetails([]);
        await callEndpoint('logs');
    };

    const handleCreateNode = async () => {
        setContainerDetails([]);
        const nodeName = prompt('Enter node name:');
        if (nodeName) {
            await callEndpoint('create', 'POST', { nodeName });
        }
    };

    const handleStartAllNodes = async () => {
        setContainerDetails([]);
        await callEndpoint('start', 'POST');
    };

    const handleStopAllNodes = async () => {
        setContainerDetails([]);
        await callEndpoint('stop', 'POST');
    };

    const handleStartStopContainer = async (containerName: string, status: string) => {
        try {
            const isRunning = status.includes('Up');
            const action = isRunning ? 'stop' : 'start';
            await callEndpoint(action, 'POST', { nodeName: containerName });
            setContainerStatuses(prev => ({
                ...prev,
                [containerName]: isRunning ? 'Stopped' : 'Up'
            }));
        } catch (error) {
            // Manejo de error opcional
        }
    };

    const handleDeleteContainer = async (containerName: string) => {
        setContainerDetails([]);
        await callEndpoint('delete', 'POST', { nodeName: containerName });
    };

    const callEndpoint = async (endpoint: string, method = 'GET', body?: object) => {
        setLoading(true);
        setLogs('');
        try {
            const res = await fetch(`/api/nodes/${endpoint}`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: body ? JSON.stringify(body) : undefined,
            });
            if (!res.ok) {
                const contentType = res.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
                } else {
                    throw new Error(`Unexpected response format: ${res.status}`);
                }
            }
            const data = await res.json();
            setStatus(`${endpoint.toUpperCase()} - ${data.status}`);
            if (data.output) setLogs(data.output);
            if (data.logs) setLogs(data.logs);
            if (data.error) setLogs(data.error);
        } catch (err) {
            setStatus('Error');
            setLogs(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    // Detectar si existe el bootnode
    const bootnodeExists = containers.includes('besu-network-bootnode');

    const handleCreateBootnode = async () => {
        setContainerDetails([]);
        // Ejecutar el script nodo.sh desde el mismo directorio que nodo_create.sh
        // Suponemos que existe un endpoint /api/nodes/create-bootnode que hace esto
        await callEndpoint('create-bootnode', 'POST');
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Panel de administrador</h1>
                    <button
                        onClick={logout}
                        className="text-sm text-red-400 hover:underline font-semibold"
                    >
                        Cerrar sesión
                    </button>
                </div>
                {/* Panel de control de nodos */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-blue-300">Control de nodos</h2>
                    <div className="flex flex-wrap gap-3 mb-6">
                        <button onClick={handleStartAllNodes} className={buttonClass + " shadow-md"}>Iniciar todos</button>
                        <button onClick={handleStopAllNodes} className={buttonClass + " shadow-md"}>Detener todos</button>
                        <button onClick={handleCreateNode} className={buttonClass + " shadow-md"}>Crear nodo</button>
                        <button onClick={handleViewStatus} className={buttonClass + " shadow-md"}>Ver estado</button>
                        <button onClick={handleViewLogs} className={buttonClass + " shadow-md"}>Ver logs Bootnode</button>
                        <button
                            onClick={handleCreateBootnode}
                            className={buttonClass + " shadow-md disabled:opacity-50 disabled:cursor-not-allowed"}
                            disabled={bootnodeExists}
                        >
                            {bootnodeExists ? "Bootnode ya existe" : "Crear Bootnode"}
                        </button>
                    </div>
                    <div className="mb-2 text-base font-medium text-gray-200">
                        {loading ? <span className="animate-pulse">Cargando...</span> : status}
                    </div>
                    <pre className="bg-gray-950 text-green-300 p-4 rounded-lg max-h-[300px] overflow-y-auto whitespace-pre-wrap border border-gray-800 text-xs">
                        {logs || 'Sin resultados aún...'}
                    </pre>
                    {containerDetails.length > 0 && (
                        <div className="overflow-x-auto mt-6 rounded-lg border border-gray-700">
                            <table className="min-w-full bg-gray-900 text-sm">
                                <thead>
                                    <tr className="bg-gray-800 text-blue-200">
                                        <th className="py-2 px-4 border-b border-gray-700 text-left font-semibold">ID</th>
                                        <th className="py-2 px-4 border-b border-gray-700 text-left font-semibold">Nombre</th>
                                        <th className="py-2 px-4 border-b border-gray-700 text-left font-semibold">Estado</th>
                                        <th className="py-2 px-4 border-b border-gray-700 text-left font-semibold">Puertos</th>
                                        <th className="py-2 px-4 border-b border-gray-700 text-left font-semibold">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {containerDetails.map((detail, index) => {
                                        const isUp = (containerStatuses[detail[1]] || detail[2]).includes('Up');
                                        return (
                                            <tr key={index} className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}>
                                                <td className="py-2 px-4 border-b border-gray-800 text-gray-300">{detail[0]}</td>
                                                <td className="py-2 px-4 border-b border-gray-800 text-gray-100 font-mono">{detail[1]}</td>
                                                <td className="py-2 px-4 border-b border-gray-800">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${isUp ? 'bg-green-800 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>{isUp ? 'Up' : 'Stopped'}</span>
                                                </td>
                                                <td className="py-2 px-4 border-b border-gray-800 text-gray-400">{detail.slice(3).join(' ')}</td>
                                                <td className="py-2 px-4 border-b border-gray-800 flex gap-2">
                                                    <button
                                                        onClick={() => handleStartStopContainer(detail[1], containerStatuses[detail[1]] || detail[2])}
                                                        className={`px-3 py-1 rounded font-semibold text-xs ${isUp ? 'bg-yellow-700 hover:bg-yellow-800 text-white' : 'bg-green-700 hover:bg-green-800 text-white'} transition`}
                                                    >
                                                        {isUp ? 'Detener' : 'Iniciar'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteContainer(detail[1])}
                                                        className="px-3 py-1 rounded font-semibold text-xs bg-red-700 hover:bg-red-800 text-white transition"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                {/* Sección de consulta de saldo */}
                <div className="pt-6 border-t border-gray-700 mt-8">
                    <AccountBalanceChecker />
                </div>
            </div>
        </div>
    );
} 