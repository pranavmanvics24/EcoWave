import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "@/lib/api";
import ContactSellerDialog from "@/components/ContactSellerDialog";
import { Loader2, ArrowLeft, Leaf, Droplets, Trash2, Truck, CheckCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
    const [isMarkSoldOpen, setIsMarkSoldOpen] = useState(false);
    const [buyerEmail, setBuyerEmail] = useState("");
    const user = useAuthStore((state) => state.user);
    const queryClient = useQueryClient();

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productApi.getById(id!),
        enabled: !!id,
    });

    const markSoldMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Not authenticated");
            await productApi.markSold(id!, buyerEmail, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product', id] });
            setIsMarkSoldOpen(false);
            toast.success("Product marked as sold!");
        },
        onError: (err) => {
            toast.error(err.message);
        }
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

    const isOwner = user?.email === product.seller_email;
    // Default impact if not present (backward compatibility)
    const impact = product.eco_impact || { co2: 10, water: 50, waste: 1 };

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

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        {product.title}
                                    </CardTitle>
                                    {product.status === 'sold' && (
                                        <Badge variant="destructive" className="mt-2">SOLD</Badge>
                                    )}
                                </div>
                                <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20">
                                    {product.badge}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex justify-center bg-muted/20 rounded-lg p-2">
                                <img
                                    src={product.image || "/placeholder.jpg"}
                                    alt={product.title}
                                    className="rounded-lg shadow-md max-w-full max-h-[400px] object-contain"
                                />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">Description</h3>
                                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                            </div>

                            {product.material && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Material</h3>
                                    <p className="text-muted-foreground capitalize">{product.material}</p>
                                </div>
                            )}

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
                        </CardContent>
                    </Card>

                    {/* Eco Impact Scorecard */}
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-emerald-800">
                                <Leaf className="h-5 w-5" />
                                Environmental Impact Scorecard
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="p-4 bg-white/50 rounded-lg">
                                    <div className="flex justify-center mb-2"><Leaf className="h-6 w-6 text-green-600" /></div>
                                    <p className="text-2xl font-bold text-green-700">{impact.co2}kg</p>
                                    <p className="text-xs text-muted-foreground">CO2 Saved</p>
                                </div>
                                <div className="p-4 bg-white/50 rounded-lg">
                                    <div className="flex justify-center mb-2"><Droplets className="h-6 w-6 text-blue-500" /></div>
                                    <p className="text-2xl font-bold text-blue-700">{impact.water}L</p>
                                    <p className="text-xs text-muted-foreground">Water Saved</p>
                                </div>
                                <div className="p-4 bg-white/50 rounded-lg">
                                    <div className="flex justify-center mb-2"><Trash2 className="h-6 w-6 text-amber-600" /></div>
                                    <p className="text-2xl font-bold text-amber-700">{impact.waste}kg</p>
                                    <p className="text-xs text-muted-foreground">Waste Diverted</p>
                                </div>
                            </div>
                            <p className="text-xs text-center mt-4 text-emerald-600">
                                vs. buying a new {product.category || "item"}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            {isOwner ? (
                                product.status !== 'sold' ? (
                                    <Dialog open={isMarkSoldOpen} onOpenChange={setIsMarkSoldOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="w-full bg-green-600 hover:bg-green-700">
                                                <CheckCheck className="mr-2 h-4 w-4" />
                                                Mark as Sold
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Mark Item as Sold</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <p className="text-sm text-muted-foreground">
                                                    Who bought this item? Enter their email to credit them with the eco-impact.
                                                </p>
                                                <div className="space-y-2">
                                                    <Label>Buyer Email (Optional)</Label>
                                                    <Input
                                                        placeholder="buyer@example.com"
                                                        value={buyerEmail}
                                                        onChange={(e) => setBuyerEmail(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setIsMarkSoldOpen(false)}>Cancel</Button>
                                                <Button onClick={() => markSoldMutation.mutate()} disabled={markSoldMutation.isPending}>
                                                    {markSoldMutation.isPending ? "Updating..." : "Confirm Sold"}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                ) : (
                                    <Button className="w-full" disabled variant="secondary">Item Sold</Button>
                                )
                            ) : (
                                <Button
                                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                                    onClick={() => setIsContactDialogOpen(true)}
                                    disabled={!product.seller_email || product.status === 'sold'}
                                >
                                    {product.status === 'sold' ? "Sold Out" : "Contact Seller"}
                                </Button>
                            )}

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => navigate("/home")}
                            >
                                Browse More
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Shipping Footprint */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Truck className="h-4 w-4" /> Shipping Footprint
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">
                                Estimate shipping emissions:
                            </p>
                            <div className="bg-muted p-3 rounded text-sm">
                                <div className="flex justify-between mb-1">
                                    <span>Local Pickup</span>
                                    <span className="font-bold text-green-600">~0kg CO2</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Standard Shipping</span>
                                    <span className="font-bold text-amber-600">~0.5kg CO2</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

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
