import ChatSidebar from "@/components/chat/chatSidebar";
import ChatWindow from "@/components/chat/chatWindow";
import { useState } from "react";
import type { Match } from "@/services/matchService";
import { cn } from "@/utils/utils";
import { MessageCircle } from "lucide-react";

export default function MessagesPage() {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const handleSelect = (match: Match) => {
    setSelectedMatch(match);
    setSidebarVisible(false);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background md:flex-row">
      <div
        className={cn(
          "flex min-h-0 w-full flex-col border-border md:max-w-sm md:shrink-0 md:border-r",
          sidebarVisible ? "flex flex-1 md:flex-none" : "hidden md:flex",
        )}
      >
        <ChatSidebar
          selectedId={selectedMatch?._id}
          onSelect={handleSelect}
        />
      </div>

      <section
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col",
          !sidebarVisible ? "flex" : "hidden md:flex",
        )}
        aria-label="Conversation"
      >
        {selectedMatch ? (
          <ChatWindow
            match={selectedMatch}
            onBack={() => setSidebarVisible(true)}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <MessageCircle
              className="size-14 text-muted-foreground/40"
              strokeWidth={1.25}
              aria-hidden
            />
            <div>
              <p className="font-medium text-foreground">Select a conversation</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Choose a match on the left to read and send messages. On mobile, pick someone
                from the list first.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
