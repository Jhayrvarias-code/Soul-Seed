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
  const [error, setError] = useState("");

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
    <div className="flex items-center justify-center min-h-fit rounded-lg bg-background text-foreground">
      <Card className="w-[350px] p-4">
        <CardContent className="relative">
          <button
            onClick={() => navigate("/")}
            className="
          absolute top-1 right-1 
          z-10 
          p-2 rounded-full 
          bg-black/30 hover:bg-black/50 
          text-white
          transition
        "
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-bold mb-4 mt-5">Login</h2>
          <form onSubmit={handleLogin} className="space-y-3 ">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center justify-center mt-4">
              <>
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}
              </>
              <Button type="submit" variant="outline" className="w-[5rem]">
                Login
              </Button>
            </div>
            <p className="text-center">
              Don't have an account yet?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
