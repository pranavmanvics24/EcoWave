import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi, Product } from "@/lib/api";
import { Pencil, Trash2, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EditListingDialog from "./EditListingDialog";

interface MyListingsProps {
    sellerEmail: string;
}

export default function MyListings({ sellerEmail }: MyListingsProps) {
    const queryClient = useQueryClient();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editProduct, setEditProduct] = useState<Product | null>(null);

    const { data: listings = [], isLoading } = useQuery({
        queryKey: ['seller-listings', sellerEmail],
        queryFn: () => productApi.getBySellerEmail(sellerEmail),
        enabled: !!sellerEmail,
    });

    const deleteMutation = useMutation({
        mutationFn: productApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seller-listings', sellerEmail] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success("Listing deleted successfully");
            setDeleteId(null);
        },
        onError: (error: Error) => {
            toast.error("Failed to delete listing", {
                description: error.message
            });
        },
    });

    if (!sellerEmail) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Please add your email to create listings
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (listings.length === 0) {
        return (
            <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-xl font-semibold mb-2">No listings yet</p>
                <p className="text-muted-foreground">Start selling by creating your first listing!</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {listings.map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-square overflow-hidden bg-muted">
                            <img
                                src={product.image || "/placeholder.jpg"}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <CardContent className="p-4 space-y-3">
                            <div className="space-y-1">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-semibold line-clamp-1">{product.title}</h3>
                                    <Badge variant="secondary" className="shrink-0">
                                        {product.badge}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {product.description}
                                </p>
                                <p className="text-xl font-bold text-primary">₹{product.price}</p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => setEditProduct(product)}
                                >
                                    <Pencil className="h-4 w-4 mr-1" />
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => setDeleteId(product.id)}
                                >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this listing? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteId && deleteMutation.mutate(deleteId)}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Listing Dialog */}
            {editProduct && (
                <EditListingDialog
                    product={editProduct}
                    open={!!editProduct}
                    onOpenChange={(open) => !open && setEditProduct(null)}
                    sellerEmail={sellerEmail}
                />
            )}
        </>
    );
}
