// import { Link } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod';

import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form'
import { Input } from '../../components/ui/input'
// import useSystemTheme from '../../hooks/use-system-theme';
import { cn } from '../../utils/utils';
import { useForm } from 'react-hook-form';
import { loginSchema } from '../../utils/schema';
import { useAuthStore } from '../../store/auth';

function Login() {
    // const theme = useSystemTheme();
    const setAuthenticated = useAuthStore(state => state.setAuthenticated);

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    })

    const login = async (values: z.infer<typeof loginSchema>) => {
        try {
            let url = 'http://localhost:8080/auth/login';
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' }
            });
            const json = await response.json();
            if (response.ok) {
                setAuthenticated(json.data);
            } else {
                form.setError(json.errorPath[0], { type: 'server', message: json.message });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getBgClass = (): 'bg-black' | 'bg-white' => {
        // return theme === "dark" ? 'bg-black' : 'bg-white';
        return 'bg-white'
    }

    return (
        <div className={cn("flex h-screen w-full items-center justify-center px-4", getBgClass())}>
            {/* <Card className={cn("mx-auto max-w-sm", theme)}> */}
            <Card className={cn("mx-auto max-w-sm")}>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(login)} className="space-y-4">
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
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                            {/* <Button type="button" variant="outline" className="w-full">
                                SingUp with Google
                            </Button> */}
                        </form>
                    </Form>
                    {/* <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link to="/signup" className="underline">
                            Sign up
                        </Link>
                    </div> */}
                </CardContent>
            </Card>
        </div>
    )
}

export default Login;