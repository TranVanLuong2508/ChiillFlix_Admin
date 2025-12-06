export const appPath = {
  HOME: "/",
  ADMIN: "/admin",
  LOGIN: "/auth/login",
};

export const adminPath = {
  DASHBOARD: "/admin",
  ROLES: "/admin/roles",
  USERS: "/admin/users",
  PERMISSIONS: "/admin/permissions",
  MOVIES: "/admin/movies",
  VIP_PLANS: "/admin/plans",
  DIRECTORS: "/admin/directors",
  ACTORS: "/admin/actors",
  PRODUCERS: "/admin/producers",
  PAYMENTS: "/admin/payments",
  COMMENTS: "/admin/comments",
  RATINGS: "/admin/ratings",
};

export const TabHeaderName: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/users": "Quản Lý Người Dùng",
  "/admin/movies": "Quản Lý Phim",
  "/admin/permissions": "Quản Lý Quyền Hạn",
  "/admin/roles": "Quản Lý Vai Trò",
  "/admin/plans": "Quản lý gói VIP",
  "/admin/directors": "Quản Lý Đạo Diễn",
  "/admin/actors": "Quản Lý Diễn Viên",
  "/admin/producers": "Quản Lý Nhà Sản Xuất",
  "/admin/payments": "Quản Lý Thanh toán",
  "/admin/comments": "Quản Lý Bình Luận",
  "/admin/ratings": "Quản Lý Đánh Giá",
};
