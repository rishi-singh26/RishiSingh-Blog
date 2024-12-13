import * as React from "react"
import { Plus, Inbox, DownloadIcon } from "lucide-react"

import { NavUser } from "./nav-user"
import { Label } from "./ui/label"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar"
import { Switch } from "./ui/switch"
import { cn } from "../utils/utils"
import { useFeedStore } from "../store/feed"
import { getFeed } from "../utils/feed"
// import useSystemTheme from "../hooks/use-system-theme"
import { useAuthStore } from "../store/auth"
import { useNavigate } from "react-router-dom"


// This is sample data
const sideNavData = [
  {
    title: "Blogs",
    url: "/",
    icon: Inbox,
    isActive: true,
  },
]

export function AppSidebar() {
  // const theme = useSystemTheme();

  const feed = useFeedStore(state => state.feed);
  const selectedPostIndex = useFeedStore(state => state.selectedBlogIndex);
  const updateSelectedBlog = useFeedStore(state => state.updateSelectedBlog);
  const paginationData = useFeedStore(state => state.feedPagination);
  const updateFeed = useFeedStore(state => state.updateFeed);
  const appendFeed = useFeedStore(state => state.appendFeed);
  const showDrafts = useFeedStore(state => state.showDrafts);
  const setShowDrafts = useFeedStore(state => state.setShowDrafts);

  const accessToken = useAuthStore(state => state.accessToken);

  const [activeItem, setActiveItem] = React.useState(sideNavData[0]);
  const { setOpen } = useSidebar()
  const navigate = useNavigate();

  const navigateToAddBLog = () => {
    navigate('/add-blog')
  }

  const handleShowDraftChange = async (val: boolean) => {
    try {
      if (!accessToken) {
        return;
      }
      updateSelectedBlog(-1);
      setShowDrafts(val);
      const { blogs, pagination } = await getFeed(accessToken, val, paginationData?.currentPage || 1)
      updateFeed(blogs, pagination);
    } catch (error) {
      console.log(error);
    }
  }

  const getFeedList = async () => {
    try {
      if (!accessToken) {
        return;
      }
      const { blogs, pagination } = await getFeed(accessToken, showDrafts, (paginationData?.currentPage || 0) + 1)
      appendFeed(blogs, pagination);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
    // {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {sideNavData.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{ children: item.title, hidden: false }}
                      onClick={() => {
                        setActiveItem(item)
                        setOpen(true)
                      }}
                      isActive={activeItem.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={navigateToAddBLog} tooltip={{ children: 'Add Post', hidden: false }} className="px-2.5 md:px-2" >
                    <Plus />
                    <span>New Post</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {activeItem.title}
            </div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Drafts</span>
              <Switch className="shadow-none" checked={showDrafts} onCheckedChange={handleShowDraftChange} />
            </Label>
          </div>
          <SidebarInput placeholder="Type to search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {feed.map((post, index) => (
                <div
                  key={post.id}
                  className={cn("flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 cursor-pointer", index === selectedPostIndex ? " bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")} onClick={() => updateSelectedBlog(index)}
                >
                  <div className="flex w-full items-center gap-2">
                    <span className="font-medium line-clamp-1 w-[150px]">{post.title}</span>{" "}
                    <span className="ml-auto text-xs">{new Date(post.createdAt).toDateString()}</span>
                  </div>
                  {/* <span className="font-medium">{post.title}</span> */}
                  <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
                    {post.description}
                  </span>
                </div>
              ))}
              {(paginationData?.currentPage || 0) < (paginationData?.totalPages || 0) && <div
                key={'paginator'} onClick={getFeedList}
                className="flex flex-col items-center border-b p-2 mb-3 text-sm leading-tight cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <div className="flex w-full justify-center items-center gap-2">
                  <DownloadIcon size={17} />
                  <span className="font-medium">Load More</span>
                </div>
              </div>}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
