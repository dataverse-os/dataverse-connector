import { init } from "@dataverse/dataverse-kernel";
import { Methods, RequestType, ReturnType } from "@dataverse/dataverse-kernel/dist/cjs/event";


export interface RequestInputs {
  method: Methods;
  params?: RequestType[Methods];
}

export interface RequestArguments {
  sequenceId: number;
  type: "request";
}

export interface ResponseArguments {
  sequenceId: number;
  type: "response";
  result: object;
}

export class RuntimeConnector {
  private targetOrigin: Window;
  private sourceOrigin: Window;
  private allowOrigins = "*";
  private sequenceId: number = 0;
  private callbackFunctions: Record<number, Function> = {};
  private destroyed: boolean = false;

  constructor(source: Window, target: Window) {
    this.targetOrigin = target;
    this.sourceOrigin = source;
    this.sourceOrigin.addEventListener("message", this._onmessage.bind(this));
  }

  sendRequest(args: RequestInputs) {
    if (this.destroyed) return;
    this.targetOrigin.postMessage(
      {
        sequenceId: this.sequenceId,
        type: "request",
        method: args.method,
        params: args.params,
      },
      this.allowOrigins
    );
  }

  sendResponse(args: ResponseArguments) {
    if (this.destroyed) return;

    this.targetOrigin.postMessage(
      {
        sequenceId: args.sequenceId,
        type: "response",
        result: args.result,
      },
      this.allowOrigins
    );
  }

  private _onmessage(event: MessageEvent) {
    console.log("on message: ", event.data);
    if (event.data.type === "response") {
      this._handleResponse(event.data);
    } else if (event.data.type === "request") {
      this._handleRequest(event.data);
    }
  }

  private _handleResponse(args: ResponseArguments): void {
    if (this.destroyed) return;

    if (args.result === undefined || args.sequenceId === undefined) return;
    const callbackFunc = this.callbackFunctions[args.sequenceId];
    callbackFunc.apply(null, args.result);
  }

  private async _handleRequest(args: RequestInputs & RequestArguments): Promise<void> {
    if (this.destroyed) return;
    if (!init.eventListener[args.method]) return;

    this.sendResponse({
      sequenceId: args.sequenceId,
      type: "response",
      result: await init.eventListener[args.method](
        args.params as any
      ) as ReturnType[Methods]
    });

  }

  destroy() {
    this.destroyed = true;
    this.sourceOrigin.removeEventListener("message", this._onmessage);
  }

}
