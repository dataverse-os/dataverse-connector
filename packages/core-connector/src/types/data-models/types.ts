export type StreamContent = Record<string, any>;

export interface StreamsRecord {
  [streamId: string]: StreamContent;
}

export interface StreamObject {
  streamId: string;
  streamContent: StreamContent;
}
