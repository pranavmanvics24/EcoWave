import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function CartDrawer() {
    const { items, removeItem, updateQuantity, total, count, clearCart } = useCartStore();
    const cartCount = count();

    const handleCheckout = () => {
        toast.success("Checkout feature coming soon!");
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-muted">
                    <ShoppingCart className="h-5 w-5 text-foreground" />
                    {cartCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                            {cartCount}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Shopping Cart</SheetTitle>
                    <SheetDescription>
                        You have {cartCount} items in your cart
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="flex-1 my-4 pr-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                            <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
                            <p>Your cart is empty</p>
                            <Button variant="link" className="mt-2" asChild>
                                <SheetTrigger>Continue Shopping</SheetTrigger>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-3 bg-muted/50 rounded-lg">
                                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-background">
                                        <img
                                            src={item.image || "/placeholder.jpg"}
                                            alt={item.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1 justify-between">
                                        <div className="flex justify-between gap-2">
                                            <h3 className="font-medium text-sm line-clamp-2">{item.title}</h3>
                                            <p className="font-bold text-sm">₹{item.price * item.quantity}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="text-sm w-4 text-center">{item.quantity}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {items.length > 0 && (
                    <SheetFooter className="flex-col gap-4 sm:flex-col border-t pt-4">
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total</span>
                            <span>₹{total()}</span>
                        </div>
                        <div className="flex gap-2 w-full">
                            <Button variant="outline" className="flex-1" onClick={clearCart}>
                                Clear Cart
                            </Button>
                            <Button className="flex-1 bg-gradient-to-r from-primary to-secondary" onClick={handleCheckout}>
                                Checkout
                            </Button>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}
