import {
  CORRECT_CODE,
  MESSAGE,
  REQUEST,
  RESPONSE,
  UNKNOWN_CODE,
} from "./constants";
import {
  RequestInputs,
  ResponseArguments,
  RequestArguments,
  PostMessageTo,
} from "./types";
import { generateNanoid } from "./utils";
/**
 * use to communicate between browser (runtime-connector) and extension (dataverse-kernel)
 */
export class Communicator {
  protected targetOrigin: Window;
  protected sourceOrigin: Window;
  protected methodClass: any;
  protected postMessageTo: PostMessageTo;
  protected allowOrigins = "*";
  protected destroyed: boolean = false;
  protected sequenceId: string = generateNanoid();
  protected callbackFunctions: Record<string, Function> = {};
  protected responseSequenceIds: Record<string, boolean> = {};
  private handleRequestMessage: Function;
  private handleResponseMessage: Function;

  constructor({
    source,
    target,
    methodClass,
  }: {
    source: Window;
    target: Window;
    methodClass?: any;
  }) {
    this.targetOrigin = target;
    this.sourceOrigin = source;
    this.methodClass = methodClass;
    this.sourceOrigin.addEventListener(MESSAGE, this._onmessage.bind(this));
  }

  async sendRequest(args: RequestInputs) {
    if (this.destroyed) return;
    return new Promise((resolve, reject) => {
      this.targetOrigin.postMessage(
        {
          sequenceId: this.sequenceId,
          type: REQUEST,
          method: args.method,
          params: args.params,
          postMessageTo: args.postMessageTo,
        },
        this.allowOrigins,
      );
      this.callbackFunctions[this.sequenceId] = (res: any) => {
        if (res.code === CORRECT_CODE) {
          resolve(res.result);
        } else {
          reject(res.error);
        }
      };
      this.sequenceId = generateNanoid();
    });
  }

  sendResponse(args: ResponseArguments & { origin: string }) {
    if (this.destroyed) return;
    this.targetOrigin.postMessage(
      {
        sequenceId: args.sequenceId,
        type: RESPONSE,
        result: args.result,
      },
      args.origin,
    );
    this.responseSequenceIds[args.sequenceId] = true;
  }

  private async _onmessage(event: MessageEvent) {
    if (this.destroyed) return;
    if (event.data.type === RESPONSE) {
      const args = event.data as ResponseArguments;
      // When this class sends a response, it does not need to return data when this class listens to it
      if (this.responseSequenceIds[args.sequenceId]) {
        return;
      }

      if (this.handleRequestMessage) {
        this.handleRequestMessage(event);
      } else {
        const callbackFunc = this.callbackFunctions[args.sequenceId];
        if (callbackFunc !== undefined && typeof callbackFunc === "function")
          callbackFunc(args.result);
      }
    } else if (event.data.type === REQUEST) {
      const args = event.data as RequestArguments & RequestInputs;
      // When this class sends a request, it does not need to return data when this class listens to it
      if (this.callbackFunctions[args.sequenceId]) {
        return;
      }
      if (this.handleResponseMessage) {
        this.handleResponseMessage(event);
        return;
      }

      // if code running env is different from postMessageTo, it will return and do nothing
      if (
        args.postMessageTo === "Extension" ||
        (args.postMessageTo === "Browser" &&
          process.env.ENV &&
          process.env.ENV !== "Browser")
      ) {
        return;
      }

      let result: { code: string; result?: any; error?: string };
      let isMethodClassHasMethod: boolean;

      if (!this.methodClass) {
        result = {
          code: UNKNOWN_CODE,
          error:
            "Please pass in the methodClass, in order to call methods in the class",
        };
      } else {
        if (this.methodClass[args.method]) {
          isMethodClassHasMethod = true;
          try {
            const res = await this.methodClass[args.method](args.params);
            result = { code: CORRECT_CODE, result: res };
          } catch (error) {
            console.log(error);
            result = {
              code: error?.code || UNKNOWN_CODE,
              error: error?.msg || error?.message,
            };
          }
        }
      }

      if (!this.methodClass || isMethodClassHasMethod) {
        this.sendResponse({
          sequenceId: args.sequenceId,
          type: RESPONSE,
          result,
          origin: event.origin,
        });
      }
    }
  }

  // customize
  onRequestMessage(fn: (event: MessageEvent) => void) {
    this.handleResponseMessage = fn;
  }

  // customize
  onResponseMessage(fn: (event: MessageEvent) => void) {
    this.handleRequestMessage = fn;
  }

  destroy() {
    this.destroyed = true;
    this.sourceOrigin.removeEventListener(MESSAGE, this._onmessage.bind(this));
  }
}
