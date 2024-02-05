export interface Product {
    key?: string;
    title: string;
    price: number;
    offerPrice?: number;
    category: string;
    themes: string[];
    sizes: string[];
    colors: string[];
    description: string;
    images: string[]; // Aquí se almacenarán las URLs de las imágenes
  
  }