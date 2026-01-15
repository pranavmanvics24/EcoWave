import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Package, LogOut } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { useNavigate } from "react-router-dom";
import MyListings from "@/components/MyListings";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/lib/api";
import { Leaf, Droplets, Trash2, Award } from "lucide-react";

const Profile = () => {
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const [showListings, setShowListings] = useState(false);

    const { data: impactStats } = useQuery({
        queryKey: ['impact-stats'],
        queryFn: () => {
            const token = localStorage.getItem("token");
            if (!token) return null;
            return userApi.getImpactStats(token);
        },
        enabled: isAuthenticated
    });

    const handleLogout = () => {
        logout();
        localStorage.removeItem("token");
        navigate("/");
    };

    // Redirect if not authenticated
    if (!isAuthenticated || !user) {
        navigate("/login");
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation onSearch={(query) => console.log(query)} />

            <main className="flex-1 bg-gradient-to-br from-accent via-background to-muted py-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2">My Profile</h1>
                        <p className="text-muted-foreground">Manage your EcoWave account and listings</p>
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
                                            {user.name?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-lg">{user.name || "EcoWave User"}</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Mail className="h-4 w-4" />
                                                {user.email || "user@ecowave.com"}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="destructive" onClick={handleLogout}>
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Impact Dashboard */}
                        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-emerald-800">
                                    <Leaf className="h-5 w-5" />
                                    My Eco Impact
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white/60 p-4 rounded-xl text-center">
                                        <div className="flex justify-center mb-2"><Leaf className="h-5 w-5 text-green-600" /></div>
                                        <p className="text-2xl font-bold text-green-700">{impactStats?.co2_saved || 0}kg</p>
                                        <p className="text-xs text-muted-foreground">CO2 Saved</p>
                                    </div>
                                    <div className="bg-white/60 p-4 rounded-xl text-center">
                                        <div className="flex justify-center mb-2"><Droplets className="h-5 w-5 text-blue-500" /></div>
                                        <p className="text-2xl font-bold text-blue-700">{impactStats?.water_saved || 0}L</p>
                                        <p className="text-xs text-muted-foreground">Water Saved</p>
                                    </div>
                                    <div className="bg-white/60 p-4 rounded-xl text-center">
                                        <div className="flex justify-center mb-2"><Trash2 className="h-5 w-5 text-amber-600" /></div>
                                        <p className="text-2xl font-bold text-amber-700">{impactStats?.waste_saved || 0}kg</p>
                                        <p className="text-xs text-muted-foreground">Waste Diverted</p>
                                    </div>
                                    <div className="bg-white/60 p-4 rounded-xl text-center">
                                        <div className="flex justify-center mb-2"><Award className="h-5 w-5 text-purple-600" /></div>
                                        <p className="text-lg font-semibold text-purple-700">Level {(Math.floor((impactStats?.co2_saved || 0) / 50) + 1)}</p>
                                        <p className="text-xs text-muted-foreground">Eco Warrior</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* My Listings Section */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5 text-secondary" />
                                        My Listings
                                    </CardTitle>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowListings(!showListings)}
                                    >
                                        {showListings ? "Hide" : "Show"} Listings
                                    </Button>
                                </div>
                            </CardHeader>
                            {showListings && (
                                <CardContent>
                                    <MyListings sellerEmail={user.email || ""} />
                                </CardContent>
                            )}
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => navigate("/sell")}
                                    >
                                        Create New Listing
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => navigate("/home")}
                                    >
                                        Browse Products
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
