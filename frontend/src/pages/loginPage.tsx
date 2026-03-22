import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GlobalStateContext } from "../context/GlobalStateProvider";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";

import { login } from "../api/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setToken } = useContext(GlobalStateContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const data = await login(email, password);

      // Save token
      setToken(data.token);
      localStorage.setItem("token", data.token);

      // Redirect
      navigate("/profile");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[350px] p-4">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Login</h2>

          <div className="space-y-3 ">
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
              <div className="flex justify-center mt-4">
            <Button variant="outline" className="w-[5rem]" onClick={handleLogin}>
              Login
            </Button>
            </div>
            <p>Don't have an account yet? <Link to="/register" className="text-blue-500 hover:underline">
            Register</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}