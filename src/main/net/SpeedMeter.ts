import { TR } from '@/i18n/Locale';
import { DetailedError } from '@/util/Errors';
import { Buffer } from 'node:buffer';
import { Transform, TransformCallback } from 'node:stream';

/**
 * A transform stream which measures the download speed.
 */
export class SpeedMeter extends Transform {
    protected bufferedSize: number = 0;
    protected timeSinceEpoch: number = Date.now();

    /**
     * Gets the current speed since last call. Resets buffer size and timer after each call.
     */
    getSpeed() {
        const speed = this.bufferedSize / ((Date.now() - this.timeSinceEpoch) / 1000);
        this.bufferedSize = 0;
        this.timeSinceEpoch = Date.now();
        return speed;
    }

    _transform(chunk: any, _e: BufferEncoding, callback: TransformCallback) {
        let length: number;
        if (chunk instanceof Buffer) {
            length = chunk.length;
        } else {
            length = Buffer.from(chunk).length;
        }
        this.bufferedSize += length;
        callback(null, chunk);
    }
}

/**
 * An extension to {@link SpeedMeter} which breaks the stream when the speed is slower than expected.
 *
 * This class detects the speed periodically and breaks the stream if the speed is lower than expected by throwing
 * an {@link SpeedMonitorError}.
 */
export class SpeedMonitor extends SpeedMeter {
    protected minSpeed: number = -1;
    protected writeTimeout: number = -1;
    protected writeTimer: NodeJS.Timeout;

    constructor(minSpeed: number, timeout: number) {
        super();
        this.minSpeed = minSpeed;
        this.writeTimeout = timeout;
        this.writeTimer = setTimeout(() => this.breakStream(), this.writeTimeout);
    }

    // Breaks the stream by throwing an error
    protected breakStream() {
        this.destroy(new SpeedMonitorError(this.minSpeed));
    }

    _transform(chunk: any, e: BufferEncoding, callback: TransformCallback) {
        super._transform(chunk, e, callback);
        if (this.getSpeed() >= this.minSpeed) {
            this.writeTimer?.refresh();
        }
    }

    _destroy(error: Error | null, callback: (_?: Error | null) => void) {
        super._destroy(error, callback);
        clearTimeout(this.writeTimer);
    }
}

export class SpeedMonitorError extends DetailedError {
    constructor(minSpeed: number) {
        super(TR('main.speed-meter.speed-too-low', { minSpeed }));
    }
}
