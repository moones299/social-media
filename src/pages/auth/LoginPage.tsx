import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    clearError();
    try {
      await login(email, password);
      navigate("/home");
    } catch {
      // error is set in context
    }
  };

  return (
    <AuthLayout rightImage="/images/login.png">
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-sm text-gray-600 mt-1">
            Login to your Socially account
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <Input
            label="Password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <Button onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-sm text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link to="/sign-up" className="text-blue-600 underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
