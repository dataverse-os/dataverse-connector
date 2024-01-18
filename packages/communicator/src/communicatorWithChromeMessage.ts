import { generateNanoid } from "./utils";
import { CORRECT_CODE, REQUEST, RESPONSE, UNKNOWN_CODE } from "./constants";
import { RequestInputs, ResponseArguments, RequestArguments } from "./types";

interface Chrome {
  runtime: {
    onMessage: {
      addListener: (fn: Function) => void;
      removeListener: (fn: Function) => void;
    };
    sendMessage: (message, fn?: Function) => void;
  };
}

declare let chrome: Chrome;

export class CommunicatorWithChromeMessage {
  protected methodClass: any;
  protected destroyed: boolean = false;
  protected sequenceId: string = generateNanoid();
  protected callbackFunctions: Record<string, Function> = {};
  protected responseSequenceIds: Record<string, boolean> = {};
  private handleRequestMessage: Function;
  private handleResponseMessage: Function;

  constructor({ methodClass }: { methodClass: any }) {
    this.methodClass = methodClass;
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      const onmessage = this._onmessage.bind(this);
      onmessage(message, sender).then((res) => {
        res && sendResponse(res);
      });
      return true;
    });
    // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //   console.log({ message, sender, sendResponse });
    //   sendResponse({data: 'hello'});
    // });
  }

  async sendRequest(args: RequestInputs) {
    if (this.destroyed) return;
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        sequenceId: this.sequenceId,
        type: REQUEST,
        method: args.method,
        params: args.params
      });
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
    chrome.runtime.sendMessage({
      sequenceId: args.sequenceId,
      type: RESPONSE,
      result: args.result
    });
    this.responseSequenceIds[args.sequenceId] = true;
  }

  private async _onmessage(message: any, sender: any) {
    if (this.destroyed) return null;
    if (message.type === RESPONSE) {
      const args = message.data as ResponseArguments;

      // When this class sends a response, it does not need to return data when this class listens to it
      if (this.responseSequenceIds[args.sequenceId]) {
        return null;
      }

      if (this.handleRequestMessage) {
        return this.handleRequestMessage(message);
      } else {
        const callbackFunc = this.callbackFunctions[args.sequenceId];
        if (callbackFunc !== undefined && typeof callbackFunc === "function")
          callbackFunc(args.result);
      }
    } else if (message.type === REQUEST) {
      const args = message as RequestArguments & RequestInputs;

      // if code running env is different from postMessageTo, it will return and do nothing
      if (process.env.ENV !== args.postMessageTo) {
        return;
      }

      if (this.handleResponseMessage) {
        this.handleResponseMessage({ message, sender });
      } else {
        let result: { code: string; result?: any; error?: string };
        if (!this.methodClass) {
          result = {
            code: UNKNOWN_CODE,
            error:
              "Please pass in the methodClass, in order to call methods in the class"
          };
        } else {
          try {
            const res = await this.methodClass[args.method](
              args.params,
              sender
            );
            result = { code: CORRECT_CODE, result: res };
          } catch (error) {
            result = {
              code: error?.code || UNKNOWN_CODE,
              error: error?.msg || error?.message
            };
          }
        }

        return {
          sequenceId: args.sequenceId,
          type: RESPONSE,
          result,
          origin: message.origin
        };
      }
    }
  }

  // customize
  onRequestMessage(fn: (message) => void) {
    this.handleResponseMessage = fn;
  }

  // customize
  onResponseMessage(fn: (message) => void) {
    this.handleRequestMessage = fn;
  }

  destroy() {
    this.destroyed = true;
    chrome.runtime.onMessage.removeListener(this._onmessage);
  }
}
