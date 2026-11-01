export const LogAction = Object.assign(
    ["CREATE_DECK", "UPDATE_DECK", "DELETE_DECK", "LOGIN", "LOGOUT", "BAN_USER", "UNBAN_USER", "CHANGE_ROLE", "SET_VERSION", "SYNC_CARD_STATUS", "SEND_MAIL", "RECALL_MAIL", "DELETE_MAIL"] as const,
    {
        CREATE_DECK: "CREATE_DECK",
        UPDATE_DECK: "UPDATE_DECK",
        DELETE_DECK: "DELETE_DECK",
        LOGIN: "LOGIN",
        LOGOUT: "LOGOUT",
        BAN_USER: "BAN_USER",
        UNBAN_USER: "UNBAN_USER",
        CHANGE_ROLE: "CHANGE_ROLE",
        SET_VERSION: "SET_VERSION",
        SYNC_CARD_STATUS: "SYNC_CARD_STATUS",
        SEND_MAIL: "SEND_MAIL",
        RECALL_MAIL: "RECALL_MAIL",
        DELETE_MAIL: "DELETE_MAIL",
    }
);

export type LogAction = (typeof LogAction)[keyof typeof LogAction];

export const TargetType = Object.assign(
    ["DECK", "USER", "CARD", "SYSTEM", "MAIL"] as const,
    {
        DECK: "DECK",
        USER: "USER",
        CARD: "CARD",
        SYSTEM: "SYSTEM",
        MAIL: "MAIL",
    }
);
export type TargetType = (typeof TargetType)[keyof typeof TargetType];