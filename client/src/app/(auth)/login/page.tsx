"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import axios from "axios";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAxios } from "@/configs/axios.config";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const [data, error] = await useAxios({
      url: "/api/login",
      method: "POST",
      data: {
        email: e.currentTarget.email.value,
        password: e.currentTarget.password.value,
      },
      headers: {
        "Content-Type": "Application/json",
      },
    });
    if (data) {
      toast({ title: "Loggedin Successfully" });

      router.push("/profile");
    }
    if (error) {
      toast({ title: error.response.data.msg });
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-xl">Sign In</CardTitle>
          <CardDescription>Enter your information to signin</CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                Sign In
              </Button>
            </div>
          </CardContent>
        </form>
        <CardFooter>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="underline">
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
