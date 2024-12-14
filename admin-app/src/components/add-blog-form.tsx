import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useFeedStore } from "../store/feed"
import { addBlogSchema } from "../utils/schema"
import { useAuthStore } from "../store/auth"
import { Textarea } from "./ui/textarea"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { useNavigate } from "react-router-dom"
import { StatusCodes } from "http-status-codes"

export function AddBlogForm({ editing }: { editing?: boolean }) {
    const selectedBlog = useFeedStore(state => state.selectedBlog);
    const accessToken = useAuthStore(state => state.accessToken);
    const navigate = useNavigate();


    const blogForm = useForm<z.infer<typeof addBlogSchema>>({
        resolver: zodResolver(addBlogSchema),
        defaultValues: editing && selectedBlog ? {
            title: selectedBlog.title,
            description: selectedBlog.description,
            html: selectedBlog.html,
            thumbnailUrl: selectedBlog.thumbnailUrl,
            canonicalUrl: selectedBlog.canonicalUrl,
            isDraft: selectedBlog.draft,
            tags: selectedBlog.tags,
        } : {
            title: "",
            description: "",
            html: "",
            thumbnailUrl: "",
            canonicalUrl: "",
            isDraft: true,
            tags: "",
        },
    })

    const addBlog = async (values: z.infer<typeof addBlogSchema>) => {
        if (!accessToken) {
            return;
        }
        let url = 'http://localhost:8080/blog';
        if (editing && selectedBlog) {
            url = `http://localhost:8080/blog/${selectedBlog.id}`;
        }
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            method: editing ? "PUT" : "POST",
            body: JSON.stringify(values),
        });
        if (response.status === StatusCodes.CREATED || response.status === StatusCodes.OK) {
            navigateBack();
        }
    }

    const navigateBack = () => {
        navigate(-1); // go back
    }

    return (
        <Form {...blogForm}>
            <form onSubmit={blogForm.handleSubmit(addBlog)} className="space-y-8">
                <FormField
                    control={blogForm.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Blog title" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your blog's title.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={blogForm.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Blog description" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your blog's description.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={blogForm.control}
                    name="html"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content HTML</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Blog HTML" {...field} maxLength={65500}></Textarea>
                            </FormControl>
                            <FormDescription>
                                This is your blog's content HTML.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={blogForm.control}
                    name="thumbnailUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Thumbnail URL</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Blog thumbnail" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your blog's thumbnail.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={blogForm.control}
                    name="canonicalUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Canonical Url</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Canonical URl" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your blog's content Canonical.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={blogForm.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>BLog Tags</FormLabel>
                            <FormControl>
                                <Input placeholder="Blog Tags" {...field} />
                            </FormControl>
                            <FormDescription>
                                Put your tags, comma seperated without spaces.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={blogForm.control}
                    name="isDraft"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Label className="flex items-center gap-2 text-sm">
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    <span>Is this blog a draft? </span>
                                </Label>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2">
                    <Button onClick={navigateBack} type="button" variant="secondary">Cancel</Button>
                    <Button type="submit">{editing ? 'Update' : 'Add Blog'}</Button>
                </div>
            </form>
        </Form>
    )
}