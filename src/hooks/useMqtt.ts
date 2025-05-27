// hooks/useMqtt.js
import { useEffect, useState } from 'react';
import mqtt from 'mqtt';

const useMqtt = (routingKey) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const options = {
      username: 'React',
      password: 'Pymex123',
      connectTimeout: 4000,
      clean: true,
      reconnectPeriod: 1000,
    };

    const client = mqtt.connect(
      'wss://ab0f6c26c91c490c820eb292ba70ec85.s1.eu.hivemq.cloud:8884/mqtt',
      options
    );

    client.on('connect', () => {
      console.log('Connected to MQTT broker');

      client.subscribe(routingKey, (err) => {
        if (err) {
          console.error('Subscription error:', err);
        } else {
          console.log('Subscribed to', routingKey);
        }
      });
    });

    client.on('message', (topic, message) => {
      if (topic === routingKey) {
        try {
          const json = JSON.parse(message.toString());
          setMessages((prev) => [json, ...prev]);
        } catch (e) {
          console.warn('Invalid JSON:', message.toString());
        }
      }
    });

    client.on('error', (err) => {
      console.error('MQTT error:', err);
    });

    return () => {
      client.end(true, () => {
        console.log('MQTT client disconnected cleanly');
      });
    };
  }, [routingKey]);

  return messages;
};

export default useMqtt;