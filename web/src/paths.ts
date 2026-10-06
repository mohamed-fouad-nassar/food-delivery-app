export const PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    RESET_PASSWORD: "/auth/reset-password",
    FORGET_PASSWORD: "/auth/forget-password",
    USER_ACTIVATION: "/auth/user-activation",
  },

  APP: {
    HOME: "/app",
    RESTAURANTS: "/app/restaurants",
    RESTAURANT_DETAILS: (id: string) => `/app/restaurants/${id}`,
    CUISINES: "/app/cuisines",
    CONTACT: "/app/contact",
    PROFILE: "/app/profile",
    ORDERS: "/app/orders",
    ORDER_DETAILS: (id: string) => `/app/orders/${id}`,
    SETTINGS: "/app/settings",
  },

  DELIVERY: {
    HOME: "/delivery",
  },

  RESTAURANT: {
    HOME: "/restaurant",
  },
};
