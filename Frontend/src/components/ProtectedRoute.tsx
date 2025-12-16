import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const location = useLocation();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        toast.error("Please login to access this page");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
