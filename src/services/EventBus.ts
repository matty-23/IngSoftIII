import { EventEmitter } from 'events';


export class EventBus {
    private static instance: EventBus;
    private emitter: EventEmitter;

    private constructor() {
        this.emitter = new EventEmitter();
    }

    public static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }

    public emit(event: string, data: any): void {
        console.log(`📢 [EventBus] Emitiendo: ${event}`, data);
        this.emitter.emit(event, data);
    }

    public on(event: string, handler: (data: any) => void): void {
        this.emitter.on(event, handler);
    }
}