import { Logger } from 'pino';

interface MetricsCollector {
    increment(name: string, labels?: Record<string, string>): void;
    observe(name: string, value: number, labels?: Record<string, string>): void;
}
interface CacheClient {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
}
interface ConnectorContext {
    logger: Logger;
    metrics: MetricsCollector;
    cache: CacheClient;
}
interface SyncResult<T> {
    items: T[];
    metadata: Record<string, unknown>;
}
interface Connector<TInput = void, TResult = unknown> {
    readonly id: string;
    readonly displayName: string;
    readonly supportsIncremental: boolean;
    authenticate(): Promise<void>;
    sync(input: TInput, ctx: ConnectorContext): Promise<SyncResult<TResult>>;
}
type ConnectorFactory<TInput = void, TResult = unknown> = (options: Record<string, unknown>) => Connector<TInput, TResult>;

export { CacheClient, Connector, ConnectorContext, ConnectorFactory, MetricsCollector, SyncResult };
