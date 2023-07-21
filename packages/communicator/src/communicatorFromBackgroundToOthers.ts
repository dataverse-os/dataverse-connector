import { CORRECT_CODE } from "./constants";
import { EventMessage } from "./types";

interface Chrome {
  tabs: {
    sendMessage: (tabId: number, message: EventMessage, fn?: Function) => void;
    query: (
      { active, currentWindow }: { active?: boolean; currentWindow?: boolean },
      fn?: Function,
    ) => void;
  };
}

declare let chrome: Chrome;

export class CommunicatorFromBackgroundToOthers {
  constructor() {}

  async sendMessageToCurrentTab(message: EventMessage) {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
          if (response?.code === CORRECT_CODE) {
            resolve(response.result);
          } else {
            reject(response?.error);
          }
        });
      });
    });
  }

  async sendMessageToAllTabs(message: EventMessage) {
    const tabIds = await this.getAllTabIds();
    return tabIds.map(tabId => {
      chrome.tabs.sendMessage(tabId || 0, message);
    });
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
          },
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
          resolve(tabs.map(tab => tab.id));
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
