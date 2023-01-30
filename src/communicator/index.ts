interface RequestInputs {
  method: string;
  params?: any;
}

interface RequestArguments {
  sequenceId: number;
  type: "request";
}

interface ResponseArguments {
  sequenceId: number;
  type: "response";
  result: object;
}

export class Communicator {
  protected targetOrigin: Window;
  protected sourceOrigin: Window;
  protected allowOrigins = "*";
  protected destroyed: boolean = false;
  protected sequenceId: number = 0;
  protected callbackFunctions: Record<number, Function> = {};

  private handleReqMessage: Function = () => { };
  private handleResMessage: Function = () => { };

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
    // console.log("on message: ", event.data);
    if (this.destroyed) return;

    if (event.data.type === "response") {
      this.handleReqMessage(event);
    } else if (event.data.type === "request") {
      this.handleResMessage(event);
    }
  }

  onReqMessage(fn: (event: MessageEvent) => void) {
    this.handleResMessage = fn
  }

  onResMessage(fn: (event: MessageEvent) => void) {
    this.handleReqMessage = fn
  }

  private _handleResponse(args: ResponseArguments): void {
    if (this.destroyed) return;
    if (args.result === undefined || args.sequenceId === undefined) return;

    const callbackFunc = this.callbackFunctions[args.sequenceId];
    callbackFunc.apply(null, args.result);

    this.handleReqMessage()
  }

  private async _handleRequest(args: RequestInputs & RequestArguments): Promise<void> {
    if (this.destroyed) return;

  }

  destroy() {
    this.destroyed = true;
    this.sourceOrigin.removeEventListener("message", this._onmessage);
  }

}
