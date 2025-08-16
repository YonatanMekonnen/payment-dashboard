import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { LogOut, User } from "lucide-react";

export const DashboardHeader = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/images/companyLogo.png"
              alt="Kifiya logo"
              className="h-8 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-bold">
                Kifiya Payment Dashboard
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Operations & Monitoring Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span>Welcome, {user?.username}</span>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
