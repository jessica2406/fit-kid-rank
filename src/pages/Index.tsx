
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Dumbbell, ArrowRight, ClipboardList, Trophy } from "lucide-react";

const Index = () => {
  const { user } = useUser();

  return (
    <div className="container py-8 mx-auto">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
          <Dumbbell className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">FitKid Rank</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          The comprehensive fitness testing app for children. Track, compare, and improve physical abilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-card rounded-lg p-6 shadow-sm border flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-xl mb-2">Comprehensive Tests</h3>
          <p className="text-muted-foreground mb-4">
            Evaluate endurance, strength, flexibility, agility, and more with our scientifically backed fitness tests.
          </p>
        </div>
        
        <div className="bg-card rounded-lg p-6 shadow-sm border flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-xl mb-2">Percentile Rankings</h3>
          <p className="text-muted-foreground mb-4">
            See how you compare to others in your age group with detailed percentile rankings for each test.
          </p>
        </div>
        
        <div className="bg-card rounded-lg p-6 shadow-sm border flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-secondary" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
          </div>
          <h3 className="font-medium text-xl mb-2">Personal Profiles</h3>
          <p className="text-muted-foreground mb-4">
            Create and manage personal profiles to track progress over time and see improvements in fitness.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {user ? (
          <>
            <Link to="/dashboard">
              <Button className="px-8">
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/tests" className="text-primary hover:underline">
              Take a New Test
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile">
              <Button className="px-8">
                Create Profile <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/tests" className="text-primary hover:underline">
              Explore Tests
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
