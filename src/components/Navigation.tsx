
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  User, 
  Dumbbell, 
  LayoutDashboard,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const routes = [
    { name: "Home", path: "/", icon: Home },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Tests", path: "/tests", icon: Dumbbell },
  ];

  const NavLink = ({ route }: { route: typeof routes[number] }) => {
    const isActive = location.pathname === route.path;
    
    return (
      <Link
        to={route.path}
        onClick={() => setOpen(false)}
        className={cn(
          "flex items-center gap-2 p-2 rounded-md transition-colors",
          isActive 
            ? "bg-primary text-primary-foreground" 
            : "hover:bg-muted"
        )}
      >
        <route.icon className="h-5 w-5" />
        <span>{route.name}</span>
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 max-w-screen-xl items-center">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          <h1 className="font-bold text-xl">FitKid Rank</h1>
        </div>

        {/* Mobile navigation */}
        <div className="flex md:hidden ml-auto">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-4 mt-8">
                {routes.map((route) => (
                  <NavLink key={route.path} route={route} />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex ml-auto gap-4">
          {routes.map((route) => (
            <NavLink key={route.path} route={route} />
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
