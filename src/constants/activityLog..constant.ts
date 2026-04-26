export const LOG_ACTIONS = [
    "CREATE_DECK",
    "UPDATE_DECK",
    "DELETE_DECK",
    "LOGIN",
    "LOGOUT",
    "BAN_USER",
    "UNBAN_USER",
    "CHANGE_ROLE",
    "SET_VERSION"
] as const;

export type LogAction = (typeof LOG_ACTIONS)[number];

export const TARGET_TYPES = ["DECK", "USER", "CARD", "SYSTEM"] as const;
export type TargetType = (typeof TARGET_TYPES)[number];