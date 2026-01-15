import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function SellItemPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [category, setCategory] = useState("");
    const [condition, setCondition] = useState("");
    const [material, setMaterial] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [imageBase64, setImageBase64] = useState<string>("");

    const createProductMutation = useMutation({
        mutationFn: productApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success("Product listed successfully!");
            navigate("/home");
        },
        onError: (error) => {
            toast.error(`Failed to list product: ${error.message}`);
            setIsLoading(false);
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setImagePreview("");
            setImageBase64("");
            return;
        }

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
            setImageBase64(result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!imageBase64) {
            toast.error("Please select an image for your product");
            return;
        }

        setIsLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);

        try {
            await createProductMutation.mutateAsync({
                title: formData.get("productName") as string,
                description: formData.get("description") as string,
                price: parseFloat(formData.get("price") as string),
                badge: condition === "new" ? "New" : "Used",
                image: imageBase64,
                category: category,
                material: material,
                seller_email: formData.get("contact") as string,
                seller_location: formData.get("location") as string,
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent via-background to-muted p-4">
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Sell an Item
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <Label htmlFor="productName">Product Name</Label>
                                <Input name="productName" id="productName" placeholder="Enter product name" required disabled={isLoading} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea name="description" id="description" placeholder="Describe your product" required disabled={isLoading} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select onValueChange={setCategory} value={category} disabled={isLoading}>
                                    <SelectTrigger id="category">
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
                                <Label htmlFor="material">Material</Label>
                                <Select onValueChange={setMaterial} value={material} disabled={isLoading}>
                                    <SelectTrigger id="material">
                                        <SelectValue placeholder="Select primary material" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cotton">Cotton</SelectItem>
                                        <SelectItem value="polyester">Polyester/Synthetic</SelectItem>
                                        <SelectItem value="wood">Wood</SelectItem>
                                        <SelectItem value="metal">Metal</SelectItem>
                                        <SelectItem value="plastic">Plastic</SelectItem>
                                        <SelectItem value="glass">Glass</SelectItem>
                                        <SelectItem value="other">Other/Mixed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Price</Label>
                                <Input name="price" id="price" type="number" placeholder="Enter price" required disabled={isLoading} />
                            </div>

                            <div className="space-y-2">
                                <Label>Condition</Label>
                                <RadioGroup onValueChange={setCondition} value={condition} disabled={isLoading}>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="new" id="new" />
                                            <Label htmlFor="new">New</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="like-new" id="like-new" />
                                            <Label htmlFor="like-new">Like New</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="good" id="good" />
                                            <Label htmlFor="good">Good</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="fair" id="fair" />
                                            <Label htmlFor="fair">Fair</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="poor" id="poor" />
                                            <Label htmlFor="poor">Poor</Label>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="images">Upload Image *</Label>
                                {imagePreview && (
                                    <div className="mt-2 relative w-full h-48 border rounded-lg overflow-hidden bg-muted">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Button asChild variant="outline" type="button" disabled={isLoading}>
                                        <label htmlFor="images" className="cursor-pointer">
                                            {imagePreview ? "Change Image" : "Choose Image"}
                                        </label>
                                    </Button>
                                    <Input
                                        name="images"
                                        id="images"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        disabled={isLoading}
                                        onChange={handleImageChange}
                                        required
                                    />
                                    {imagePreview && (
                                        <span className="text-sm text-muted-foreground">Image selected ✓</span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input name="location" id="location" placeholder="Enter your city" disabled={isLoading} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contact">Contact Info</Label>
                                <Input name="contact" id="contact" type="email" placeholder="Enter your email" required disabled={isLoading} />
                            </div>

                            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90" disabled={isLoading}>
                                {isLoading ? "Listing Item..." : "List Item"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
