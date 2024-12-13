import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from '../../components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
// import useSystemTheme from '../../hooks/use-system-theme';
import { cn } from '../../utils/utils';
import { signupSchema } from '../../utils/schema';


function Login() {
    // const theme = useSystemTheme();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const signUp = async (values: z.infer<typeof signupSchema>) => {
        try {
            let url = 'http://localhost:8080/auth/signup';
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' }
            });
            const json = await response.json();
            if (response.ok) {
                navigate('/');
            } else if (json.path && json.message) {
                form.setError(json.path[0], { type: 'server', message: json.message});
            } else if (json.message && !json.path) {
                // Map server errors to react-hook-form's setError
                JSON.parse(json.message).forEach((error: any) => {
                    form.setError(error.path[0], { type: 'server', message: error.message });
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getBgClass = (): 'bg-black' | 'bg-white' => {
        // return theme === "dark" ? 'bg-black' : 'bg-white';
        return 'bg-white';
    }

    return (
        <div className={cn("flex h-screen w-full items-center justify-center px-4", getBgClass())}>
            {/* <Card className={cn("mx-auto max-w-sm", theme)}> */}
            <Card className={cn("mx-auto max-w-sm")}>
                <CardHeader>
                    <CardTitle className="text-2xl">SignUp</CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(signUp)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="your name" {...field} />
                                        </FormControl>
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
                                            <Input placeholder="me@example.com" {...field} />
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
                                            <Input type='password' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Repeat password</FormLabel>
                                        <FormControl>
                                            <Input type='password' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">
                                SingUp
                            </Button>
                            {/* <Button type="button" variant="outline" className="w-full">
                                SingUp with Google
                            </Button> */}
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link to="/" className="underline">
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Login;