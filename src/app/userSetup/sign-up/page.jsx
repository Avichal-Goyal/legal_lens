"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { signUpSchema } from "@/schemas/signUpSchema";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignUpPage = () => {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
        username: "",
        email: "",
        password: "",
        },
    });

    useEffect(() => {
        const trimmedUsername = username.trim();

        if (!trimmedUsername) {
        setUsernameMessage("");
        setIsUsernameAvailable(null);
        return;
        }

        const controller = new AbortController();

        const checkUniqueUsername = async () => {
        try {
            setIsCheckingUsername(true);
            if (trimmedUsername.length < 3) {
                setUsernameMessage("Username must be at least 3 characters.");
                setIsUsernameAvailable(false);
                setIsCheckingUsername(false);
                return;
            }
            setUsernameMessage("");

            const response = await axios.get(
            `/api/auth/check-unique-username?username=${encodeURIComponent(
                trimmedUsername
            )}`,
            { signal: controller.signal }
            );

            setUsernameMessage(response.data.message);
            setIsUsernameAvailable(response.data.success);
        } catch (error) {
            if (error.code === "ERR_CANCELED") {
            return;
            }

            const message =
            error.response?.data?.message || "Could not check username.";

            setUsernameMessage(message);
            setIsUsernameAvailable(false);
        } finally {
            if (!controller.signal.aborted) {
            setIsCheckingUsername(false);
            }
        }
        };

        checkUniqueUsername();

        return () => controller.abort();
    }, [username]);

    const onSubmit = async (data) => {
        if (isUsernameAvailable === false) {
        toast.error("Choose another username", {
            description: "This username is already taken.",
        });
        return;
        }

        try {
        setIsSubmitting(true);

        const response = await axios.post("/api/userSetup/signup", data);

        toast.success("Account created", {
            description: response.data.message,
        });

        router.replace("/userSetup/sign-in");
        } catch (error) {
            if (error.response?.data?.code === "EMAIL_EXISTS") {
                toast.error("Account already exists", {
                description: "Please sign in with your existing account.",
                });

                router.replace(error.response.data.redirectTo);
                return;
            }

            const message =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Registration failed. Please try again.";

            toast.error("Signup failed", {
                description: message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="w-full max-w-md space-y-8 rounded-lg border border-zinc-700 bg-zinc-900 p-8 shadow-2xl">
            <div className="text-center">
            <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-zinc-50 sm:text-5xl">
                Legal Clarity, Delivered.
            </h1>
            <p className="text-zinc-400">
                Create your account to access secure legal tools and documentation.
            </p>
            </div>

            <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 text-white"
            >
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input
                        placeholder="legal_lens_user"
                        autoComplete="username"
                        {...field}
                        onChange={(event) => {
                            field.onChange(event);
                            setUsername(event.target.value);
                        }}
                        className="border-zinc-700 bg-zinc-800 text-zinc-50 placeholder:text-zinc-400"
                        />
                    </FormControl>

                    <FormDescription className="text-zinc-400">
                        Letters, numbers, and underscores only.
                    </FormDescription>

                    {isCheckingUsername && (
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Checking username...
                        </div>
                    )}

                    {!isCheckingUsername && usernameMessage && (
                        <p
                        className={`text-sm ${
                            isUsernameAvailable
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                        >
                        {usernameMessage}
                        </p>
                    )}

                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        {...field}
                        className="border-zinc-700 bg-zinc-800 text-zinc-50 placeholder:text-zinc-400"
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...field}
                        className="border-zinc-700 bg-zinc-800 text-zinc-50 placeholder:text-zinc-400"
                        />
                    </FormControl>
                    <FormDescription className="text-zinc-400">
                        Use at least 6 characters.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <Button
                type="submit"
                variant="custom"
                className="w-full"
                disabled={isSubmitting || isCheckingUsername}
                >
                {isSubmitting ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                    </>
                ) : (
                    "Sign Up"
                )}
                </Button>
            </form>
            </Form>

            <div className="text-center text-zinc-400">
            <p>
                Already have an account?{" "}
                <Link
                href="/userSetup/sign-in"
                className="font-medium text-blue-500 hover:text-blue-400"
                >
                Sign in
                </Link>
            </p>
            </div>
        </div>
        </div>
    );
};

export default SignUpPage;