import { Injectable } from '@angular/core';
import { routes } from '../routes/routes';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiResultFormat, MainMenu, SideBar, SideBar2, SideBarMenu } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private collapseSubject = new BehaviorSubject<boolean>(false);
  collapse$ = this.collapseSubject.asObservable();

  toggleCollapse() {
    this.collapseSubject.next(!this.collapseSubject.value);
  }
  constructor(private http: HttpClient) {}
  public getDataTable(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/data-tables.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getFlightBooking(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/flight-booking.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getEnquiry(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/enquiry.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getEarnings(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/earning.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getwithdraw(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/withdraw.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getHotelBooking(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/hotel-booking.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getCarBooking(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/car-booking.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getCruiseBooking(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/cruise-booking.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getTourBooking(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/tour-booking.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getWallet(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/wallet.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getPayment(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/payment.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getAgentDashboard(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/agent-dashboard.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getAgentHotel(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/agent-hotel-booking.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getAgentFlight(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/agent-flight-booking.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getAgentCar(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/agent-car-booking.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getAgentCruise(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/agent-cruise-booking.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getAgentTour(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/agent-tour-booking.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public sideBar2 : SideBar2[]=[
    {
      tittle:'Main',
      base:'user',
      showAsTab: false,
      separateRoute: false,
      menu:[
        {
          menuValue: 'sidebar.dashboard',
          route: routes.userDashboard,
          hasSubRoute: false,
          showSubRoute: false,
          base: 'dashboard',
          page: '',
          last: '',
          subMenus: [],
          icon:'isax-grid-55'
        },
        {
          menuValue: 'sidebar.chat_assistant',
          route: routes.chatAssistant,
          hasSubRoute: false,
          showSubRoute: false,
          base: 'chat-assistant',
          page: '',
          last: '',
          subMenus: [],
          icon:'isax-message-question'
        },
        {
          menuValue: 'sidebar.my_courses',
          route: routes.review,
          hasSubRoute: false,
          showSubRoute: false,
          base: 'review',
          page: '',
          last: '',
          subMenus: [],
          icon:'fa fa-book'
        }
      ]
    },

    {
      tittle:'Account',
      base:'my-profile',
      showAsTab: false,
      separateRoute: false,
      menu:[
        {
          menuValue: 'Mon Profil',
          route: routes.myProfile,
          hasSubRoute: false,
          showSubRoute: false,
          base: 'my-profile',
          page: '',
          last: '',
          subMenus: [],
          icon:'isax-profile-tick5'
        },
        {
          menuValue: 'Logout',
          route: routes.index,
          hasSubRoute: false,
          showSubRoute: false,
          base: 'index',
          page: '',
          last: '',
          subMenus: [],
          icon:'isax-notification-bing5'
        },
      ]
    }
  ]
  public getSideBarData2: BehaviorSubject<Array<SideBar2>> = new BehaviorSubject<
  Array<SideBar2>
  >(this.sideBar2);
  public agentSideBar : SideBar2[]=[
    {
      tittle:'Main',
      base:'dashboard',
      showAsTab: false,
      separateRoute: false,
      menu:[
        {
          menuValue: 'Dashboard',
          route: routes.agentDashboard,
          hasSubRoute: false,
          showSubRoute: false,
          base: 'agent-dashboard',
          page: '',
          last: '',
          subMenus: [],
          icon:'isax-grid-55'
        },
        {
          menuValue: 'Listings',
          route: routes.agentListings,
          hasSubRoute: false,
          showSubRoute: false,
          base: 'listings',
          page: '',
          last: '',
          subMenus: [],
          icon:'isax-menu-14'
        },
        {
          menuValue: 'Bookings',
          hasSubRoute: true,
          showSubRoute: false,
          icon:'isax-calendar-tick5',
          base:'fligt-booking',
          base2:'hotel-booking',
          base3:'car-booking',
          base4:'cruise-booking',
          base5:'tour-booking',
          subMenus: [
            {
              menuValue: 'Hotels',
              route: routes.agentHotelBooking,
              hasSubRoute: false,
              base: "hotel-booking"
            },
            {
              menuValue: 'Cars',
              route: routes.agentCarBooking,
              hasSubRoute: false,
              base: "car-booking"
            },
            {
              menuValue: 'Cruise',
              route: routes.agentCruiseBooking,
              hasSubRoute: false,
              base: "cruise-booking"
            },
            {
              menuValue: 'Tour',
              route: routes.agentTourBooking,
              hasSubRoute: false,
              base: "tour-booking"
            },
            {
              menuValue: 'Flights',
              route: routes.agentFlightBooking,
              hasSubRoute: false,
              base: "fligt-booking"
            },



          ],
        },
        {
          menuValue: 'Enquiries',
          route: routes.agentEnquirers,
          hasSubRoute: false,
          showSubRoute: false,
          base: 'enquirers',
          page: '',
          last: '',
          subMenus: [],
          icon:'isax-magic-star5'
        },
        {
          menuValue: 'Earnings',
          route: routes.agentEarnings,
          hasSubRoute: false,
          showSubRoute: false,
          base: 'earnings',
          page: '',
          last: '',
          subMenus: [],
          icon:'isax-wallet-add-15'
        },
        {
          menuValue: 'Reviews',
          route: routes.agentReview,
          hasSubRoute: false,
          showSubRoute: false,
          base: 'reviews',
          page: '',
          last: '',
          subMenus: [],
          icon:'isax-magic-star5'
        },
        {
          menuValue: 'Settings',
          route: routes.agentSettings,
          hasSubRoute: false,
          showSubRoute: false,
          base: 'settings',
          base2:'account-settings',
          base3:'security-settings',
          base4:'plans-settings',
          page: '',
          last: '',
          subMenus: [],
          icon:'isax-setting-25'
        },

      ]
    },

  ]
  public getAgentSideBar: BehaviorSubject<Array<SideBar2>> = new BehaviorSubject<
  Array<SideBar2>
  >(this.agentSideBar);

  // Teacher Sidebar
  public teacherSideBar : SideBar2[]=[
    {
      tittle:'Main',
      base:'user',
      showAsTab: false,
      separateRoute: false,
      menu:[
        {
          menuValue: 'nav.dashboard',
          route: routes.teacherDashboard, // Teacher dashboard route
          hasSubRoute: false,
          showSubRoute: false,
          base: 'teacher-dashboard',
          page: '',
          last: '',
          subMenus: [],
          icon:'isax isax-grid-55'
        },
        {
          menuValue: 'sidebar.my_courses',
          route: routes.review,
          hasSubRoute: false,
          showSubRoute: false,
          base: 'review',
          page: '',
          last: '',
          subMenus: [],
          icon:'isax isax-book-15'
        },
        {
          menuValue: 'sidebar.add_course',
          route: routes.addCourse,
          hasSubRoute: false,
          showSubRoute: false,
          base: 'add-course',
          page: '',
          last: '',
          subMenus: [],
          icon:'isax isax-add-circle'
        },
        {
          menuValue: 'header.students',
          route: routes.certificationManagement,
          hasSubRoute: false,
          showSubRoute: false,
          base: 'certification-management',
          page: '',
          last: '',
          subMenus: [],
          icon:'isax isax-people'
        },
        {
          menuValue: 'header.certifications',
          route: routes.certificationManagement,
          hasSubRoute: false,
          showSubRoute: false,
          base: 'certification-management',
          page: '',
          last: '',
          subMenus: [],
          icon:'isax isax-award'
        }
      ]
    },
    {
      tittle:'Account',
      base:'my-profile',
      showAsTab: false,
      separateRoute: false,
      menu:[
        {
          menuValue: 'Mon Profil',
          route: routes.myProfile,
          hasSubRoute: false,
          showSubRoute: false,
          base: 'my-profile',
          page: '',
          last: '',
          subMenus: [],
          icon:'isax-profile-tick5'
        },
        {
          menuValue: 'Logout',
          route: routes.index,
          hasSubRoute: false,
          showSubRoute: false,
          base: 'logout',
          page: '',
          last: '',
          subMenus: [],
          icon:'isax-notification-bing5'
        },
      ]
    }
  ];

  public getTeacherSideBarData: BehaviorSubject<Array<SideBar2>> = new BehaviorSubject<
  Array<SideBar2>
  >(this.teacherSideBar);

  public resetData2(): void {
    this.sideBar2.map((res: SideBar2) => {
      res.showAsTab = false;
      res.menu.map((menus: SideBarMenu) => {
        menus.showSubRoute = false;
      });
    });
  }
  public sideBar: SideBar[] = [
    {
      tittle: 'Accueil',
      base: 'index',
      showAsTab: false,
      separateRoute: true,
      route: routes.home,
      menu: [
      ],
    },
    {
      tittle: 'Cours',
      base: 'hotel',
      showAsTab: false,
      separateRoute: false,
      twoTitle:false,
      route:routes.hotelGrid,
      menu: [
      ],
    },
    {
      tittle: 'A Propos',
      base: 'car',
      subTitle:'Car Booking',
      showAsTab: false,
      route: routes.aboutUs,
      separateRoute: false,
      twoTitle:false,
      menu: [
      ],
    },
    {
      tittle: 'Contact',
      base: 'cruise',
      route: routes.contactUs,
      subTitle:'Cruise Booking',
      showAsTab: false,
      separateRoute: false,
      twoTitle:false,
      img: 'assets/img/menu/cruise.jpg',
      menu: [
      ],
    },
  ];
  public getSideBarData: BehaviorSubject<Array<SideBar>> = new BehaviorSubject<
  Array<SideBar>
  >(this.sideBar);

  // Method to get student sidebar with correct dashboard route
  public getStudentSideBar(): SideBar2[] {
    return [
      {
        tittle:'Main',
        base:'user',
        showAsTab: false,
        separateRoute: false,
        menu:[
          {
            menuValue: 'sidebar.dashboard',
            route: routes.userDashboard, // Student dashboard route
            hasSubRoute: false,
            showSubRoute: false,
            base: 'dashboard',
            page: '',
            last: '',
            subMenus: [],
            icon:'isax isax-grid-55'
          },
          {
            menuValue: 'sidebar.chat_assistant',
            route: routes.chatAssistant,
            hasSubRoute: false,
            showSubRoute: false,
            base: 'chat-assistant',
            page: '',
            last: '',
            subMenus: [],
            icon:'isax isax-message-question'
          },
          {
            menuValue: 'sidebar.my_enrollments',
            route: routes.myEnrollments,
            hasSubRoute: false,
            showSubRoute: false,
            base: 'my-enrollments',
            page: '',
            last: '',
            subMenus: [],
            icon:'isax isax-book-saved'
          },
          {
            menuValue: 'sidebar.my_courses',
            route: routes.review,
            hasSubRoute: false,
            showSubRoute: false,
            base: 'review',
            page: '',
            last: '',
            subMenus: [],
            icon:'isax isax-book-15'
          }
        ]
      },
      {
        tittle:'Account',
        base:'user',
        showAsTab: false,
        separateRoute: false,
        menu:[
          {
            menuValue: 'header.profile',
            route: routes.myProfile,
            hasSubRoute: false,
            showSubRoute: false,
            base: 'my-profile',
            page: '',
            last: '',
            subMenus: [],
            icon:'isax isax-profile-circle'
          },
          {
            menuValue: 'nav.logout',
            route: routes.login,
            hasSubRoute: false,
            showSubRoute: false,
            base: 'logout',
            page: '',
            last: '',
            subMenus: [],
            icon:'isax isax-logout'
          }
        ]
      }
    ];
  }

  // Method to get teacher sidebar with correct dashboard route
  public getTeacherSideBar(): SideBar2[] {
    return [
      {
        tittle:'Main',
        base:'user',
        showAsTab: false,
        separateRoute: false,
        menu:[
          {
            menuValue: 'nav.dashboard',
            route: routes.teacherDashboard, // Teacher dashboard route
            hasSubRoute: false,
            showSubRoute: false,
            base: 'teacher-dashboard',
            page: '',
            last: '',
            subMenus: [],
            icon:'isax isax-grid-55'
          },
          {
            menuValue: 'sidebar.my_courses',
            route: routes.review,
            hasSubRoute: false,
            showSubRoute: false,
            base: 'review',
            page: '',
            last: '',
            subMenus: [],
            icon:'isax isax-book-15'
          },
          {
            menuValue: 'sidebar.add_course',
            route: routes.addCourse,
            hasSubRoute: false,
            showSubRoute: false,
            base: 'add-course',
            page: '',
            last: '',
            subMenus: [],
            icon:'isax isax-add-circle'
          },
          {
            menuValue: 'header.students',
            route: routes.certificationManagement,
            hasSubRoute: false,
            showSubRoute: false,
            base: 'certification-management',
            page: '',
            last: '',
            subMenus: [],
            icon:'isax isax-people'
          },
          {
            menuValue: 'header.certifications',
            route: routes.certificationManagement,
            hasSubRoute: false,
            showSubRoute: false,
            base: 'certification-management',
            page: '',
            last: '',
            subMenus: [],
            icon:'isax isax-award'
          }
        ]
      },
      {
        tittle:'Account',
        base:'user',
        showAsTab: false,
        separateRoute: false,
        menu:[
          {
            menuValue: 'header.profile',
            route: routes.myProfile,
            hasSubRoute: false,
            showSubRoute: false,
            base: 'my-profile',
            page: '',
            last: '',
            subMenus: [],
            icon:'isax isax-profile-circle'
          },
          {
            menuValue: 'nav.logout',
            route: routes.login,
            hasSubRoute: false,
            showSubRoute: false,
            base: 'logout',
            page: '',
            last: '',
            subMenus: [],
            icon:'isax isax-logout'
          }
        ]
      }
    ];
  }

  // Method to get sidebar by role
  public getSideBarByRole(role: string): Observable<SideBar2[]> {
    if (role === 'teacher') {
      return of(this.getTeacherSideBar());
    } else {
      return of(this.getStudentSideBar());
    }
  }


}
