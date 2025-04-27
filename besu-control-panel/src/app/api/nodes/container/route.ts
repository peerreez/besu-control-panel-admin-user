import { NextRequest } from 'next/server';
import { listContainers } from '@/lib/docker';

export async function GET(req: NextRequest) {
    try {
        const containers = await listContainers();
        return new Response(
            JSON.stringify({ status: 'success', output: containers }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                status: 'error',
                error: error instanceof Error ? error.message : String(error),
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}