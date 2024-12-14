import { useFeedStore } from "../../store/feed";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import SanitizedHtmlComponent from "../../components/sanitized-html";

export function BlogDetail() {
    const selectedBlog = useFeedStore(state => state.selectedBlog);

    if (!selectedBlog) {
        return null;
    }
    return (
        <Card className="mx-auto h-full border-0 blog-container">
            <CardHeader>
                <CardTitle className="text-2xl">{selectedBlog.title}</CardTitle>
                <CardDescription>
                    {`${selectedBlog?.User?.name ? `Created by ${selectedBlog?.User?.name}, ` : ''}${new Date(selectedBlog.createdAt).toDateString()}`}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex w-full align-middle">
                    <img src={`${selectedBlog.thumbnailUrl}`} alt={selectedBlog.title} />
                </div>
                <SanitizedHtmlComponent htmlString={selectedBlog.html}></SanitizedHtmlComponent>
            </CardContent>
        </Card>
    );
}