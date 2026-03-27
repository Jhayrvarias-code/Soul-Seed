import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function LandingPage() {
  return (
    <main
      className=" min-h-screen 
  bg-gradient-to-br from-blue-50 via-gray-200 to-emerald-50 dark:from-background dark:via-background dark:to-background text-foreground"
    >
      {/* Hero Section */}
      <section className="text-center py-24 px-6">
        <h1 className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent text-3xl md:text-4xl lg:text-6xl  font-bold mb-6 ">
          Welcome to SoulSeed
        </h1>
        <p className="text-sx md:text-sm lg:text-lg mb-8 max-w-2xl mx-auto">
          Connect with people who truly align with you. Chat, match, and meet
          meaningful connections.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register">
            <Button variant="default">Get Started</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Discover People</CardTitle>
            <CardDescription>
              Find people who match your interests and values.
            </CardDescription>
          </CardHeader>
          <CardContent>
            Explore profiles, photos, and hobbies of others before matching.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-Time Chat</CardTitle>
            <CardDescription>
              Communicate instantly with your matches.
            </CardDescription>
          </CardHeader>
          <CardContent>
            Messages delivered instantly, with read receipts and typing
            indicators.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Safe & Secure</CardTitle>
            <CardDescription>
              We prioritize your privacy and security.
            </CardDescription>
          </CardHeader>
          <CardContent>
            JWT-based authentication and secure data handling.
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
