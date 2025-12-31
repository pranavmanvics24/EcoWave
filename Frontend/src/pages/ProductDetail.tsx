import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/lib/api";
import ContactSellerDialog from "@/components/ContactSellerDialog";
import { Loader2, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productApi.getById(id!),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-xl text-red-500">Product not found</p>
                <Button onClick={() => navigate("/home")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Button
                variant="ghost"
                onClick={() => navigate("/home")}
                className="mb-4"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
            </Button>

            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {product.title}
                        </CardTitle>
                        <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20">
                            {product.badge}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex justify-center">
                        <img
                            src={product.image || "/placeholder.jpg"}
                            alt={product.title}
                            className="rounded-lg shadow-md max-w-full h-auto"
                        />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Price</h3>
                        <p className="text-3xl font-bold text-primary">₹{product.price}</p>
                    </div>

                    {product.seller_location && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Location</h3>
                            <p className="text-muted-foreground">{product.seller_location}</p>
                        </div>
                    )}

                    {product.category && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Category</h3>
                            <Badge variant="outline" className="text-sm">
                                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                            </Badge>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <Button
                            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                            onClick={() => setIsContactDialogOpen(true)}
                            disabled={!product.seller_email}
                        >
                            Contact Seller
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate("/home")}
                        >
                            Browse More
                        </Button>
                    </div>

                    {!product.seller_email && (
                        <p className="text-sm text-amber-600 text-center">
                            Contact information not available for this listing
                        </p>
                    )}
                </CardContent>
            </Card>

            {product && (
                <ContactSellerDialog
                    open={isContactDialogOpen}
                    onOpenChange={setIsContactDialogOpen}
                    product={product}
                />
            )}
        </div>
    );
}
