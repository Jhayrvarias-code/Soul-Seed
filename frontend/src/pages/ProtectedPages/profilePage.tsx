import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from "@/services/userService";
import { calculateAge } from "@/utils/ageCalculator";
import { Edit2, MapPin, Heart, User, Calendar } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  bio: string;
  interests?: string[];
  photos?: { url: string; isAvatar: boolean }[];
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

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

  if (loadingProfile)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  if (!user) return <div className="text-center mt-20">User not found</div>;

  const age = calculateAge(user.birthdate);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-200 to-emerald-50 dark:from-background dark:via-background dark:to-background p-4 md:p-8 flex justify-center">
      <Card className="w-full max-w-2xl overflow-hidden border-none shadow-2xl rounded-[2rem]">
        {/* Hero Section: Photo */}
        <div className="relative h-[400px] w-full bg-muted">
          <img
            src={user.photos?.find((p) => p.isAvatar)?.url}
            alt={user.firstName}
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="flex items-center gap-1 text-sm opacity-90 mt-1">
                  <User className="w-3 h-3" /> Member
                </p>
              </div>
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full shadow-lg"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Bio Section */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              About Me
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {user.bio || "Write something interesting about yourself..."}
            </p>
          </section>

          <Separator className="opacity-50" />

          {/* Interests Section */}
          {user.interests && user.interests.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                <Heart className="w-4 h-4" />
                <span>Interests</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 transition-colors"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Primary Action */}
          <Button className="w-full py-6 rounded-2xl text-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 transition-all shadow-md">
            Edit Your Profile
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
