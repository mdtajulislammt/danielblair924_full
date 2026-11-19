import { io, Socket } from "socket.io-client";
import { AppConfig } from "@/config/app.config";
import { CookieHelper } from "@/helper/cookie.helper";

let socket: Socket | null = null;

export function getSocket(): Socket | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (socket && socket.connected) {
    return socket;
  }

  const token =
    CookieHelper.get({ key: "token" }) ||
    CookieHelper.get({ key: "accessToken" }) ||
    "";

  if (!token) {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    return null;
  }

  const serverUrl = AppConfig().app.url;

  if (!socket) {
    socket = io(serverUrl, {
      path: "/socket.io",
      auth: { token },
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on("connect_error", (err) => {
      console.warn("Realtime socket connection error:", err.message);
    });
  } else if (!socket.connected) {
    socket.auth = { token };
    socket.connect();
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    try {
      socket.disconnect();
    } catch {
      // Ignore disconnect errors
    }
    socket = null;
  }
}

