import { NextResponse } from 'next/server';
import { listContainers } from '@/lib/docker';

export async function GET() {
    try {
        const output = await listContainers();
        return NextResponse.json({ status: 'success', output });
    } catch (error) {
        return NextResponse.json({ status: 'error', error: error instanceof Error ? error.message : String(error) });
    }
}
