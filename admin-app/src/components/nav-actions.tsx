"use client"

import * as React from "react"
import { MoreHorizontal, Star, Trash2, Edit } from "lucide-react"

import { Button } from "./ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar"
import { ConfirmationAlert } from "./alert"
import { useFeedStore } from "../store/feed"
// import useSystemTheme from "../hooks/use-system-theme"
import { cn } from "../utils/utils"
import { useAuthStore } from "../store/auth"
import { useNavigate } from "react-router-dom"

const data = [
  [
    {
      label: "Edit",
      icon: Edit,
    },
    {
      label: "Delete",
      icon: Trash2,
    },
    // {
    //   label: "Turn into wiki",
    //   icon: FileText,
    // },
  ],
  // [
  //   {
  //     label: "Copy Link",
  //     icon: Link,
  //   },
  //   {
  //     label: "Duplicate",
  //     icon: Copy,
  //   },
  //   {
  //     label: "Move to",
  //     icon: CornerUpRight,
  //   },
  // ],
  // [
  //   {
  //     label: "Undo",
  //     icon: CornerUpLeft,
  //   },
  //   {
  //     label: "View analytics",
  //     icon: LineChart,
  //   },
  //   {
  //     label: "Version History",
  //     icon: GalleryVerticalEnd,
  //   },
  //   {
  //     label: "Show delete pages",
  //     icon: Trash,
  //   },
  //   {
  //     label: "Notifications",
  //     icon: Bell,
  //   },
  // ],
  // [
  //   {
  //     label: "Import",
  //     icon: ArrowUp,
  //   },
  //   {
  //     label: "Export",
  //     icon: ArrowDown,
  //   },
  // ],
]

export function NavActions() {
  // const theme = useSystemTheme();
  const selectedBlog = useFeedStore(state => state.selectedBlog);
  const accessToken = useAuthStore(state => state.accessToken);
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = React.useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);

  const getDeleteConfirmation = (): void => {
    setShowDeleteAlert(true);
  }

  const handleDeleteResponse = async (val: boolean): Promise<void> => {
    try {
      setShowDeleteAlert(false);
      if (!val || !selectedBlog || !accessToken) {
        return;
      }
      const url = `http://localhost:8080/blog/${selectedBlog.id}`;
      await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
        method: "DELETE",
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleMenuClick = (menu: { label: string }): void => {
    switch (menu.label) {
      case 'Delete':
        getDeleteConfirmation();
        break;
      default:
        break;
    }
  }

  const getIconColor = (): 'black' | 'white' => {
    // return theme === "dark" ? 'white' : 'black';
    return 'black'
  }

  const navigateToEditBlog = () => {
    navigate('/edit-blog', { state: { isEditing: true } })
  }

  if (!selectedBlog) {
    return null;
  }
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="hidden font-medium text-muted-foreground md:inline-block">
        {`Edit ${new Date(selectedBlog.updatedAt).toDateString()}`}
      </div>
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <Star color={getIconColor()} />
      </Button>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={user?.id !== selectedBlog.User.id}
            variant="ghost"
            size="icon"
            className="h-7 w-7 data-[state=open]:bg-accent"
          >
            <MoreHorizontal color={getIconColor()} />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          // className={cn("w-56 overflow-hidden rounded-lg p-0", theme)}
          className={cn("w-56 overflow-hidden rounded-lg p-0")}
          align="end"
        >
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              {data.map((group, index) => (
                <SidebarGroup key={index} className="border-b last:border-none">
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      {group.map((item, index) => {
                        if (item.label === 'Edit') {
                          return (
                            <SidebarMenuItem key={index} onClick={navigateToEditBlog}>
                              <SidebarMenuButton>
                                <item.icon /> <span>{item.label}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        }
                        return (
                          <SidebarMenuItem key={index} onClick={(() => handleMenuClick(item))}>
                            <SidebarMenuButton>
                              <item.icon /> <span>{item.label}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
      <ConfirmationAlert
        open={showDeleteAlert}
        setOpen={handleDeleteResponse}
        title="Are you sure?"
        message="This action cannot be undone. This will permanently delete your blog."
      />
    </div>
  )
}
