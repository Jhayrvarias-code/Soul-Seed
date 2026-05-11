import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { calculateAge } from "@/utils/ageCalculator";
import { Badge } from "../ui/badge";
import type { DiscoverUser } from "@/services/discoverService";

type SwipeCardProps = {
  user: DiscoverUser;
  onSwipe: (action: "like" | "pass", userId: string) => void;
};

export default function SwipeCard({ user, onSwipe }: SwipeCardProps) {
  const controls = useAnimation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const opacity = useTransform(x, [-200, 0, 200], [0.35, 1, 0.35]);

  const age = calculateAge(user.birthdate);
  const avatar = user.photos?.find((p) => p.isAvatar)?.url;
  const initial = user.firstName?.charAt(0)?.toUpperCase() || "?";

  const handleDragEnd = async (
    _: unknown,
    info: { offset: { x: number } },
  ) => {
    try {
      if (info.offset.x > 120) {
        onSwipe("like", user._id);
        await controls.start({ x: 520, opacity: 0 });
      } else if (info.offset.x < -120) {
        onSwipe("pass", user._id);
        await controls.start({ x: -520, opacity: 0 });
      } else {
        await controls.start({
          x: 0,
          rotate: 0,
          opacity: 1,
          transition: { type: "spring", stiffness: 380, damping: 28 },
        });
      }
    } catch (err) {
      console.error("Swipe failed", err);
    }
  };

  return (
    <motion.div
      drag="x"
      dragElastic={0.85}
      style={{ x, rotate, opacity }}
      onDragEnd={handleDragEnd}
      animate={controls}
      className="w-full cursor-grab touch-pan-y active:cursor-grabbing"
    >
      <Card className="overflow-hidden rounded-3xl border-border/80 py-0 shadow-lg">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted sm:aspect-[4/5]">
          {avatar ? (
            <img
              src={avatar}
              alt=""
              className="absolute inset-0 size-full object-cover object-center"
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted text-4xl font-semibold text-muted-foreground">
              {initial}
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
          <div className="pointer-events-none absolute bottom-3 left-4 right-4 text-white drop-shadow-md">
            <p className="text-2xl font-bold tracking-tight sm:text-3xl">
              {user.firstName}
              {Number.isFinite(age) ? `, ${age}` : ""}
            </p>
            {user.bio ? (
              <p className="mt-1 line-clamp-2 text-sm text-white/95">{user.bio}</p>
            ) : null}
          </div>
        </div>
        <CardContent className="space-y-3 px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Interests
          </p>
          {user.interests && user.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.interests.map((hobby, i) => (
                <Badge
                  key={`${hobby}-${i}`}
                  variant="secondary"
                  className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-800 dark:text-emerald-200"
                >
                  {hobby}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No interests listed yet.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
