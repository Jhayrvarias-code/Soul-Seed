import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";
import { Card, CardDescription, CardContent } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { calculateAge } from "@/utils/ageCalculator";
import { Badge } from "../ui/badge";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  bio: string;
  interests?: string[];
  photos?: { url: string; isAvatar: boolean }[];
};

type SwipeCardProps = {
  user: User;
  onSwipe: (action: "like" | "pass", userId: string) => void;
};

export default function SwipeCard({ user, onSwipe }: SwipeCardProps) {
  const controls = useAnimation();
  // Motion values
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);

  const age = calculateAge(user.birthdate);
  const avatar = user.photos?.find((p) => p.isAvatar)?.url;

  const handleDragEnd = async (_: any, info: any) => {
    try {
      if (info.offset.x > 150) {
        onSwipe("like", user._id);
        controls.start({ x: 500, opacity: 0 });
      } else if (info.offset.x < -150) {
        controls.start({ x: -500, opacity: 0 });

        onSwipe("pass", user._id);
      } else {
        controls.start({
          x: 0,
          rotate: 0,
          opacity: 1,
          transition: { type: "spring", stiffness: 300, damping: 30 },
        });
      }
    } catch (err) {
      console.error("Swipe failed", err);
    }
  };

  return (
    <motion.div
      drag="x"
      style={{ x, rotate, opacity }}
      onDragEnd={handleDragEnd}
      animate={controls} // <-- smooth animation controller
      className="w-80 h-[500px] cursor-grab active:cursor-grabbing"
    >
      <Card className="w-full h-full rounded-2xl shadow-xl overflow-hidden py-0">
        <div className="h-[400px] w-full bg-muted">
          {/* Avatar */}
          <Avatar className="w-full h-full">
            <AvatarImage src={avatar} className="rounded-none" />
            <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <CardContent className="flex flex-col items-start justify-center h-full px-0">
          <div className=" flex flex-col justify-center px-5 mb-10">
            {/* Name */}
            <h2 className="text-2xl font-bold mb-5">
              {user.firstName}, {age}
            </h2>

            {/* Bio */}
            {/* <p className="text-foreground">{user.bio}</p> */}

            {user.interests && user.interests?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-2 text-foreground">
                {user.interests.map((hobby, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 transition-colors"
                  >
                    {hobby}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
