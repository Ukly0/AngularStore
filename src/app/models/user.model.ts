
export interface User {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    cartId?: string;
}