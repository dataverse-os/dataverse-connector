import { CALLBACK } from "./constants";
import { Message } from "./types";

export class CommunicatorFromBackgroundToBackground {
  constructor() {}

  async sendMessage(message: Message) {
    return new Promise((resolve, reject) => {
      globalThis.emitter.emit(message.type, message);
      globalThis.emitter.on(`${message.type}${CALLBACK}`, (response) => {
        const { code, res, error } = response;
        if (code === 0) {
          resolve(res);
        } else {
          reject(new Error(error));
        }
      });
    });
  }
}
