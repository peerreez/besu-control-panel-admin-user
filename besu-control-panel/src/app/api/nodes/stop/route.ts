import { NextResponse } from 'next/server';
import { stopContainer, stopAllNodes } from '@/lib/docker';

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => null);

        if (body && body.nodeName) {
            const output = await stopContainer(body.nodeName);
            return NextResponse.json({ status: 'stopped', output });
        } else {
            const output = await stopAllNodes();
            return NextResponse.json({ status: 'all_stopped', output });
        }
    } catch (error) {
        return NextResponse.json({ status: 'error', message: String(error) }, { status: 500 });
    }
}
