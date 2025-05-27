// src/store/useMqttStore.ts
import { create } from 'zustand';

interface MqttMessage {
  [key: string]: any; // o tipa según tu JSON si es más específico
}

interface MqttStore {
  messages: MqttMessage[];
  addMessage: (msg: MqttMessage) => void;
  clearMessages: () => void;
}

const useMqttStore = create<MqttStore>((set) => ({
  messages: [],
  addMessage: (msg) =>
    set((state) => ({
      messages: [ ...state.messages, msg],
    })),
  clearMessages: () => set({ messages: [] }),
}));

export default useMqttStore;
