
import { useParams, useNavigate, Link } from "react-router-dom";
import { getTestById } from "@/data/tests";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";
import { ArrowLeft, Check, Info } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const TestDetail = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { user, addTestResult } = useUser();
  const { toast } = useToast();
  const [values, setValues] = useState<Record<string, number>>({});
  const [step, setStep] = useState<'instructions' | 'test' | 'results'>('instructions');
  const [result, setResult] = useState<{ score: number; percentile: number } | null>(null);

  const test = testId ? getTestById(testId) : null;

  if (!user) {
    return (
      <div className="container py-8 max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Profile Required</CardTitle>
            <CardDescription>You need to create a profile before taking tests.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to="/profile">
              <Button>Create Profile</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="container py-8 max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test Not Found</CardTitle>
            <CardDescription>The test you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to="/tests">
              <Button>Back to Tests</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const handleInputChange = (id: string, value: string) => {
    setValues(prev => ({
      ...prev,
      [id]: parseFloat(value)
    }));
  };

  const handleStartTest = () => {
    setStep('test');
  };

  const handleCalculateResults = () => {
    // Validate all inputs have values
    const missingInputs = test.inputs.some(input => values[input.id] === undefined);
    
    if (missingInputs) {
      toast({
        title: "Missing measurements",
        description: "Please enter all required measurements.",
        variant: "destructive",
      });
      return;
    }

    // Calculate score and percentile
    const score = test.calculateScore(values);
    const percentile = test.getPercentile(score, user.age, user.gender);
    
    setResult({ score, percentile });
    setStep('results');

    // Save test result
    addTestResult({
      id: Date.now().toString(),
      testId: test.id,
      testName: test.name,
      category: test.category,
      score,
      percentile,
      date: new Date().toISOString()
    });
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 80) return "text-green-600";
    if (percentile >= 60) return "text-blue-600";
    if (percentile >= 40) return "text-yellow-600";
    if (percentile >= 20) return "text-orange-600";
    return "text-red-600";
  };

  const getPercentileLabel = (percentile: number) => {
    if (percentile >= 80) return "Excellent";
    if (percentile >= 60) return "Good";
    if (percentile >= 40) return "Average";
    if (percentile >= 20) return "Below Average";
    return "Poor";
  };

  return (
    <div className="container py-8 max-w-xl mx-auto">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" onClick={() => navigate('/tests')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Tests
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{test.name}</CardTitle>
              <CardDescription className="mt-2">{test.description}</CardDescription>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm font-medium">
              <div>Instructions</div>
              <div>Test</div>
              <div>Results</div>
            </div>
            <Progress value={
              step === 'instructions' ? 33 : 
              step === 'test' ? 66 : 
              100
            } className="h-2 mt-2" />
          </div>
        </CardHeader>
        
        <CardContent>
          {step === 'instructions' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-2" /> Test Instructions
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  {test.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}
          
          {step === 'test' && (
            <div className="space-y-6">
              <div className="rounded-lg bg-muted p-4 text-sm">
                <p>Enter your measurements below. Make sure to follow the test instructions for accurate results.</p>
              </div>
              
              {test.inputs.map((input) => (
                <div key={input.id} className="space-y-2">
                  <Label htmlFor={input.id}>{input.label}</Label>
                  <div className="flex">
                    <Input
                      id={input.id}
                      type="number"
                      min={input.min}
                      max={input.max}
                      step={input.step || 1}
                      value={values[input.id] || ''}
                      onChange={(e) => handleInputChange(input.id, e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center px-3 bg-muted border border-l-0 rounded-r-md text-sm">
                      {input.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {step === 'results' && result && (
            <div className="space-y-6">
              <div className="flex flex-col items-center p-6 bg-muted/30 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Your Percentile</h3>
                <div className={`text-5xl font-bold ${getPercentileColor(result.percentile)}`}>
                  {Math.round(result.percentile)}%
                </div>
                <p className="mt-2 text-sm font-medium">
                  {getPercentileLabel(result.percentile)}
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Test Score</h3>
                  <p className="text-lg font-medium">
                    {typeof result.score === 'number' ? result.score.toFixed(2) : result.score}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">What This Means</h3>
                  <p className="text-sm mt-1">
                    Your percentile rank shows how your performance compares to others in your age group and gender.
                    A higher percentile means better performance relative to your peers.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {step === 'instructions' && (
            <Button onClick={handleStartTest} className="w-full">
              Start Test
            </Button>
          )}
          
          {step === 'test' && (
            <Button onClick={handleCalculateResults} className="w-full">
              Calculate Results
            </Button>
          )}
          
          {step === 'results' && (
            <div className="w-full space-y-3">
              <Button onClick={() => navigate('/dashboard')} className="w-full" variant="default">
                <Check className="h-4 w-4 mr-2" /> View Dashboard
              </Button>
              <Button onClick={() => navigate('/tests')} className="w-full" variant="outline">
                Take Another Test
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default TestDetail;
