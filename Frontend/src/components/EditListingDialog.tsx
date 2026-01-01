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
    const [imagePreview, setImagePreview] = useState<string>(product.image || "");
    const [newImageBase64, setNewImageBase64] = useState<string>("");

    useEffect(() => {
        setFormData({
            title: product.title,
            description: product.description,
            price: product.price.toString(),
            category: product.category || "",
            condition: product.badge === "New" ? "new" : "used",
            location: product.seller_location || "",
        });
        setImagePreview(product.image || "");
        setNewImageBase64("");
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("Please select a valid image file");
            e.target.value = "";
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            e.target.value = "";
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setImagePreview(result);
            setNewImageBase64(result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const updateData: Partial<Product> = {
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            badge: formData.condition === "new" ? "New" : "Used",
            category: formData.category,
            seller_location: formData.location,
        };

        // Only update image if a new one was selected
        if (newImageBase64) {
            updateData.image = newImageBase64;
        }

        updateMutation.mutate(updateData);
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
                        <Label htmlFor="edit-image">Product Image</Label>
                        {imagePreview && (
                            <div className="mt-2 relative w-full h-48 border rounded-lg overflow-hidden bg-muted">
                                <img
                                    src={imagePreview}
                                    alt="Product preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Button asChild variant="outline" type="button" disabled={updateMutation.isPending}>
                                <label htmlFor="edit-image" className="cursor-pointer">
                                    Change Image
                                </label>
                            </Button>
                            <Input
                                name="image"
                                id="edit-image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={updateMutation.isPending}
                                onChange={handleImageChange}
                            />
                            {newImageBase64 && (
                                <span className="text-sm text-muted-foreground">New image selected ✓</span>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">Leave unchanged to keep current image. Max size: 5MB</p>
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
