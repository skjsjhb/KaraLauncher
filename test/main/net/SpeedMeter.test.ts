import { SpeedMonitor } from '@/net/SpeedMeter';
import { Buffer } from 'node:buffer';
import { Readable, Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

class MockSource extends Readable {
    protected speed: number = 0;

    constructor(speed: number) {
        super();
        this.speed = speed;
    }

    _read(_size: number) {
        this.push(Buffer.alloc(this.speed));
    }
}

class MockDest extends Writable {
    _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void) {
        callback(null);
    }
}

describe('SpeedMonitor', () => {
    it('should break stream on low speed', async () => {
        const src = new MockSource(0);
        const dest = new MockDest();
        const ob = new SpeedMonitor(1e9, 1);
        await expect(pipeline(src, ob, dest)).rejects.toThrow();
    });
});
