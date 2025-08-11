import { useEffect, useRef, useState } from "react";
import { queryClient } from "@/lib/queryClient";

export interface WebSocketMessage {
  type: "initial_data" | "faculty_added" | "status_updated";
  data: any;
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        switch (message.type) {
          case "initial_data":
            // Update faculty list in cache
            queryClient.setQueryData(["/api/faculty"], message.data);
            break;
          case "faculty_added":
            // Invalidate faculty queries to refetch
            queryClient.invalidateQueries({ queryKey: ["/api/faculty"] });
            break;
          case "status_updated":
            // Update specific faculty and invalidate queries
            queryClient.setQueryData(["/api/faculty", message.data.id], message.data);
            queryClient.invalidateQueries({ queryKey: ["/api/faculty"] });
            break;
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return { isConnected };
}
