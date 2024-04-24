"use client";
import React, { useState } from "react";
import { useAxios } from "@/configs/axios.config";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Page = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const [data, error] = await useAxios({
        url: "/api/profile/image",
        method: "POST",
        data: formData,
      });
      if (data) {
        router.push("/profile");
      }
      if (error) {
        console.log(error);
        toast({ title: error.response.data.msg });
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-xl">Upload profile image</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="shine bg-base-100 rounded-box p-3 dark:bg-base-300">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-base-content dark:border-base-900"></div>
              <p className="pt-2 text-base-content dark:text-base-900">
                Uploading...
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
              <Input
                type="file"
                id="file"
                accept="image/*"
                onChange={onChange}
              />
              <Button type="submit" className="py-2 px-6">
                Upload
              </Button>
            </form>
          )}{" "}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
