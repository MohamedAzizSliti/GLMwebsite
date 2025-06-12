import {Component, ElementRef, HostListener, TemplateRef, ViewChild} from '@angular/core';
import { MainMenu, Menu, SideBar } from '../../../shared/models/models';
import { DataService } from '../../../shared/data/data.service';
import { CommonService } from '../../../shared/common/common.service';
import { NavigationEnd, Router } from '@angular/router';
import { SideBarService } from '../../../shared/side-bar/side-bar.service';
import { routes } from '../../../shared/routes/routes';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SettingService } from '../../../shared/settings/settings.service';
import {AccessDataService} from "../../../services/access-data.service";
import {NgxSpinnerService} from "ngx-spinner";
import {NotificationService} from "../../../services/notification.service";
import {ToastrService} from "ngx-toastr";
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {GlobalService} from "../../../services/global.service";


@Component({
    selector: 'app-default-header',
    templateUrl: './default-header.component.html',
    styleUrl: './default-header.component.scss',
    standalone: false
})
export class DefaultHeaderComponent {

  header: Array<SideBar> = [];
  base = 'dashboard';
  public page = '';
  last = '';
  isMobileMenu = false;
  isDropdownOpen=false;
  isDropdownOpen1=false;
  isHovered=false;
  ishome2=false;
  isheaderFour=false;
  show=false;
  isFixed = false;
  isdark=true;
  islight=false;
  themeColor = '2';
  public routes = routes;
  side_bar_data: MainMenu[] = [];
  password: boolean[] = [false, false]; // Add more as needed
  go : boolean = false
   togglePassword(index: number): void {
     this.password[index] = !this.password[index];
   }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Add a fixed class when the scroll position is greater than 50px
    this.isFixed = window.pageYOffset > 50;
  }
  mainMenus = [
    { title: 'Menu 1', separateRoute: false },
    { title: 'Menu 2', separateRoute: false },
    { title: 'Menu 3', separateRoute: false },
  ];
  openDropdownIndex: number | null = null;
  user : any = {email:null,password:null,password_confirmation:null,country_code:'+216',phone:null,role:'student'}
  currentUser : any = null;
   modalRef?: BsModalRef;
  constructor(
    private data: DataService,
    private sideBar: SideBarService,
    private spinner:NgxSpinnerService,
    private common: CommonService,
    private accessDataService:AccessDataService,
    private notificationService:NotificationService,
    private router: Router,
    private toastr:ToastrService,
    private modalService: BsModalService,
    private breakpointObserver: BreakpointObserver,
    public settings:SettingService,
    public globalService:GlobalService
  )
  {
    this.common.base.subscribe((res: string) => {
      this.base = res;
    });
    this.common.page.subscribe((res: string) => {
      this.page = res;
    });
    this.common.page.subscribe((res: string) => {
      this.last = res;
    });
    this.header = this.data.sideBar;
    this.settings.themeColor.subscribe((res: string) => {
      this.themeColor = res;
    });

    this.currentUser = this.globalService.getCurrentUser();
  }
  openRegisterModal() {
  }

  closeRegisterModal() {
  }

  elem = document.documentElement;
  fullscreen() {
    if (!document.fullscreenElement) {
      this.elem.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
  public togglesMobileSideBar(): void {
    this.sideBar.switchMobileSideBarPosition();
  }

  public expandSubMenus(menu: Menu): void {
    sessionStorage.setItem('menuValue', menu.menuValue);
    this.side_bar_data.map((mainMenus: MainMenu) => {
      mainMenus.menu.map((resMenu: Menu) => {
        // collapse other submenus which are open
        if (resMenu.menuValue === menu.menuValue) {
          menu.showSubRoute = !menu.showSubRoute;
          if (menu.showSubRoute === false) {
            sessionStorage.removeItem('menuValue');
          }
        } else {
          resMenu.showSubRoute = false;
        }
      });
    });
  }


    miniSideBarBlur(position: string) {
      if (position === 'over') {
        this.sideBar.expandSideBar.next(true);
      } else {
        this.sideBar.expandSideBar.next(false);
      }
    }

    miniSideBarFocus(position: string) {
      if (position === 'over') {
        this.sideBar.expandSideBar.next(true);
      } else {
        this.sideBar.expandSideBar.next(false);
      }
    }
    public submenus = false;
    openSubmenus() {
      this.submenus = !this.submenus;
    }
    ngOnInit(): void {
      this.openRegisterModal();
      this.breakpointObserver.observe(['(max-width: 991px)']).subscribe(result => {
        this.isMobileMenu = result.matches;
      });
      const themeColor = localStorage.getItem('themeColor') || '2';
      this.settings.changeThemeColor(themeColor);
    }
    closeMenu(): void {
      this.isMobileMenu = false; // Removes the `mean-container` class
      this.show=false;
    }
    addmenu():void{
      this.isMobileMenu = true;
      this.show=true;
    }
    openSubMenu():void{
      this.isDropdownOpen=!this.isDropdownOpen;
      this.openDropdownIndex=null;
    }
    toggleSubMenu(index: number): void {
      // If the clicked menu is already open, close it
      this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
      this.isDropdownOpen=false;
    }
    darkMode():void{
      this.isdark=!this.isdark;
      this.islight=!this.islight;
    }
    onSubmit0():void{
      this.router.navigateByUrl('/index')
    }

  logout(){
      localStorage.removeItem('user');
    this.router.navigateByUrl('/index')
  }

    connect(){
      this.spinner.show()
      this.accessDataService.postData(this.user,'login').subscribe(
            (response: any) => {
              // cacher après un certain temps ou une requête
              setTimeout(() => {
                this.spinner.hide();
              }, 2000);
              this.onSubmit0();
            },
            error => {
            },
            () => {
            }
          )
    }

  register(){
    this.spinner.show()
    this.accessDataService.postData(this.user,'register').subscribe(
      (response: any) => {
        // cacher après un certain temps ou une requête
        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
        if (response.success){
          this.go = true
          this.notificationService.showSuccess('Votre compte a été créé avec succès');
          localStorage.setItem('user',JSON.stringify(response.user));
          this.user = {email:null,password:null,password_confirmation:null,country_code:'+216',phone:null};
          this.onSubmit0();
        }
      },
      error => {

        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
        this.notificationService.showError(error.error.message)

      },
      () => {
      }
    )
  }
  login(){
    this.spinner.show()
    this.accessDataService.postData(this.user,'backend/login').subscribe(
      (response: any) => {
        // cacher après un certain temps ou une requête
        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
        if (response.success){
           this.notificationService.showSuccess('`Bienvenu à Gold LMS');
           localStorage.setItem('user',JSON.stringify(response.user));
          this.user = {email:null,password:null,password_confirmation:null,country_code:'+216',phone:null};
          this.onSubmit0();
        }
      },
      error => {

        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
        this.notificationService.showError(error.error.message)

      },
      () => {
      }
    )
  }
}
