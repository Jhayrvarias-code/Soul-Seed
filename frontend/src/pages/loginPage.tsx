import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GlobalStateContext } from "../context/GlobalStateProvider";
import { X } from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";

import { login } from "@/services/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setToken } = useContext(GlobalStateContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      const data = await login({ email, password });

      // Save token
      setToken(data.token);
      localStorage.setItem("token", data.token);

      // Redirect
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const message = err.response?.data?.message;

      if (message) {
        setError(message);

        setTimeout(() => {
          setError(null);
        }, 3000);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl bg-background/95 p-1 text-foreground shadow-2xl ring-1 ring-border/60 backdrop-blur-sm dark:bg-card/95">
      <Card className="border-0 bg-transparent shadow-none">
        <CardContent className="relative px-5 pb-6 pt-8 sm:px-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="absolute right-2 top-2 z-10 rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>

          <h2 className="mb-6 text-2xl font-bold tracking-tight">Log in</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10"
              />
            </div>
            {error ? (
              <p className="text-center text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="h-10 w-full">
              Log in
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
