export interface StreamsRecord {
  [streamId: string]: any;
}

export interface StreamObject {
  streamId: string;
  streamContent: any;
}
