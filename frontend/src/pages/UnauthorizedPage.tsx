import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Shield className="mx-auto h-24 w-24 text-red-500 mb-6" />
          <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page. Admin privileges are
            required.
          </p>
        </div>

        <Button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Go to Home
        </Button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
