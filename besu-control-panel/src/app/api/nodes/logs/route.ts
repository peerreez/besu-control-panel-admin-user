import { NextResponse } from 'next/server';
import { getLogs } from '@/lib/docker';

export async function GET() {
    try {
        const logs = await getLogs();
        return NextResponse.json({ status: 'logs', logs });
    } catch (error) {
        return NextResponse.json({ status: 'error', error });
    }
}
