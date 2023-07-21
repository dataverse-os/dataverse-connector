export interface RequestInputs {
  method: string;
  params?: any;
}

export interface RequestArguments {
  sequenceId: string;
  type: 'request';
  postMessageTo: PostMessageTo;
}

export interface ResponseArguments {
  sequenceId: string;
  type: 'response';
  result: object;
}

export type PostMessageTo = 'Extension' | 'Browser';

export type Any = Record<string, any>;

export interface Message extends Any {
  type: string;
  wallet?: string;
  method?: string;
  params?: any[];
}

export interface EventMessage {
  type: string;
  wallet?: string;
  method?: string;
  params?: any;
}
