export const ALL_MODULES = {
  USERS: "USERS",
  AUTH: "AUTH",
  FILMS: "FILMS",
  PERMISSIONS: "PERMISSIONS",
  ROLES: "ROLES",
};

export const ALL_PERMISSIONS = {
  USERS: {
    GET_PAGINATE: { method: "GET", apiPath: "/api/v1/users", module: "USERS" },
  },
  FILMS: {
    GET_PAGINATE: { method: "GET", apiPath: "/api/v1/users", module: "FILMS" },
  },
  ROLES: {
    GET_PAGINATE: { method: "GET", apiPath: "/api/v1/users", module: "ROLES" },
  },
  PERMISSIONS: {
    GET_PAGINATE: { method: "GET", apiPath: "/api/v1/users", module: "PERMISSIONS" },
  },
};
