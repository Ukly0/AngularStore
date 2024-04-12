import { Cart } from "./cart.model";
import { Variant } from "./variant.model";

export interface Order {
    cart: Cart;
    email: string;
    shipping: string;
    status: string;
    orderNumber: string;
}