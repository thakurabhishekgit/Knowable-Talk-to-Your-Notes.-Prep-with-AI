
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const getInitials = (name = "") => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    universityName: '',
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        username: parsedUser.username || '',
        email: parsedUser.email || '',
        universityName: parsedUser.universityName || '',
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
    }
  };
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!user?.id) {
        toast({ variant: "destructive", title: "Authentication Error", description: "Could not find user ID. Please log in again." });
        return;
    }

    try {
      const updatedUser = await api.put(`/api/users/updateUser/${user.id}`, formData);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      window.dispatchEvent(new Event('storage'));
      toast({ title: "Success", description: "Profile updated successfully." });
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  const handlePictureUpdate = async (e) => {
    e.preventDefault();
    if (!profilePictureFile || !user?.id) return;
    
    const pictureFormData = new FormData();
    pictureFormData.append('profilePicture', profilePictureFile);

    try {
      const updatedUserWithPic = await api.patch(`/api/users/updateProfilePicture/${user.id}`, pictureFormData);
      localStorage.setItem('user', JSON.stringify(updatedUserWithPic));
      setUser(updatedUserWithPic);
      window.dispatchEvent(new Event('storage'));
      toast({ title: "Success", description: "Profile picture updated." });
      setProfilePictureFile(null);
    } catch (error) {
      console.error("Failed to update profile picture", error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="grid gap-6">
        <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
            Manage your account settings and preferences.
            </p>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
          <CardDescription>Update your public profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" value={formData.username} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="universityName">University</Label>
              <Input id="universityName" name="universityName" value={formData.universityName} onChange={handleInputChange} />
            </div>
            <Button type="submit">Update Profile</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Update Profile Picture</CardTitle>
          <CardDescription>Change your avatar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePictureUpdate} className="space-y-4">
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                <AvatarImage src={user.profilePictureUrl || "https://placehold.co/100x100.png"} alt={user.username} data-ai-hint="profile" />
                <AvatarFallback className="text-2xl">{getInitials(user.username)}</AvatarFallback>
                </Avatar>
                <Input id="profilePicture" type="file" accept="image/*" onChange={handlePictureChange} className="max-w-xs" />
            </div>
             <Button type="submit" disabled={!profilePictureFile}>
                Save Picture
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
