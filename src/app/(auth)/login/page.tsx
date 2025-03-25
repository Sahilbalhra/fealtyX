"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield } from "lucide-react";

const MOCK_USERS = [
  { email: "sahil.dev@fealtyx.com", password: "dev123", role: "developer" },
  { email: "sahil.manager@fealtyx.com", password: "mgr123", role: "manager" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(
        `Welcome back, ${user.role === "developer" ? "Developer" : "Manager"}!`
      );
      router.push("/dashboard");
    } else {
      toast.error(`Login failed!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 space-y-6 bg-white/80 backdrop-blur-sm">
        <div className="text-center space-y-2">
          <Shield className="mx-auto h-12 w-12 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Sign in to FealtyX
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>

        <div className="text-sm text-center text-gray-500">
          <p>Demo Credentials:</p>
          <p>Developer: sahil.dev@fealtyx.com/ dev123</p>
          <p>Manager: sahil.manager@fealtyx.com/ mgr123</p>
        </div>
      </Card>
    </div>
  );
}
