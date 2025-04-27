import { NextResponse } from 'next/server';
import { startContainer, startAllNodes } from '@/lib/docker';

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => null);

        if (body && body.nodeName) {
            const output = await startContainer(body.nodeName);
            return NextResponse.json({ status: 'started', output });
        } else {
            const output = await startAllNodes();
            return NextResponse.json({ status: 'all_started', output });
        }
    } catch (error) {
        return NextResponse.json({ status: 'error', message: String(error) }, { status: 500 });
    }
}
