import { useUser, UserTest } from "@/context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/data/tests";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, LineChart, User, Dumbbell, Trophy } from "lucide-react";
import ClassLeaderboard from "@/components/ClassLeaderboard";

// Helper function to format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

// Function to get the color based on percentile
const getPercentileColor = (percentile: number) => {
  if (percentile >= 80) return "#22c55e"; // green-500
  if (percentile >= 60) return "#3b82f6"; // blue-500
  if (percentile >= 40) return "#eab308"; // yellow-500
  if (percentile >= 20) return "#f97316"; // orange-500
  return "#ef4444"; // red-500
};

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  if (!user) {
    return (
      <div className="container py-8 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Profile Required</CardTitle>
            <CardDescription>You need to create a profile to view your dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/profile">
              <Button>Create Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group tests by category
  const testsByCategory: Record<string, UserTest[]> = {};
  user.tests.forEach(test => {
    if (!testsByCategory[test.category]) {
      testsByCategory[test.category] = [];
    }
    testsByCategory[test.category].push(test);
  });

  // Calculate average percentile for each category
  const categoryAverages = Object.entries(testsByCategory).map(([category, tests]) => {
    const sum = tests.reduce((total, test) => total + test.percentile, 0);
    const average = tests.length > 0 ? sum / tests.length : 0;
    return {
      category,
      categoryName: CATEGORIES[category as keyof typeof CATEGORIES]?.label || category,
      icon: CATEGORIES[category as keyof typeof CATEGORIES]?.icon || "📊",
      percentile: Math.round(average),
      color: getPercentileColor(average),
      count: tests.length
    };
  });

  // Sort tests by date for the timeline chart
  const timelineData = [...user.tests]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(test => ({
      name: test.testName,
      date: formatDate(test.date),
      percentile: test.percentile,
      category: test.category,
      timestamp: new Date(test.date).getTime()
    }));

  // Get most recent tests
  const recentTests = [...user.tests]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="container py-8 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {user.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your fitness overview and progress
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => navigate('/tests')}>
            Take New Test
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tests Taken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.tests.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories Tested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryAverages.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">BMI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((user.weight / ((user.height / 100) ** 2)) || 0).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Height: {user.height}cm, Weight: {user.weight}kg
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Percentile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.tests.length > 0 
                ? Math.round(user.tests.reduce((sum, test) => sum + test.percentile, 0) / user.tests.length) 
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <LineChart className="h-4 w-4 mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            <Trophy className="h-4 w-4 mr-2" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fitness Category Overview</CardTitle>
              <CardDescription>
                Your performance across different fitness categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {categoryAverages.length > 0 ? (
                <div className="h-[300px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryAverages}
                      margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="categoryName" 
                        angle={-45} 
                        textAnchor="end" 
                        height={70} 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, 'Percentile']}
                        labelFormatter={(value) => `${value} (${categoryAverages.find(c => c.categoryName === value)?.icon || ''})`}
                      />
                      <Bar dataKey="percentile" name="Percentile Rank">
                        {categoryAverages.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Tests Taken Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Take your first fitness test to see your performance data
                  </p>
                  <Button onClick={() => navigate('/tests')}>
                    Take a Test Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {recentTests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Tests</CardTitle>
                <CardDescription>
                  Your most recent fitness test results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div>
                        <p className="font-medium">{test.testName}</p>
                        <p className="text-sm text-muted-foreground">
                          {CATEGORIES[test.category as keyof typeof CATEGORIES]?.icon} {CATEGORIES[test.category as keyof typeof CATEGORIES]?.label || test.category} • {formatDate(test.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-semibold" style={{ color: getPercentileColor(test.percentile) }}>
                          {test.percentile}%
                        </p>
                        <p className="text-sm text-muted-foreground">Percentile</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Test Performance Timeline</CardTitle>
              <CardDescription>
                Your progress over time across all tests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {timelineData.length > 0 ? (
                <div className="h-[300px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={timelineData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                    >
                      <defs>
                        <linearGradient id="colorPercentile" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        angle={-45} 
                        textAnchor="end" 
                        height={60} 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, 'Percentile']}
                        labelFormatter={(value) => timelineData.find(d => d.date === value)?.name || value}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="percentile" 
                        stroke="#3b82f6" 
                        fillOpacity={1} 
                        fill="url(#colorPercentile)" 
                        name="Percentile Rank"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Timeline Data Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Take multiple tests to track your progress over time
                  </p>
                  <Button onClick={() => navigate('/tests')}>
                    Take a Test Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leaderboard">
          {user && <ClassLeaderboard currentUser={user} />}
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your profile details used for test calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Name</h4>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Age</h4>
                  <p className="font-medium">{user.age} years</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Gender</h4>
                  <p className="font-medium capitalize">{user.gender}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Weight</h4>
                  <p className="font-medium">{user.weight} kg</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Height</h4>
                  <p className="font-medium">{user.height} cm</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">BMI</h4>
                  <p className="font-medium">
                    {((user.weight / ((user.height / 100) ** 2)) || 0).toFixed(1)}
                  </p>
                </div>
                
                {user.school && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">School</h4>
                    <p className="font-medium">{user.school}</p>
                  </div>
                )}
                
                {user.class && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Class/Grade</h4>
                    <p className="font-medium">{user.class}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <Link to="/profile">
                  <Button variant="outline">Update Profile</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
