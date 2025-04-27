import { NextRequest } from 'next/server';
import { createNode } from '@/lib/docker';

export async function POST(req: NextRequest) {
    const { nodeName } = await req.json();
    try {
        const output = await createNode(nodeName);
        return new Response(
            JSON.stringify({ status: 'created', output }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ status: 'error', error: error instanceof Error ? error.message : String(error) }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
} 