"use client";

import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Controller, useForm } from "react-hook-form";
import zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";

import instance from "@/libs/instance";
import mapUser from "@/api/services/users";
import { pathNameConfig } from "@/config/site";
import { LoginRequestInterface } from "@/api/interfaces/login-interface";

const schema = zod.object({
  email: zod.email("Invalid email address").min(2, "Email is too short"),
  password: zod.string().min(8, "Password must be at least 8 characters"),
});

export default function FormLogin() {
  const router = useRouter();

  const { handleSubmit, control, formState } = useForm<LoginRequestInterface>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginRequestInterface) => {
    try {
      const res = await instance.post("/public/auth/login", data);

      const resData = res.data;

      const user = mapUser(resData);

      const email = user?.email;

      addToast({
        title: "Login Successful",
        description: email ? `Welcome back, ${email}!` : "Welcome back!",
        color: "success",
      });

      router.push(pathNameConfig.videos.url);
    } catch (error: any) {
      addToast({
        title: "Login Failed",
        description: error?.message || "An error occurred during login.",
        color: "danger",
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <Input
            description="Enter your email address."
            label="Email"
            {...field}
            type="email"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <Input
            description="Enter your password."
            label="Password"
            {...field}
            type="password"
          />
        )}
      />

      <Button
        fullWidth
        color="primary"
        isLoading={formState.isSubmitting}
        type="submit"
      >
        Login
      </Button>
    </Form>
  );
}
