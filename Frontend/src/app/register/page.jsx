
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const profilePictureFile = formData.get('profilePicture');

    const userPayload = {
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      universityName: formData.get('universityName'),
    };

    try {
      // Step 1: Register the user with text data
      const registeredUser = await api.post('/api/users/registerUser', userPayload);

      // Step 2: If there's a profile picture, upload it
      if (profilePictureFile && profilePictureFile.size > 0 && registeredUser && registeredUser.id) {
        const pictureFormData = new FormData();
        pictureFormData.append('profilePicture', profilePictureFile);
        
        // Use the ID from the registration response to upload the picture
        await api.post(`/api/users/uploadProfilePicture/${registeredUser.id}`, pictureFormData);
      }
      
      toast({
        title: "Success",
        description: "Account created successfully! Please log in.",
      });
      router.push("/");
    } catch (error) {
      console.error("Registration failed:", error);
      // The toast is already shown by the api handler, no need to show another one.
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="space-y-2 text-center">
        <div className="inline-block">
            <BrainCircuit className="w-12 h-12 text-primary mx-auto" />
          </div>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" placeholder="Alex Doe" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="universityName">University Name</Label>
                <Input id="universityName" name="universityName" placeholder="University of Knowledge" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>
              <Input id="profilePicture" name="profilePicture" type="file" accept="image/*" />
            </div>
            <Button type="submit" className="w-full">
                Create account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
