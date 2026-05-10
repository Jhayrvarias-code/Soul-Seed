import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Heart, MessageCircle, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-[calc(100dvh-3.5rem)] bg-gradient-to-br from-primary/5 via-background to-secondary/10 text-foreground dark:from-background dark:via-background dark:to-secondary/5">
      <section className="mx-auto max-w-4xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pb-24 sm:pt-24">
        <h1 className="mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
          Welcome to SoulSeed
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
          Connect with people who align with you. Match thoughtfully, chat in real time, and
          build meaningful relationships.
        </p>
        <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link to="/register" className="sm:inline-flex">
            <Button className="w-full sm:w-auto" size="lg">
              Get started
            </Button>
          </Link>
          <Link to="/login" className="sm:inline-flex">
            <Button variant="outline" className="w-full sm:w-auto" size="lg">
              Log in
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 pb-20 sm:px-6 md:grid-cols-3 md:gap-8">
        <Card className="border-border/80 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader>
            <Heart className="mb-2 size-8 text-primary" aria-hidden />
            <CardTitle>Discover people</CardTitle>
            <CardDescription>
              Browse profiles and interests before you decide to match.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            SoulSeed helps you focus on compatibility, not endless scrolling.
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader>
            <MessageCircle className="mb-2 size-8 text-primary" aria-hidden />
            <CardTitle>Real-time chat</CardTitle>
            <CardDescription>Talk to matches as soon as you connect.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Fast, simple messaging so you can keep the conversation going.
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm transition-shadow hover:shadow-md md:col-span-1">
          <CardHeader>
            <Shield className="mb-2 size-8 text-primary" aria-hidden />
            <CardTitle>Built for trust</CardTitle>
            <CardDescription>Secure sign-in and respect for your data.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Authentication and sensible defaults so you can focus on meeting people.
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
