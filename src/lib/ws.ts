import Cookies from 'js-cookie';
import { toast } from 'sonner';
export type WSMessage = { type: string; [key: string]: any };
type Handler = (message: WSMessage) => void;
type HandlerMap = Record<string, Set<Handler>>;
class WebSocketClient {
  private ws: WebSocket | null = null;
  private getUrl: () => string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private eventHandlers: HandlerMap = {};
  private isConnecting = false;
  private shouldReconnect = true;
  constructor(getUrl: () => string) {
    this.getUrl = getUrl;
  }
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
        resolve();
        return;
      }
      this.isConnecting = true;
      try {
        this.ws = new WebSocket(this.getUrl());
        this.ws.onopen = () => {
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.reconnectDelay = 1000;
          console.log('✅ WebSocket connected successfully!');
          console.log('   URL:', this.getUrl().split('?')[0]); // Hide token
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WSMessage = JSON.parse(event.data);
            console.log('📩 WebSocket Message Received:', message);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
        this.ws.onclose = (event) => {
          this.isConnecting = false;
          console.log('❌ WebSocket closed:', event.code, event.reason);
          if (this.shouldReconnect) {
            this.scheduleReconnect();
          }
        };
        this.ws.onerror = (error) => {
          this.isConnecting = false;
          console.error('WebSocket error:', error);
          reject(error);
        };

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      toast.error('Connection lost. Please refresh the page.');
      return;
    }
    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts), 30000);
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    setTimeout(() => {
      this.connect().catch(() => {
        // Reconnection failed, will try again
      });
    }, delay);
  }
  private handleMessage(message: WSMessage): void {
    console.log(`🔔 Handling message type: ${message.type}`);
    const handlers = this.eventHandlers[message.type];
    if (!handlers) {
      console.warn(`⚠️ No handlers registered for message type: ${message.type}`);
      return;
    }
    console.log(`✅ Found ${handlers.size} handler(s) for ${message.type}`);
    handlers.forEach((handler) => handler(message));
  }

  on(event: string, handler: Handler): void {
    if (!this.eventHandlers[event]) this.eventHandlers[event] = new Set();
    this.eventHandlers[event].add(handler);
    console.log(`🎧 Registered handler for event: ${event}`);
  }
  off(event: string, handler?: Handler): void {
    if (!handler) {
      delete this.eventHandlers[event];
      return;
    }
    const handlers = this.eventHandlers[event];
    if (!handlers) return;
    handlers.delete(handler);
    if (handlers.size === 0) delete this.eventHandlers[event];
  }

  send(message: WSMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }
  disconnect(): void {
    this.shouldReconnect = false;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
// Singleton instance
let wsClient: WebSocketClient | null = null;

export function getWebSocketClient(): WebSocketClient {
  if (!wsClient) {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/notifications/';
    const getUrl = () => {
      const token = Cookies.get('access_token');
      if (!token) return wsUrl;
      const sep = wsUrl.includes('?') ? '&' : '?';
      return `${wsUrl}${sep}token=${token}`;
    };
    wsClient = new WebSocketClient(getUrl);
  }
  return wsClient;
}
export function disconnectWebSocket(): void {
  if (wsClient) {
    wsClient.disconnect();
    wsClient = null;
  }
}
