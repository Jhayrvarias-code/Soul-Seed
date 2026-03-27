import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GlobalStateContext } from "../context/GlobalStateProvider";
import { X } from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { register } from "../services/authService";
// import { formatErrors } from "@/utils/formatErrors";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setToken } = useContext(GlobalStateContext);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error state
  type FormErrors = {
    firstName?: string;
    lastName?: string;
    gender?: string;
    birthdate?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };

  const [errors, setErrors] = useState<FormErrors>({});

  // Form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    setErrors({}); // Reset previous errors

    try {
      const data = await register({
        firstName,
        lastName,
        gender,
        birthdate: new Date(birthdate),
        email,
        password,
        confirmPassword,
      });

      setToken(data.token);
      localStorage.setItem("token", data.token);

      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const backendErrors = err.response?.data?.errors;

      if (backendErrors) {
        const formatted: Record<string, string> = {};

        backendErrors.forEach((err: any) => {
          formatted[err.field] = err.message;
        });

        setErrors(formatted);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-fit rounded-lg bg-background text-foreground">
      <Card className="w-[400px] p-4">
        <CardContent className="relative">
          <button
            onClick={() => navigate("/")}
            className="absolute top-1 right-1 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-bold mb-4 mt-5">Register</h2>

          <form onSubmit={handleRegister} className="space-y-3">
            {/* First Name */}
            <div>
              <Label>First Name</Label>
              <Input
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);

                  // Remove error when user types
                  setErrors((prev) => ({
                    ...prev,
                    firstName: undefined,
                  }));
                }}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <Label>Last Name</Label>
              <Input
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    lastName: undefined,
                  }));
                }}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">{errors.lastName}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <Label>Gender</Label>
              <Select onValueChange={setGender}>
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-[#FFFFFF]">
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender}</p>
              )}
            </div>

            <div>
              <Label>Birthdate</Label>
              <Input
                type="date"
                value={birthdate}
                onChange={(e) => {
                  setBirthdate(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    birthdate: undefined,
                  }));
                }}
              />
              {errors.birthdate && (
                <p className="text-red-500 text-sm">{errors.birthdate}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    email: undefined,
                  }));
                }}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    password: undefined,
                  }));
                }}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
                }}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" className="w-full mt-4">
              Register
            </Button>
            <p className="text-center mt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
