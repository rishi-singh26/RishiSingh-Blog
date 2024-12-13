import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../../components/ui/breadcrumb"
import { AddBlogForm } from "../../components/add-blog-form"
import { Link, useLocation } from "react-router-dom"

export default function AddBlog() {
    const location = useLocation();

    return (
        <div>
            <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
                <div className="flex flex-1 items-center gap-2 pe-3">
                    {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <Link to='/'>Blog</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Add Blog</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="h-full add-blog-form__container">
                <AddBlogForm editing={location.state?.isEditing} />
            </div>
        </div>
    )
}
