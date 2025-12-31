const API_BASE_URL = "http://localhost:5001/api";

export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    badge: string;
    image: string;
    category?: string;
    seller_id?: string;
    seller_email?: string;
    seller_location?: string;
    seller_phone?: string;
    created_at?: string;
}

export interface Inquiry {
    inquiry_id: string;
    product_id: string;
    product_title: string;
    buyer_name: string;
    buyer_email: string;
    buyer_message: string;
    seller_email: string;
    status: string;
    created_at: string;
}

export const productApi = {
    // Fetch all products
    getAll: async (filters?: { category?: string; search?: string }): Promise<Product[]> => {
        const params = new URLSearchParams();
        if (filters?.category && filters.category !== "all") params.append("category", filters.category);
        if (filters?.search) params.append("search", filters.search);

        const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        return data.products;
    },

    // Fetch single product
    getById: async (id: string): Promise<Product> => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        return data.product;
    },

    // Create new product
    create: async (product: Omit<Product, "id">): Promise<Product> => {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
        });
        if (!response.ok) throw new Error("Failed to create product");
        const data = await response.json();
        return data.product;
    },
};

export const inquiriesApi = {
    // Submit inquiry to seller
    create: async (inquiry: {
        product_id: string;
        buyer_name: string;
        buyer_email: string;
        buyer_message: string;
    }): Promise<{ inquiry: Inquiry; email_sent: boolean }> => {
        const response = await fetch(`${API_BASE_URL}/inquiries`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(inquiry),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to submit inquiry");
        }
        const data = await response.json();
        return { inquiry: data.inquiry, email_sent: data.email_sent };
    },
};

