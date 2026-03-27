import { useContext, useEffect, useState } from "react";
import { getDiscoverUsers } from "@/services/discoverService";
import SwipeCard from "@/components/ProtectedComponents/SwipeCard";
import { swipeUser } from "@/services/swipeService";
// import { GlobalStateContext } from "@/context/GlobalStateProvider";
// import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function DashboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  // const { loading } = useContext(GlobalStateContext);
  // if (loading) return <Spinner />;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getDiscoverUsers();
        console.log("DISCOVER USERS:", data);
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, []);

  const handleSwipe = async (action: "like" | "pass", userId: string) => {
    // Update UI immediately
    setUsers((prev) => prev.filter((user) => user._id !== userId));

    try {
      await swipeUser(userId, action);

      toast.success(`You ${action}ed a user`, {
        style: {
          background: "#636363",
          color: "white",
        },
      });
    } catch (err) {
      toast.error("Swipe failed");

      console.error("Swipe failed", err);
    }
  };

  return (
    <main className=" min-h-screen bg-gradient-to-br from-blue-50 via-gray-200 to-emerald-50 dark:from-background dark:via-background dark:to-background md:p-8 text-foreground">
      <div className="relative flex flex-col items-center justify-center h-screen">
        <section>
          <h1 className="text-center text-xl font-bold mb-4">
            Discover People
          </h1>
        </section>

        <div className="relative flex justify-center items-center w-80 h-[500px]">
          {users.length === 0 && <p>No more users</p>}

          {users.slice(0, 2).map((user, index) => (
            <div
              key={user._id}
              className="absolute"
              style={{
                zIndex: users.length - index,
                scale: index === 0 ? 1 : 0.95,
              }}
            >
              <SwipeCard user={user} onSwipe={handleSwipe} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
