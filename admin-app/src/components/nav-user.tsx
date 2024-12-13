import { ChevronsUpDown, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar"
import { useAuthStore } from "../store/auth"
// import useSystemTheme from "../hooks/use-system-theme"
import { cn } from "../utils/utils"
import { ConfirmationAlert } from "./alert"

export function NavUser() {
  // const theme = useSystemTheme();
  const { isMobile } = useSidebar();
  const user = useAuthStore(state => state.user);
  const refreshToken = useAuthStore(state => state.refreshToken);
  const setUnAuthenticated = useAuthStore(state => state.setUnAuthenticated);
  const showLogoutConfirmDialog = useAuthStore(state => state.showLogoutConfirmDialog);
  const setLogoutConfirmDialog = useAuthStore(state => state.setLogoutConfirmDialog);

  const getLogoutConfirmation = (): void => {
    setLogoutConfirmDialog(true);
  }

  const handleLogout = async (val: boolean): Promise<boolean> => {
    try {
      setLogoutConfirmDialog(false);
      if (!refreshToken || !val) {
        return false;
      }
      const response = await fetch('http://localhost:8080/auth/logout', {
        headers: { 'Content-Type': 'application/json' },
        method: "POST",
        body: JSON.stringify({ refreshToken })
      });
      setUnAuthenticated();
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={`https://api.dicebear.com/9.x/identicon/svg?seed=${user?.name ?? 'feedlyp'}`}
                    alt={user?.name ?? ''}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name ?? ''}</span>
                  <span className="truncate text-xs">{user?.email ?? ''}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              // className={cn("w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg", theme)}
              className={cn("w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg")}
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              {/* <DropdownMenuLabel className={cn("p-0 font-normal", theme)}> */}
              <DropdownMenuLabel className={cn("p-0 font-normal")}>
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={`https://api.dicebear.com/9.x/identicon/svg?seed=${user?.name ?? 'feedlyp'}`}
                      alt={user?.name ?? ''}
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name ?? ''}</span>
                    <span className="truncate text-xs">{user?.email ?? ''}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={getLogoutConfirmation}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <ConfirmationAlert
        open={showLogoutConfirmDialog}
        setOpen={handleLogout}
        title="Are you sure?"
        message="This action cannot be undone. You will have to login again to access your feed!"
      />
    </>
  )
}
