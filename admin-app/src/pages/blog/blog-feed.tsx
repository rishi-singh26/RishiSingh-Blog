import { useEffect } from "react"
import { AppSidebar } from "../../components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb"
import { Separator } from "../../components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar"
import { BlogDetail } from "./blog"
import { NavActions } from "../../components/nav-actions"
import { useFeedStore } from "../../store/feed"
import { getFeed } from "../../utils/feed"
// import useSystemTheme from "../../hooks/use-system-theme"
import { useAuthStore } from "../../store/auth"
import openSocket from "socket.io-client";
import { Blog } from "../../../src/types/blog"

export default function BlogFeed() {
  // const theme = useSystemTheme();
  const updateFeed = useFeedStore(state => state.updateFeed);
  const appendFeed = useFeedStore(state => state.appendFeed);
  const updateBlog = useFeedStore(state => state.updateBlog);
  const deleteBlog = useFeedStore(state => state.deleteBlog);
  const paginationData = useFeedStore(state => state.feedPagination);
  const showDrafts = useFeedStore(state => state.showDrafts);

  const accessToken = useAuthStore(state => state.accessToken);

  useEffect(() => {
    getFeedList();
    const socket = openSocket('/')
    socket.on('blogs', (data) => {
      if ((data.result.data as Blog).draft !== showDrafts) {
        return;
      }
      if (data.action === 'create') {
        appendFeed([data.result.data], paginationData, true);
      } else if (data.action === 'update') {
        updateBlog(data.result.data);
      } else if (data.action === 'delete') {
        deleteBlog(data.result.data);
      }
    });
    return () => {
      socket.off('blogs');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getFeedList = async () => {
    try {
      if (!accessToken) {
        return;
      }
      const { blogs, pagination } = await getFeed(accessToken, showDrafts)
      updateFeed(blogs, pagination);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    // <SidebarProvider className={theme}
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <div className="flex flex-1 items-center gap-2 pe-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Feeds</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Feed Name</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </header>
        <div className="p-0 h-full">
          <BlogDetail />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
