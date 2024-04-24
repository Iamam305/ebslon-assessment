"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import React, { useState } from "react";
import { useAxios } from "@/configs/axios.config";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    const [data, error] = await useAxios({
      url: "/api/profile",
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
      },
    });

    if (data) {
      setUserDetails(data.user_info);
    }
    if (error) {
      router.push("/login");
    }
  };

  React.useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="max-w-sm mx-auto w-full">
        <CardHeader>
          <CardTitle className="text-xl">Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {userDetails ? (
            <>
              <Avatar className="w-32 h-32 border">
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_API_URI!}api/profile/image`}
                  alt="Avatar"
                  className="object-cover"
                />
                <AvatarFallback>{userDetails.user_name}</AvatarFallback>
              </Avatar>
              <p className="text-md w-full text-left">
                <span className="font-bold"> User Name:</span>{" "}
                {userDetails.user_name}
              </p>
              <p className="text-md w-full text-left">
                <span className="font-bold"> User Email:</span>{" "}
                {userDetails.email}
              </p>
            </>
          ) : (
            ""
          )}
        </CardContent>
        <CardFooter className="justify-center items-center w-full">
          <Link href="/profile/edit" className="">
            <Button>Edit Image</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
