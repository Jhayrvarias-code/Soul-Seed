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
    <div className="w-full max-w-md rounded-xl bg-background/95 p-1 text-foreground shadow-2xl ring-1 ring-border/60 backdrop-blur-sm dark:bg-card/95 sm:max-w-lg">
      <Card className="max-h-[min(90dvh,44rem)] overflow-y-auto border-0 bg-transparent shadow-none">
        <CardContent className="relative px-5 pb-6 pt-8 sm:px-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="absolute right-2 top-2 z-10 rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>

          <h2 className="mb-6 text-2xl font-bold tracking-tight">Create account</h2>

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
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-card">
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

            <Button type="submit" className="mt-4 h-10 w-full">
              Register
            </Button>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
