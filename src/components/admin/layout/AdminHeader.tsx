"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { User, LogOut, Bell, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { TabHeaderName } from "@/constants/path";
import { authService } from "@/services/authService";
import { AuthMessage } from "@/constants/messages/authMessage";
import { toast } from "sonner";
import { useAppRouter } from "@/hooks/useAppRouter";
import { useEffect } from "react";
import { socket } from "@/lib/socket";

export default function AdminHeader() {
  const { authUser, logOutAction } = useAuthStore();
  const { goLogin } = useAppRouter();
  const router = useRouter();
  const pathName = usePathname();
  const tabHeaderName = TabHeaderName[pathName];

  const {
    notifications,
    unreadCount,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    deleteNotification,
    addNotification,
  } = useNotificationStore();

  useEffect(() => {
    if (authUser?.userId) {
      fetchNotifications(1, 20);
      fetchUnreadCount();
    }
  }, [authUser?.userId, fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    const registerAdmin = () => {
      if (authUser?.userId) {
        socket.emit('registerAdmin', { userId: authUser.userId });
      }
    };

    if (socket.connected) {
      registerAdmin();
    } else {
      socket.on('connect', registerAdmin);
    }

    const handleReportNotification = (data: any) => {
      addNotification({
        notificationId: data.notificationId,
        type: 'report',
        message: `${data.reporter.fullName} đã báo cáo bình luận`,
        isRead: false,
        createdAt: data.createdAt,
        result: {
          commentId: data.comment.commentId,
          reporterId: data.reporter.userId,
          reporterName: data.reporter.fullName,
          reporterAvatar: data.reporter.avatarUrl,
          commentContent: data.comment.content,
          commentUserId: data.comment.user.userId,
          commentUserName: data.comment.user.fullName,
          filmId: data.film?.filmId,
          filmTitle: data.film?.title,
          filmSlug: data.film?.slug,
          reason: data.reason,
          description: data.description,
        },
      } as any);

      fetchUnreadCount();

      toast.info(`Báo cáo mới từ ${data.reporter.fullName}`, {
        id: `report-${data.notificationId}`,
        description: <span className="text-red-500">Lý do: {data.reason}</span>,
      });
    };

    socket.on('reportNotification', handleReportNotification);

    return () => {
      socket.off('connect', registerAdmin);
      socket.off('reportNotification', handleReportNotification);
    };
  }, [authUser?.userId, addNotification, fetchUnreadCount]);

  const haneleLogOut = async () => {
    try {
      const res = await authService.callLogout();

      if (res && res.EC === 1) {
        goLogin();
        toast.success(AuthMessage.logoutSucess);
        logOutAction();
      }
    } catch (error) {
      toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <>
      <header className="flex items-center sticky top-0 z-10 gap-4 border-b bg-white px-6 py-4">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold flex-1 ">{tabHeaderName}</h1>

        {/* Notification Bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-96 max-h-[500px] overflow-y-auto">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Thông báo báo cáo</span>
              {unreadCount > 0 && (
                <span className="text-xs text-gray-500">
                  {unreadCount} chưa đọc
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Không có thông báo mới
              </div>
            ) : (
              <div className="space-y-2 p-2">
                {notifications.slice(0, 10).map((notif) => (
                  <div
                    key={notif.notificationId}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${notif.isRead ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                      } hover:bg-gray-100`}
                    onClick={async () => {
                      if (!notif.isRead) {
                        await markAsRead(notif.notificationId);
                        fetchUnreadCount();
                      }

                      if (notif.type === 'report') {
                        router.push('/admin/comments?tab=reports');
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {!notif.isRead && (
                        <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">
                          {notif.message}
                        </p>
                        {notif.result?.reason && (
                          <p className="text-xs text-red-600 mt-1">
                            Lý do: {notif.result.reason}
                          </p>
                        )}
                        {notif.result?.description && (
                          <p className="text-xs text-orange-600 mt-1 italic">
                            Mô tả: {notif.result.description}
                          </p>
                        )}
                        {notif.result?.commentContent && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            Nội dung: "{notif.result.commentContent}"
                          </p>
                        )}
                        {notif.result?.filmTitle && (
                          <p className="text-xs text-gray-400 mt-1">
                            Phim: {notif.result.filmTitle}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notif.createdAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.notificationId);
                        }}
                        className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md border bg-gray-100 hover:bg-gray-200 cursor-pointer">
              <User className="w-4 h-4 text-gray-700" />
              <span className="text-sm font-medium">{authUser.fullName ?? "Tài khoản"}</span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48 mr-2">
            <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                haneleLogOut();
              }}
              className="cursor-pointer text-red-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>{" "}
      </header>
    </>
  );
}
