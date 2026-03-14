
export interface requestRegister {
    username: string;
    password: string;
    fullName: string;
}

export interface requestLogin {
    username: string;
    password: string;
}

export interface requestProfile {
    _id?: string | undefined
}

