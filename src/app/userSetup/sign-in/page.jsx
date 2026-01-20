"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import axios, { AxiosError } from "axios"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"






const SignInPage = () => {
    const router = useRouter();
    const [isSigningIn, setIsSigningIn] = useState(false);

    // zod implementation
    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const handleGoogleSignIn = async () => {

        const result = await signIn("google", {
            callbackUrl: "/Dashboard",
        });

        if (result?.error) {
            console.error("Google Sign In Error:", result.error);
            toast.error("Google Sign In Failed", {
                description: "There was an issue connecting your Google account.",
            });
        }
    };

    const onSubmit = async (data) => {
        setIsSigningIn(true); // Start loading
        const result = await signIn('credentials', {
            redirect: false,
            email: data.email,
            password: data.password
        });
        setIsSigningIn(false);

        if (result?.error) {
            toast.error("Login Failed", {
                description: "Incorrect email or password.",
            });
            return;
        }

        if (result?.url) {
            router.replace('/dashboard')
        }
    }


    return (
        <div className="flex justify-center items-center min-h-screen bg-black">
            <div className="w-full max-w-md p-8 space-y-8 rounded-lg bg-zinc-900 shadow-2xl border border-zinc-700">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl text-zinc-50 font-extrabold tracking-tight mb-2">
                        Legal Clarity, Delivered.
                    </h1>
                    <p className="text-zinc-400">
                        Sign in to view critical data and secure documentation.
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="text-white space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="you@example.com"
                                            {...field}
                                            className="bg-zinc-800 border-zinc-700 placeholder:text-zinc-400 text-zinc-50" // Explicit dark mode styling
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
                                            {...field}
                                            className="bg-zinc-800 border-zinc-700 placeholder:text-zinc-400 text-zinc-50" // Explicit dark mode styling
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            variant="custom"
                            className="w-full"
                            disabled={isSigningIn}
                        >
                            {isSigningIn ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </Form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-zinc-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-zinc-900 px-2 text-zinc-400">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 h-10                   bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-50 transition-colors"
                        onClick={handleGoogleSignIn}
                    >
                        Sign in with Google
                    </Button>
                </div>

                <div className="text-center text-zinc-400 mt-4">
                    <p>
                        Not yet Signed Up?{' '}
                        <Link href="./sign-up" className="text-blue-500 hover:text-blue-400 font-medium">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignInPage

