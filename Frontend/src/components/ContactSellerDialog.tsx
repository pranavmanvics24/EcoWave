import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { inquiriesApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import { useAuthStore } from "@/lib/store";

interface ContactSellerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: {
        id: string;
        title: string;
        seller_email?: string;
    };
}

export default function ContactSellerDialog({ open, onOpenChange, product }: ContactSellerDialogProps) {
    const user = useAuthStore((state) => state.user);
    const [buyerName, setBuyerName] = useState(user?.name || "");
    const [buyerEmail, setBuyerEmail] = useState(user?.email || "");
    const [message, setMessage] = useState("");

    const inquiryMutation = useMutation({
        mutationFn: inquiriesApi.create,
        onSuccess: (data) => {
            toast.success("Message sent successfully!", {
                description: data.email_sent
                    ? "The seller has been notified via email."
                    : "Your inquiry was saved, but email notification failed."
            });
            onOpenChange(false);
            // Reset form
            setMessage("");
        },
        onError: (error: Error) => {
            toast.error("Failed to send message", {
                description: error.message
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!product.seller_email) {
            toast.error("Contact information not available for this seller");
            return;
        }

        inquiryMutation.mutate({
            product_id: product.id,
            buyer_name: buyerName,
            buyer_email: buyerEmail,
            buyer_message: message,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        Contact Seller
                    </DialogTitle>
                    <DialogDescription>
                        Send a message to the seller about: <strong>{product.title}</strong>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="buyer-name">Your Name *</Label>
                        <Input
                            id="buyer-name"
                            value={buyerName}
                            onChange={(e) => setBuyerName(e.target.value)}
                            placeholder="Enter your name"
                            required
                            disabled={inquiryMutation.isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="buyer-email">Your Email *</Label>
                        <Input
                            id="buyer-email"
                            type="email"
                            value={buyerEmail}
                            onChange={(e) => setBuyerEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            required
                            disabled={inquiryMutation.isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="I'm interested in buying this item. Is it still available?"
                            rows={5}
                            required
                            disabled={inquiryMutation.isPending}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                            disabled={inquiryMutation.isPending}
                        >
                            {inquiryMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Message
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={inquiryMutation.isPending}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
