import { Variant } from "./variant.model";

export interface CartItem {
    variant: Variant;
    quantity: number;
}