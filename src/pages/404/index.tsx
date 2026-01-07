
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-4">
      <h1 className="text-8xl font-serif font-bold text-green-700">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-green-800">
        Page Not Found
      </h2>
      <p className="mt-2 text-green-600">
        The page you are looking for does not seem to exist.
      </p>
      <Link to="/" className="mt-6">
        <Button className="bg-green-700 hover:bg-green-800">
          Go to Homepage
        </Button>
      </Link>
    </div>
  );
}
