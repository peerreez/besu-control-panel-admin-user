import { exec } from 'child_process';
import { BESU_NODE } from './besu-config';
import path from 'path';

export function startNode(): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(`docker start ${BESU_NODE.containerName}`, (error, stdout, stderr) => {
            if (error) return reject(new Error(stderr));
            resolve(stdout.trim());
        });
    });
}

export function stopNode(): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(`docker stop ${BESU_NODE.containerName}`, (error, stdout, stderr) => {
            if (error) return reject(new Error(stderr));
            resolve(stdout.trim());
        });
    });
}

export function getLogs(): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(`docker logs ${BESU_NODE.containerName} --tail 100`, (error, stdout, stderr) => {
            if (error) return reject(new Error(stderr));
            resolve(stdout);
        });
    });
}

export function listNodes(): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(`docker ps --filter "name=${BESU_NODE.containerName}"`, (error, stdout, stderr) => {
            if (error) return reject(new Error(stderr));
            resolve(stdout);
        });
    });
}

export function listContainers(): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(`docker ps -a --format "{{.ID}} {{.Names}} {{.Status}} {{.Ports}}"`, (error, stdout, stderr) => {
            if (error) return reject(new Error(stderr));
            resolve(stdout);
        });
    });
}

export function startAllNodes(): Promise<string> {
    return new Promise((resolve, reject) => {
        exec('docker ps -a -f "status=exited" -q', (error, stdout, stderr) => {
            if (error) return reject(new Error(stderr));

            const containerIds = stdout.trim();
            if (!containerIds) {
                return resolve('No containers to start');
            }

            exec(`docker start ${containerIds}`, (startError, startStdout, startStderr) => {
                if (startError) return reject(new Error(startStderr));
                resolve(startStdout.trim());
            });
        });
    });
}

export function stopAllNodes(): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(`docker stop $(docker ps -q)`, (error, stdout, stderr) => {
            if (error) return reject(new Error(stderr));
            resolve(stdout.trim());
        });
    });
}
export function stopContainer(name: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(`docker stop ${name}`, (error, stdout, stderr) => {
            if (error) return reject(new Error(stderr));
            resolve(stdout.trim());
        });
    });
}

export function startContainer(name: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(`docker start ${name}`, (error, stdout, stderr) => {
            if (error) return reject(new Error(stderr));
            resolve(stdout.trim());
        });
    });
}

export function createNode(nodeName: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const scriptDir = path.resolve(process.cwd(), 'src', 'scripts');
        const scriptPath = path.join(scriptDir, 'nodo_create.sh');

        exec(`bash "${scriptPath}" "${nodeName}"`, { cwd: scriptDir }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing script: ${stderr}`);
                return reject(new Error(`Failed to create node: ${stderr}`));
            }
            console.log(`Script output: ${stdout}`);
            resolve(stdout.trim());
        });
    });
}

export function deleteNode(nodeName: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const nodeDir = path.join(
            process.cwd(),
            'src/scripts/networks/besu-network',
            nodeName
        );
        console.log(`[deleteNode] Intentando eliminar contenedor: ${nodeName}`);
        exec(`docker rm -f ${nodeName}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`[deleteNode] Error eliminando el contenedor: ${stderr}`);
                return reject(new Error(`Error eliminando el contenedor: ${stderr}`));
            }
            console.log(`[deleteNode] Contenedor eliminado. Esperando para eliminar el directorio: ${nodeDir}`);
            // Esperar 500 ms antes de intentar eliminar el directorio
            setTimeout(() => {
                exec(`rm -rf "${nodeDir}"`, (rmError, rmStdout, rmStderr) => {
                    if (rmError) {
                        console.error(`[deleteNode] Error eliminando el directorio ${nodeDir}: ${rmStderr}`);
                        return resolve(
                            `${stdout.trim()}\nAdvertencia: Contenedor eliminado, pero no se pudo eliminar el directorio ${nodeDir}: ${rmStderr}`
                        );
                    }
                    console.log(`[deleteNode] Directorio ${nodeDir} eliminado correctamente.`);
                    resolve(`${stdout.trim()}\nDirectorio ${nodeDir} eliminado correctamente.`);
                });
            }, 500);
        });
    });
}