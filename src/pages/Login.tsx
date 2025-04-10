
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { toast } = useToast();

  // Mock data for demonstration purposes
  // In a real app, this would come from a database
  const mockStudents = [
    { id: "S1001", name: "Alex Johnson", age: 12, weight: 45, height: 152, gender: "male", school: "Springfield Elementary", class: "6A", tests: [] },
    { id: "S1002", name: "Emma Davis", age: 11, weight: 40, height: 148, gender: "female", school: "Springfield Elementary", class: "5B", tests: [] },
    { id: "S1003", name: "Jason Smith", age: 13, weight: 50, height: 162, gender: "male", school: "Riverside Middle School", class: "7C", tests: [] },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find student by ID and name
    const student = mockStudents.find(s => 
      s.id.toLowerCase() === studentId.toLowerCase() && 
      s.name.toLowerCase() === name.toLowerCase()
    );
    
    if (student) {
      setUser(student);
      toast({
        title: "Login successful",
        description: `Welcome back, ${student.name}!`,
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Login failed",
        description: "Student ID or name not found. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-3.5rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Student Login</CardTitle>
          <CardDescription className="text-center">
            Enter your student ID and name to access your fitness profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  placeholder="Enter your student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account yet?
          </div>
          <Link to="/profile" className="w-full">
            <Button variant="outline" className="w-full">
              Create New Profile
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
