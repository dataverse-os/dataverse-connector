interface RequestInputs {
  method: string;
  params?: unknown[] | object;
}

interface RequestArguments {
  sequenceId: number;
  type: "request";
}

interface ResponseArguments {
  sequenceId: number;
  type: "response";
  result: Array<any>;
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
    this.sourceOrigin.addEventListener("message", this._onmessage);
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

  private _handleRequest(args: RequestInputs & RequestArguments): void {
    if (this.destroyed) return;

    // method <--> function的对应关系
    switch (args.method) {
      default:
        console.log("method not found.");
        break;
    }
  }

  destroy() {
    this.destroyed = true;
    this.sourceOrigin.removeEventListener("message", this._onmessage);
  }
}
