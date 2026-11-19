"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getSocket } from "@/lib/socket";
import {
  NotificationItem,
  NotificationService,
} from "@/service/notification/notification.service";
import { toast } from "react-toastify";

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const hasLoadedInitial = useRef(false);

  const fetchInitial = useCallback(async () => {
    try {
      const res = await NotificationService.getNotifications(1, 20);
      if (res) {
        setNotifications(res.items || []);
        setUnreadCount(typeof res.unreadCount === "number" ? res.unreadCount : 0);
      }
    } catch (err) {
      console.warn("Failed to fetch initial notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedInitial.current) {
      hasLoadedInitial.current = true;
      fetchInitial();
    }

    const socket = getSocket();
    if (!socket) return;

    const handleNewNotification = (data: NotificationItem) => {
      setNotifications((prev) => [data, ...prev.filter((n) => n.id !== data.id)]);
      setUnreadCount((prev) => prev + 1);
      toast.info(data.title || "New notification", {
        position: "top-right",
        autoClose: 4000,
      });
    };

    const handleCountUpdate = (data: { count: number }) => {
      if (data && typeof data.count === "number") {
        setUnreadCount(data.count);
      }
    };

    socket.on("notification:new", handleNewNotification);
    socket.on("notification:count", handleCountUpdate);

    return () => {
      socket.off("notification:new", handleNewNotification);
      socket.off("notification:count", handleCountUpdate);
    };
  }, [fetchInitial]);

  const markAsRead = async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.warn("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.warn("Failed to mark all as read:", err);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: fetchInitial,
  };
}

