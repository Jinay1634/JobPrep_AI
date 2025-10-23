
export interface User {
    id: string
    name: string
    email: string
    password: string
    created_at: Date
    Role: Role[]
    Session: Session[]
}

export interface Role {
    id: string
    userid: string
    position: string
    description: string
    created_at: Date
    Session: Session[]
}

export interface Session {
    id: string
    result: boolean
    roleid: string
}

export interface AuthResponse {
    token: string;
    data: User
}

export interface AuthState {
    token: string | null;
    user: User | null;
    loading:boolean|null
}