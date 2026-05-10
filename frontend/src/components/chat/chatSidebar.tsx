import { getMatches, type Match } from "@/services/matchService";
import { useEffect, useState, useContext } from "react";
import { GlobalStateContext } from "@/context/GlobalStateProvider";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn } from "@/utils/utils";
import { MessageCircle } from "lucide-react";

type ChatSidebarProps = {
  selectedId?: string;
  onSelect: (match: Match) => void;
};

export default function ChatSidebar({ selectedId, onSelect }: ChatSidebarProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const { user } = useContext(GlobalStateContext);

  useEffect(() => {
    getMatches()
      .then(setMatches)
      .catch((err) => console.error("Failed to load matches", err));
  }, []);

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
        Loading conversations…
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-muted/30">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-lg font-semibold tracking-tight">Messages</h2>
        <p className="text-xs text-muted-foreground">Your matches</p>
      </div>
      <div className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
            <MessageCircle className="size-10 text-muted-foreground/50" aria-hidden />
            <p className="text-sm text-muted-foreground">No matches yet. Keep swiping!</p>
          </div>
        ) : (
          matches.map((match) => {
            const otherUser =
              match.user1._id === user._id ? match.user2 : match.user1;
            const initial = otherUser.firstName?.charAt(0)?.toUpperCase() || "?";
            const isActive = match._id === selectedId;

            return (
              <button
                key={match._id}
                type="button"
                onClick={() => onSelect(match)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                  isActive
                    ? "bg-primary/10 text-foreground"
                    : "text-foreground hover:bg-muted/80",
                )}
              >
                <Avatar className="size-11 border border-border/60">
                  <AvatarFallback className="bg-primary/15 text-sm font-medium text-primary">
                    {initial}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{otherUser.firstName}</p>
                  <p className="truncate text-xs text-muted-foreground">Tap to open chat</p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
