export const ALL_MODULES = {
  USERS: "USERS",
  AUTH: "AUTH",
  FILMS: "FILMS",
  PERMISSIONS: "PERMISSIONS",
  ROLES: "ROLES",
};

export const ALL_PERMISSIONS = {
  FILMS: {
    GET_All: { method: "GET", apiPath: "/api/v1/films", module: "FILMS" },
  },
  DIRECTORS: {
    GET_All: { method: "GET", apiPath: "/api/v1/director/get-all-directors", module: "DIRECTORS" },
  },
  ACTORS: {
    GET_All: { method: "GET", apiPath: "/api/v1/actor/all-actors", module: "ACTORS" },
  },
  PRODUCERS: {
    GET_All: { method: "GET", apiPath: "/api/v1/producer/get-all-producers", module: "PRODUCERS" },
  },

  PAYMENTS: {
    GET_All: { method: "GET", apiPath: "/api/v1/payments", module: "PAYMENTS" },
  },
  USERS: {
    GET_All: { method: "GET", apiPath: "/api/v1/users", module: "USERS" },
  },
  PERMISSIONS: {
    GET_All: { method: "GET", apiPath: "/api/v1/permissions", module: "PERMISSIONS" },
  },
  ROLES: {
    GET_All: { method: "GET", apiPath: "/api/v1/roles", module: "ROLES" },
  },
};
