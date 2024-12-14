import { PaginationData } from "../types/pagination";
import { Blog } from "../types/blog";

export const getFeed = async (token: string, showDraft: boolean, pageNum: number = 1): Promise<{ blogs: Blog[], pagination: PaginationData | null }> => {
    try {
        const response = await fetch(`/blog?page=${pageNum}&draft=${showDraft}`, {
            headers: { Authorization: `Bearer ${token}`}
        });
        const json = await response.json();
        if (response.status === 200) {
            return { blogs: json.data.blogs, pagination: json.data.pagination };
        }
        return { blogs: [], pagination: null };
    } catch (error) {
        console.log(error);
        return { blogs: [], pagination: null };
    }
}