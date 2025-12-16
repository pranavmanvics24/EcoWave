import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, ShoppingBag, Leaf, Award } from "lucide-react";

const Profile = () => {
    // Mock user data - replace with actual user data from backend
    const userData = {
        name: "EcoWave User",
        email: "user@ecowave.com",
        joinDate: "January 2024",
        itemsPurchased: 12,
        itemsSold: 5,
        co2Saved: 450,
        badges: ["Early Adopter", "Eco Warrior", "Top Seller"]
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation onSearch={(query) => console.log(query)} />

            <main className="flex-1 bg-gradient-to-br from-accent via-background to-muted py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2">My Profile</h1>
                        <p className="text-muted-foreground">Manage your EcoWave account and track your impact</p>
                    </div>

                    <div className="grid gap-6">
                        {/* User Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                                            {userData.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-lg">{userData.name}</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Mail className="h-4 w-4" />
                                                {userData.email}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline">Edit Profile</Button>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                                    <Calendar className="h-4 w-4" />
                                    <span>Member since {userData.joinDate}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity Stats */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <ShoppingBag className="h-8 w-8 text-primary mx-auto mb-2" />
                                        <p className="text-3xl font-bold text-primary">{userData.itemsPurchased}</p>
                                        <p className="text-sm text-muted-foreground">Items Purchased</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <ShoppingBag className="h-8 w-8 text-secondary mx-auto mb-2" />
                                        <p className="text-3xl font-bold text-secondary">{userData.itemsSold}</p>
                                        <p className="text-sm text-muted-foreground">Items Sold</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <Leaf className="h-8 w-8 text-primary mx-auto mb-2" />
                                        <p className="text-3xl font-bold text-primary">{userData.co2Saved} kg</p>
                                        <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Badges */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5 text-secondary" />
                                    Achievements
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {userData.badges.map((badge, index) => (
                                        <Badge
                                            key={index}
                                            className="bg-secondary/10 text-secondary hover:bg-secondary/20 text-sm px-3 py-1"
                                        >
                                            {badge}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start">
                                        View Purchase History
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        My Listings
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        Settings
                                    </Button>
                                    <Button variant="destructive" className="w-full justify-start">
                                        Logout
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Profile;
