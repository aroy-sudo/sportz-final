"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

type WSMessage = 
  | { type: "match_created"; data: any }
  | { type: "commentary"; data: any }
  | { type: "welcome" }
  | { type: "subscribed"; matchId: number }
  | { type: "unsubscribed"; matchId: number }
  | { type: "error"; message: string }
  | { type: "score_update"; matchId: number; data: any }; // Based on backend behavior

interface WebSocketContextType {
  isConnected: boolean;
  subscribeToMatch: (matchId: number) => void;
  unsubscribeFromMatch: (matchId: number) => void;
  lastMessage: WSMessage | null;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WS Connected");
      setIsConnected(true);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
      } catch (error) {
        console.error("Failed to parse WS message", error);
      }
    };

    ws.onclose = () => {
      console.log("WS Disconnected");
      setIsConnected(false);
      wsRef.current = null;
      // Auto-reconnect
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log("Attempting to reconnect...");
        connect();
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error("WS Error:", error);
    };

    wsRef.current = ws;
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  const subscribeToMatch = useCallback((matchId: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "subscribe", matchId }));
    } else {
      // If not connected yet, try again after a small delay (or implement a queue)
      setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: "subscribe", matchId }));
        }
      }, 1000);
    }
  }, []);

  const unsubscribeFromMatch = useCallback((matchId: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "unsubscribe", matchId }));
    }
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        subscribeToMatch,
        unsubscribeFromMatch,
        lastMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
