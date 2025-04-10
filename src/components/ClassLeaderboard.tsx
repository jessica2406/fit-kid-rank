
import { useState } from "react";
import { User, UserTest } from "@/context/UserContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Medal, Award } from "lucide-react";
import { CATEGORIES } from "@/data/tests";

// Define mock data for the leaderboard
const mockClassmates: User[] = [
  { 
    id: "S1001", 
    name: "Alex Johnson", 
    age: 12, 
    weight: 45, 
    height: 152, 
    gender: "male", 
    school: "Springfield Elementary", 
    class: "6A",
    tests: [
      { id: "t1", testId: "push-ups", testName: "Push-ups", category: "strength", score: 25, percentile: 85, date: "2023-03-15" },
      { id: "t2", testId: "mile-run", testName: "Mile Run", category: "endurance", score: 8.5, percentile: 72, date: "2023-03-10" }
    ] 
  },
  { 
    id: "S1002", 
    name: "Emma Davis", 
    age: 11, 
    weight: 40, 
    height: 148, 
    gender: "female", 
    school: "Springfield Elementary", 
    class: "5B",
    tests: [
      { id: "t3", testId: "push-ups", testName: "Push-ups", category: "strength", score: 15, percentile: 78, date: "2023-03-12" },
      { id: "t4", testId: "mile-run", testName: "Mile Run", category: "endurance", score: 9.2, percentile: 65, date: "2023-03-08" }
    ] 
  },
  { 
    id: "S1003", 
    name: "Jason Smith", 
    age: 13, 
    weight: 50, 
    height: 162, 
    gender: "male", 
    school: "Riverside Middle School", 
    class: "7C",
    tests: [
      { id: "t5", testId: "push-ups", testName: "Push-ups", category: "strength", score: 30, percentile: 90, date: "2023-03-14" },
      { id: "t6", testId: "mile-run", testName: "Mile Run", category: "endurance", score: 7.8, percentile: 82, date: "2023-03-09" }
    ] 
  },
  { 
    id: "S1004", 
    name: "Sophia Lee", 
    age: 12, 
    weight: 42, 
    height: 155, 
    gender: "female", 
    school: "Springfield Elementary", 
    class: "6A",
    tests: [
      { id: "t7", testId: "push-ups", testName: "Push-ups", category: "strength", score: 18, percentile: 82, date: "2023-03-13" },
      { id: "t8", testId: "mile-run", testName: "Mile Run", category: "endurance", score: 8.1, percentile: 76, date: "2023-03-11" }
    ] 
  },
  { 
    id: "S1005", 
    name: "Oliver Wilson", 
    age: 12, 
    weight: 46, 
    height: 158, 
    gender: "male", 
    school: "Springfield Elementary", 
    class: "6A",
    tests: [
      { id: "t9", testId: "push-ups", testName: "Push-ups", category: "strength", score: 22, percentile: 80, date: "2023-03-10" },
      { id: "t10", testId: "mile-run", testName: "Mile Run", category: "endurance", score: 8.7, percentile: 71, date: "2023-03-15" }
    ] 
  }
];

// Helper function to get medal icon based on rank
const getMedalIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Medal className="h-5 w-5 text-amber-700" />;
    default:
      return <span className="text-muted-foreground font-medium">{rank}</span>;
  }
};

interface ClassLeaderboardProps {
  currentUser: User;
}

const ClassLeaderboard = ({ currentUser }: ClassLeaderboardProps) => {
  const [selectedTest, setSelectedTest] = useState<string>("overall");
  
  // Find all available tests across all students
  const getAvailableTests = () => {
    const allTests = new Set<string>();
    
    // Add "overall" option for overall ranking
    allTests.add("overall");
    
    // Add all test types
    mockClassmates.forEach(student => {
      student.tests.forEach(test => {
        allTests.add(test.testId);
      });
    });
    
    currentUser.tests.forEach(test => {
      allTests.add(test.testId);
    });
    
    return Array.from(allTests);
  };
  
  // Get all class peers including current user
  const getAllClassmates = () => {
    // Filter students of the same class as current user
    const classmates = currentUser.class
      ? [...mockClassmates.filter(student => student.class === currentUser.class)]
      : [...mockClassmates];
    
    // Check if current user is already in the list
    const isCurrentUserIncluded = classmates.some(student => student.id === currentUser.id);
    
    // Add current user if not already in the list
    if (!isCurrentUserIncluded) {
      classmates.push(currentUser);
    }
    
    return classmates;
  };
  
  const getTestName = (testId: string): string => {
    if (testId === "overall") return "Overall";
    
    // Find a test with this ID to get its name
    for (const student of getAllClassmates()) {
      const test = student.tests.find(t => t.testId === testId);
      if (test) return test.testName;
    }
    
    return testId; // Fallback to ID if name not found
  };
  
  // Calculate student scores based on selected test
  const calculateLeaderboard = () => {
    const classmates = getAllClassmates();
    
    if (selectedTest === "overall") {
      // Calculate average percentile across all tests for each student
      return classmates
        .map(student => {
          const avgPercentile = student.tests.length > 0
            ? student.tests.reduce((sum, test) => sum + test.percentile, 0) / student.tests.length
            : 0;
          
          return {
            id: student.id,
            name: student.name,
            score: avgPercentile,
            isCurrentUser: student.id === currentUser.id
          };
        })
        .sort((a, b) => b.score - a.score);
    } else {
      // Get scores for specific test
      return classmates
        .map(student => {
          const test = student.tests.find(t => t.testId === selectedTest);
          
          return {
            id: student.id,
            name: student.name,
            score: test ? test.percentile : 0,
            isCurrentUser: student.id === currentUser.id
          };
        })
        .sort((a, b) => b.score - a.score);
    }
  };
  
  const leaderboard = calculateLeaderboard();
  const availableTests = getAvailableTests();
  
  // Find current user's rank
  const currentUserRank = leaderboard.findIndex(entry => entry.id === currentUser.id) + 1;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Class Leaderboard</CardTitle>
            <CardDescription>
              See how you rank among your classmates
            </CardDescription>
          </div>
          <div className="w-full md:w-48">
            <Select value={selectedTest} onValueChange={setSelectedTest}>
              <SelectTrigger>
                <SelectValue placeholder="Select test" />
              </SelectTrigger>
              <SelectContent>
                {availableTests.map(testId => (
                  <SelectItem key={testId} value={testId}>
                    {getTestName(testId)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {currentUserRank > 0 && (
          <div className="bg-muted/40 p-3 rounded-md mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">Your Rank:</span>
              <span className="flex items-center gap-1">
                {getMedalIcon(currentUserRank)}
                {currentUserRank}
                <span className="text-sm text-muted-foreground ml-1">
                  out of {leaderboard.length}
                </span>
              </span>
            </div>
            <div className="font-mono font-semibold">
              {leaderboard.find(entry => entry.id === currentUser.id)?.score.toFixed(1)}%
            </div>
          </div>
        )}
        
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Rank</TableHead>
                <TableHead>Student</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((student, index) => (
                <TableRow 
                  key={student.id}
                  className={student.isCurrentUser ? "bg-primary/5 font-medium" : ""}
                >
                  <TableCell className="py-2">
                    <div className="flex justify-center items-center">
                      {getMedalIcon(index + 1)}
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    {student.name}
                    {student.isCurrentUser && (
                      <span className="ml-2 text-xs text-primary">(You)</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right py-2 font-mono">
                    {student.score.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassLeaderboard;
