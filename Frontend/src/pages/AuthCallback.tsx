import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            try {
                // Decode the token to get user info
                // We expect the backend to sign a JWT with email and name
                const decoded: any = jwtDecode(token);

                login({
                    name: decoded.name || decoded.sub || "User",
                    email: decoded.email || "user@example.com"
                });

                localStorage.setItem("token", token);

                toast.success("Successfully logged in with Google!");
                navigate("/");
            } catch (error) {
                console.error("Token decode error:", error);
                toast.error("Failed to process login token");
                navigate("/login");
            }
        } else {
            toast.error("No token received");
            navigate("/login");
        }
    }, [searchParams, navigate, login]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );
};

export default AuthCallback;
