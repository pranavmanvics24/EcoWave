import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi, Product } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EditListingDialogProps {
    product: Product;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sellerEmail: string;
}

export default function EditListingDialog({ product, open, onOpenChange, sellerEmail }: EditListingDialogProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        category: product.category || "",
        condition: product.badge === "New" ? "new" : "used",
        location: product.seller_location || "",
    });

    useEffect(() => {
        setFormData({
            title: product.title,
            description: product.description,
            price: product.price.toString(),
            category: product.category || "",
            condition: product.badge === "New" ? "new" : "used",
            location: product.seller_location || "",
        });
    }, [product]);

    const updateMutation = useMutation({
        mutationFn: (data: Partial<Product>) => productApi.update(product.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seller-listings', sellerEmail] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product', product.id] });
            toast.success("Listing updated successfully!");
            onOpenChange(false);
        },
        onError: (error: Error) => {
            toast.error("Failed to update listing", {
                description: error.message
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        updateMutation.mutate({
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            badge: formData.condition === "new" ? "New" : "Used",
            category: formData.category,
            seller_location: formData.location,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Listing</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-title">Product Name</Label>
                        <Input
                            id="edit-title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            disabled={updateMutation.isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                            id="edit-description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            disabled={updateMutation.isPending}
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-category">Category</Label>
                        <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                            disabled={updateMutation.isPending}
                        >
                            <SelectTrigger id="edit-category">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="electronics">Electronics</SelectItem>
                                <SelectItem value="clothing">Clothing</SelectItem>
                                <SelectItem value="books">Books</SelectItem>
                                <SelectItem value="home">Home</SelectItem>
                                <SelectItem value="accessories">Accessories</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-price">Price (₹)</Label>
                        <Input
                            id="edit-price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                            disabled={updateMutation.isPending}
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Condition</Label>
                        <RadioGroup
                            value={formData.condition}
                            onValueChange={(value) => setFormData({ ...formData, condition: value })}
                            disabled={updateMutation.isPending}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="new" id="edit-new" />
                                    <Label htmlFor="edit-new">New</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="used" id="edit-used" />
                                    <Label htmlFor="edit-used">Used</Label>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-location">Location</Label>
                        <Input
                            id="edit-location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="Enter your city"
                            disabled={updateMutation.isPending}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                            disabled={updateMutation.isPending}
                        >
                            {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={updateMutation.isPending}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
