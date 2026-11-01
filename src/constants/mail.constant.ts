export const MailStatus = Object.assign(
    ["UNREAD", "READ", "CLAIMED"] as const,
    {
        UNREAD: "UNREAD",
        READ: "READ",
        CLAIMED: "CLAIMED",
    }
);

export type MailStatus = (typeof MailStatus)[number];

export const MailRewardType = Object.assign(
    ["CARD", "RUBY"] as const,
    {
        CARD: "CARD",
        RUBY: "RUBY",
    } as const
);
export type MailRewardType = (typeof MailRewardType)[number];
