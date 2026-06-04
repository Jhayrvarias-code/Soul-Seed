import { useEffect, useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser, type User } from "@/services/userService";
import { calculateAge } from "@/utils/ageCalculator";
import { Edit2, MapPin, Heart, User as UserIcon } from "lucide-react";
import EditProfileModal from "@/components/modal/editProfile";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        console.error("Failed to load user profile", err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchUser();
  }, []);

  if (loadingProfile) return <ProfileSkeleton />;

  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <p className="text-muted-foreground">
          We couldn&apos;t load your profile.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  const avatarUrl = user.photos?.find((p) => p.isAvatar)?.url ?? null;
  const age = calculateAge(user.birthdate);

  return (
    <>
      <main className="flex flex-1 justify-center bg-gradient-to-b from-primary/[0.06] via-background to-background px-4 py-8 dark:from-primary/10 md:px-8">
        <div className="flex w-full max-w-2xl flex-col gap-8">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="size-40 overflow-hidden rounded-full border-4 border-background bg-muted shadow-xl ring-1 ring-border sm:size-52 md:size-60">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <UserIcon className="size-full p-10 text-muted-foreground sm:p-12" />
                )}
              </div>
            </div>
          </div>

          <CardContent className="space-y-8 px-0 sm:px-2">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0 text-center sm:text-left">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                  {user.firstName} {user.lastName}
                  {Number.isFinite(age) ? (
                    <span className="ml-2 text-xl font-semibold text-muted-foreground">
                      {age}
                    </span>
                  ) : null}
                </h1>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm font-medium text-muted-foreground sm:justify-start">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-4 shrink-0" /> Philippines
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                    Active now
                  </span>
                </div>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                <Button
                  variant="outline"
                  onClick={() => setIsEditOpen(true)}
                  className="rounded-full gap-2"
                >
                  <Edit2 className="size-4" /> Edit profile
                </Button>
                <EditProfileModal
                  open={isEditOpen}
                  onClose={() => setIsEditOpen(false)}
                  user={user}
                  onSuccess={(updatedUser) => setUser(updatedUser)}
                />
              </div>
            </div>

            <section className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                About
              </h2>
              <p className="leading-relaxed text-foreground/90">
                {user.bio?.trim() || "This user hasn't written a bio yet."}
              </p>
            </section>

            {user.interests && user.interests.length > 0 ? (
              <section className="space-y-3">
                <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <Heart className="size-3 fill-rose-500 text-rose-500" />
                  Interests
                </h2>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, i) => (
                    <Badge
                      key={`${interest}-${i}`}
                      variant="secondary"
                      className="rounded-full border-0 bg-muted px-4 py-1.5 font-normal hover:scale-105"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </section>
            ) : null}
          </CardContent>
        </div>
      </main>
    </>
  );
}

export function ProfileSkeleton() {
  return (
    <main className="flex flex-1 justify-center px-4 py-8 md:px-8">
      <div className="w-full max-w-2xl space-y-8 animate-pulse">
        <div className="flex justify-center">
          <div className="size-52 rounded-full bg-muted md:size-60" />
        </div>
        <div className="mx-auto h-8 w-48 rounded bg-muted sm:mx-0" />
        <div className="space-y-2 px-2">
          <div className="h-4 rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
        </div>
        <div className="flex flex-wrap gap-2 px-2">
          <div className="h-8 w-16 rounded-full bg-muted" />
          <div className="h-8 w-20 rounded-full bg-muted" />
          <div className="h-8 w-14 rounded-full bg-muted" />
        </div>
      </div>
    </main>
  );
}
