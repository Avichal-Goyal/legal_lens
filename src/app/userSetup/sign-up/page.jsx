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
import { signUpSchema } from "@/schemas/signUpSchema"


const SignUpPage = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter();


    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        const checkUniqueUsername = async () => {
            try {
                if(username) {
                    setIsCheckingUsername(true)
                    setUsernameMessage('')

                    const response = await axios.get(`/api/auth/check-unique-username?username=${username}`)
                    let message = response.data.message;
                    setUsernameMessage(message)

                }
            } catch (error) {
                let message = 'An error occurred.';
                if (error instanceof AxiosError) {
                    // Get the error message from the API response
                    message = error.response?.data?.message || 'Error checking username.';
                } else if (error instanceof Error) {
                    message = error.message;
                }
                setUsernameMessage(message);
            } finally {
                setIsCheckingUsername(false)
            }
        }

        checkUniqueUsername();
    }, [username])


    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true)
            const response = await axios.post("/api/auth/register", data)
            toast.success("Success", {
                description: response.data.message,
            })
            router.replace(`/verify/${username}`);

            setIsSubmitting(false);
        } catch (error) {
            console.error("Error in user signup", error);

            let errorMessage = "Registration failed. Please try again.";
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.message || "Server error";
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error("Failed", {
                description: errorMessage,
            });
        } finally {
            setIsSubmitting(false)
        }
    }


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Legal Clarity, Delivered.</h1>
                    <p className="mb-4">Sign in to view critical data and secure documentation.</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="username"
                                    {...field}
                                    onChange = {(e) => {
                                        field.onChange(e)
                                        debounced(e.target.value)
                                    }}
                                    />
                                </FormControl>
                                <FormDescription>This is your public display name.</FormDescription>
                                {isCheckingUsername && <Loader2 className="animate-spin" />}
                                <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                                    test {usernameMessage}
                                </p>
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
                                    placeholder="email"
                                    {...field}
                                    />
                                </FormControl>
                                <FormDescription>This is your public display name.</FormDescription>
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
                                    placeholder="password"
                                    {...field}
                                    />
                                </FormControl>
                                <FormDescription>This is your public display name.</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            { isSubmitting ? (
                                <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>
                                </>
                            ) : ('SignUp')
                            }
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="./sign-in"className="text-blue-600 hover:text-blue-800">
                        Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage