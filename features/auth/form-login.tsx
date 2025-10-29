"use client";

import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Controller, useForm } from "react-hook-form";
import zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast } from "@heroui/toast";

import { LoginRequestInterface } from "@/api/interfaces/login-interface";

const schema = zod.object({
  email: zod.email("Invalid email address").min(2, "Email is too short"),
  password: zod.string().min(8, "Password must be at least 8 characters"),
});

export default function FormLogin() {
  const { handleSubmit, control } = useForm<LoginRequestInterface>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginRequestInterface) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const msg = errorBody?.message || "Network response was not ok";

        throw new Error(msg);
      }

      const resData = await response.json();

      const user = resData?.user ?? resData?.data?.user ?? null;

      const email = user?.email;

      addToast({
        title: "Login Successful",
        description: email ? `Welcome back, ${email}!` : "Welcome back!",
        color: "success",
      });
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

      <Button fullWidth color="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}
