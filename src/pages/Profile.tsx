
import { useUser } from "@/context/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, updateProfile } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: user?.age || "",
    weight: user?.weight || "",
    height: user?.height || "",
    gender: user?.gender || "male",
    school: user?.school || "",
    class: user?.class || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.age || !formData.weight || !formData.height || !formData.gender) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Update profile
    updateProfile({
      name: formData.name,
      age: Number(formData.age),
      weight: Number(formData.weight),
      height: Number(formData.height),
      gender: formData.gender as 'male' | 'female',
      school: formData.school,
      class: formData.class,
    });

    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });

    // Redirect to dashboard if this is a new user
    if (!user) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="container py-8 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            Update your personal information to get accurate fitness assessments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="age">Age (years) *</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  min={5}
                  max={18}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  required
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (kg) *</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="Enter weight"
                    min={15}
                    max={150}
                    step={0.1}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="height">Height (cm) *</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="Enter height"
                    min={60}
                    max={220}
                    step={0.1}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="school">School (optional)</Label>
                <Input
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="Enter your school name"
                />
              </div>
              
              <div>
                <Label htmlFor="class">Class/Grade (optional)</Label>
                <Input
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  placeholder="Enter your class or grade"
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              {user ? "Update Profile" : "Create Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
