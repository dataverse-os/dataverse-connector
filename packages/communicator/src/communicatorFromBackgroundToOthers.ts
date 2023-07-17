import { EventMessage } from "./types";

interface Chrome {
  tabs: {
    sendMessage: (tabId: number, message: EventMessage, fn?: Function) => void;
    query: (
      { active, currentWindow }: { active?: boolean; currentWindow?: boolean },
      fn?: Function
    ) => void;
  };
}

declare var chrome: Chrome;

export class CommunicatorFromBackgroundToOthers {
  constructor() {}

  async sendMessage(message: EventMessage) {
    const tabIds = await this.getAllTabIds();
    return Promise.all(
      tabIds.map((tabId) => {
        return new Promise((resolve) => {
          chrome.tabs.sendMessage(tabId || 0, message, (result) => {
            resolve(result);
          });
        });
      })
    );
  }

  // get now active tab's id
  async getTabId() {
    return new Promise((resolve, reject) => {
      try {
        chrome.tabs.query(
          {
            active: true,
            currentWindow: true,
          },
          (tabs: any) => {
            resolve(tabs[0]?.id);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  // get now active tab's id
  async getAllTabIds(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      try {
        chrome.tabs.query({}, (tabs: any) => {
          resolve(tabs.map((tab) => tab.id));
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
