import { useEffect, useState } from "react";
import { getDiscoverUsers, type DiscoverUser } from "@/services/discoverService";
import SwipeCard from "@/components/ProtectedComponents/SwipeCard";
import { swipeUser } from "@/services/swipeService";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, X } from "lucide-react";
import { cn } from "@/utils/utils";

export default function DashboardPage() {
  const [users, setUsers] = useState<DiscoverUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getDiscoverUsers();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
        toast.error("Couldn’t load people to discover. Try again later.");
      }
    };

    fetchUsers();
  }, []);

  const handleSwipe = async (action: "like" | "pass", userId: string) => {
    setUsers((prev) => prev.filter((user) => user._id !== userId));

    try {
      await swipeUser(userId, action);
      toast.success(action === "like" ? "Liked!" : "Passed");
    } catch (err) {
      toast.error("Something went wrong with that swipe.");
      console.error("Swipe failed", err);
    }
  };

  const topUser = users[0];

  return (
    <div
      className={cn(
        "flex flex-1 flex-col bg-gradient-to-b from-primary/[0.06] via-background to-background",
        "dark:from-primary/10 dark:via-background dark:to-background",
      )}
    >
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-10 pt-6 sm:px-6 sm:pt-8">
        <header className="mb-4 flex flex-col gap-2 sm:mb-6">
          <Badge
            variant="outline"
            className="w-fit gap-1 border-primary/30 bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground backdrop-blur-sm"
          >
            <Sparkles className="size-3.5" aria-hidden />
            For you
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Discover
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Swipe the card or use the buttons — pass left, like right.
          </p>
        </header>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col sm:max-w-md">
          <div
            className="relative isolate w-full flex-1"
            aria-live="polite"
          >
            {users.length === 0 ? (
              <div className="flex min-h-[20rem] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 px-6 py-16 text-center shadow-inner sm:min-h-[22rem]">
                <Heart
                  className="mb-4 size-12 text-muted-foreground/60"
                  strokeWidth={1.25}
                  aria-hidden
                />
                <p className="text-base font-medium text-foreground">
                  You&apos;re all caught up
                </p>
                <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                  Check back later for new people, or update your profile to get better matches.
                </p>
              </div>
            ) : (
              users.slice(0, 2).map((user, index) => (
                <div
                  key={user._id}
                  className={cn(
                    "w-full transition-transform",
                    index === 0
                      ? "relative z-20"
                      : "absolute inset-x-0 top-0 z-10 origin-top scale-[0.96] sm:translate-y-2",
                    index !== 0 && "pointer-events-none",
                  )}
                >
                  <SwipeCard user={user} onSwipe={handleSwipe} />
                </div>
              ))
            )}
          </div>

          {topUser ? (
            <div className="relative z-30 mt-6 flex items-center justify-center gap-6 px-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-14 rounded-full border-2 border-destructive/40 text-destructive shadow-md hover:bg-destructive/10"
                aria-label="Pass"
                onClick={() => handleSwipe("pass", topUser._id)}
              >
                <X className="size-7" />
              </Button>
              <Button
                type="button"
                size="icon"
                className="size-14 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                aria-label="Like"
                onClick={() => handleSwipe("like", topUser._id)}
              >
                <Heart className="size-7 fill-current" />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
