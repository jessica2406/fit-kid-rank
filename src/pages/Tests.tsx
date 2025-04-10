
import { getAllCategories, getTestsByCategory, CATEGORIES, TestCategory } from "@/data/tests";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight } from "lucide-react";

const Tests = () => {
  const { user } = useUser();
  const categories = getAllCategories();
  
  if (!user) {
    return (
      <div className="container py-8 max-w-4xl mx-auto">
        <div className="text-center p-8 border rounded-lg bg-muted/20">
          <h2 className="text-2xl font-semibold mb-4">Create a Profile First</h2>
          <p className="text-muted-foreground mb-6">
            Please create a profile before taking fitness tests. This will help us provide accurate assessments.
          </p>
          <Link to="/profile">
            <Button>Create Profile</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Fitness Tests</h1>
        <p className="text-muted-foreground max-w-xl">
          Select a test category below to begin your fitness assessment
        </p>
      </div>

      <Tabs defaultValue={categories[0]}>
        <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-8">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="text-xs md:text-sm">
              <span className="hidden md:inline mr-1">{CATEGORIES[category].icon}</span>
              <span className="truncate">{CATEGORIES[category].label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid gap-4 md:gap-6">
              {getTestsByCategory(category).map((test) => (
                <Card key={test.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{test.name}</CardTitle>
                        <CardDescription className="mt-1.5">{test.description}</CardDescription>
                      </div>
                      <span className="text-2xl">{CATEGORIES[category].icon}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {test.instructions.length} steps • {test.inputs.length} measurements
                      </div>
                      <Link to={`/tests/${test.id}`}>
                        <Button variant="secondary" size="sm">
                          Take Test <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Tests;
