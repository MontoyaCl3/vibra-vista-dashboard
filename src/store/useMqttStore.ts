// src/store/useMqttStore.ts
import { create } from 'zustand';
import supabase from '../lib/supabase';

interface ReadingData {
  ID: number;
  Serial: number;
  Time: string;
  Xpk: number;
  Xpp: number;
  Xrms: number;
  Ypk: number;
  Ypp: number;
  Yrms: number;
  Zpk: number;
  Zpp: number;
  Zrms: number;
}

interface MqttStore {
  messages: ReadingData[];
  addMessage: (msg: { Reading: ReadingData }) => void;
  clearMessages: () => void;
}

const useMqttStore = create<MqttStore>((set) => ({
  messages: [],
  addMessage: async (msg) => {
    const reading = msg.Reading;

    if (!reading) {
      console.warn('Mensaje recibido sin clave Reading:', msg);
      return;
    }

    // Guardar en Supabase
    const { error } = await supabase.from('vibration_data').insert(reading);
    if (error) {
      console.error('Error al guardar en Supabase:', error.message);
    }

    // También agregarlo al estado local si deseas
    set((state) => ({
      messages: [...state.messages, reading],
    }));
  },
  clearMessages: () => set({ messages: [] }),
}));

export default useMqttStore;
