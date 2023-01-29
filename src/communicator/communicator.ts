import { Browser, ENV, Extension, Node } from "../../constants";
import { Methods } from "../../event/constants";
import { init } from "../../init";
import { ethers } from "ethers";
import { ReturnType, RequestType } from "../../event/types";
import { MessagePoster } from "./messagePoster";

export class Communicator {
  private messagePoster: MessagePoster;
  constructor() {
    switch (process.env.ENV) {
      case Browser: {
        this.messagePoster = new MessagePoster(window, window.top);
        break;
      }
      case Extension: {
        this.messagePoster = new MessagePoster(window, window);
      }
    } 
  }

  async call({
    method,
    parameters,
  }: {
    method: Methods;
    parameters: RequestType[Methods];
  }) {
    if (process.env.ENV === Node) {
      return init.eventListener[method](
        parameters as any
      ) as ReturnType[Methods];
    } else {
      this.messagePoster.sendRequest({ method, parameters });
    }
  }
}
