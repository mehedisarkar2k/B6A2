export interface User {
    id: number;
    firstName: string;
    lastName?: string;
    role: string;
    email: string;
    username?: string;
    password: string;
    age?: number;
    phone?: string;
    address?: string;
    created_at: Date;
    updated_at: Date;
}
