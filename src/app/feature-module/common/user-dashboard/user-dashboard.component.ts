import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from '../../../shared/routes/routes';
import { SideBar2, SideBarMenu, SubMenu, SubMenu2, SubMenuTwo } from '../../../shared/models/models';
import { CommonService } from '../../../shared/common/common.service';
import { DataService } from '../../../shared/data/data.service';
import {GlobalService} from "../../../services/global.service";

@Component({
  selector: 'app-user-dashboard',
  standalone: false,
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent {
  public routes = routes;
  base = '';
  page = '';
  last = '';
  isSubdrop: boolean = false; // Default state of submenu
  isOpen=false;
  side_bar_data: SideBar2[] = [];
  public sideBar2: Array<SideBar2> = [];
  user:any;
  userRole: string = '';

  shouldSubdrop(menu: any): boolean {
    return this.isSubdrop || this.page === 'customer-flight-booking';
  }

  constructor(
    private common: CommonService,
    public globalService:GlobalService,
    private data: DataService,
    private router: Router
  ) {
    this.user = this.globalService.getCurrentUser();
    this.loadSidebarBasedOnRole();
    this.setupCommonSubscriptions();
  }

  private loadSidebarBasedOnRole(): void {
    // Determine user role using GlobalService method for consistency
    this.userRole = this.globalService.getRole() || 'student';
    console.log('User role detected:', this.userRole);
    console.log('Current user:', this.user);

    // Set sidebar based on role and update dashboard route dynamically
    if (this.userRole === 'teacher') {
      this.sideBar2 = this.data.getTeacherSideBar();
      console.log('Loading teacher sidebar');
      console.log('Teacher sidebar data:', this.sideBar2);
    } else {
      this.sideBar2 = this.data.getStudentSideBar();
      console.log('Loading student sidebar');
      console.log('Student sidebar data:', this.sideBar2);
    }

    // Also load through the observable for consistency
    this.data.getSideBarByRole(this.userRole).subscribe((res: SideBar2[]) => {
      this.side_bar_data = res;
      console.log('Sidebar data from observable:', this.side_bar_data);
    });
  }

  private setupCommonSubscriptions(): void {
    this.common.base.subscribe((base: string) => {
      this.base = base;
    });
    this.common.page.subscribe((page: string) => {
      this.page = page;
    });
    this.common.last.subscribe((last: string) => {
      this.last = last;
    });
  }
onOpen():void{
  this.isSubdrop=!this.isSubdrop;
}
toggleSubmenu(menu: any): void {
  if (this.page === 'customer-flight-booking') {
      this.isSubdrop = !this.isSubdrop;
  } else {
      this.isSubdrop = !this.isSubdrop; // Reset when not on specific page
  }
}
public expandSubMenus(menu: any): void {
  sessionStorage.setItem('menuValue', menu.menuValue);
  this.sideBar2.map((mainMenus: any) => {
    mainMenus.menu.map((resMenu: any) => {
      // collapse other submenus which are open
      if (resMenu.menuValue === menu.menuValue) {
        menu.showSubRoute = !menu.showSubRoute;

      } else {
        resMenu.showSubRoute = false;
      }
    });
  });
}
public expandSubMenusActive(): void {
  const activeMenu = sessionStorage.getItem('menuValue');
  if(activeMenu === null) {
    this.sideBar2.map((mainMenus: any) => {
      mainMenus.menu.map((resMenu: any) => {
        // collapse other submenus which are open
        if (resMenu.menuValue === 'customer-flight-booking'||'customer-hotel-booking' ||'customer-car-booking' ||'customer-cruise-booking' ||'customer-tour-booking') {
          resMenu.showSubRoute = true;

        } else {
          resMenu.showSubRoute = false;
        }
      });
    });
  }
  this.sideBar2.map((mainMenus: SideBar2) => {
    mainMenus.menu.map((resMenu: SideBarMenu) => {
      // collapse other submenus which are open
      if (resMenu.menuValue === activeMenu) {
        resMenu.showSubRoute = true;

      } else {
        resMenu.showSubRoute = false;
      }
    });
  });
}
ngOnInit(): void {
  this.expandSubMenusActive();
  // Force refresh of sidebar data to ensure it's current
  this.refreshSidebar();
}

ngOnDestroy(): void {
  this.data.resetData2();
}

// Method to refresh sidebar based on current user role
public refreshSidebar(): void {
  const currentRole = this.globalService.getRole() || 'student';
  if (currentRole !== this.userRole) {
    console.log('Role changed from', this.userRole, 'to', currentRole);
    this.userRole = currentRole;
    this.loadSidebarBasedOnRole();
  }
}

// Handle menu click - special handling for logout
public handleMenuClick(menu: any, event?: Event): void {
  if (menu.menuValue === 'Logout') {
    if (event) {
      event.preventDefault();
    }
    this.logout();
  }
}

// Logout method
public logout(): void {
  // Clear user data from localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('auth_token');

  // Navigate to login page
  this.router.navigate([routes.login]);
}

// TrackBy function for ngFor performance
public trackByFn(index: number, item: any): any {
  return item.id || item.menuValue || index;
}
}
