import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexLegend,
  ApexStroke,
  ApexTitleSubtitle,
  ApexXAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { routes } from '../../../shared/routes/routes';
import {AccessDataService} from "../../../services/access-data.service";
import {GlobalService} from "../../../services/global.service";
import {ApiService} from "../../../services/api.service";


export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  labels: string[];
  responsive: ApexResponsive[];
  colors: string[];
}

export interface ApexResponsive {
  breakpoint: number;
  options: any;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  routes = routes
  public toursChart: Partial<ChartOptions> | any;
  public transactionChart: Partial<ChartOptions> | any;
  public val=0;
  originalSeries: number[] = [9, 8, 6, 4]; // Original values before normalization
  user:any;
  data:any = null;
  categoryLabels: string[] = [];
  categorySeries: number[] = [];
  categoryColors: string[] = ['#3b82f6', '#0ea5e9', '#111827', '#6b7280', '#f59e0b'];

  // Loading states
  isLoadingDashboard = true;

  // Dashboard data
  studentData: any = {
    enrolledCourses: 0,
    completedCourses: 0,
    totalSpent: 0,
    activeCourses: 0,
    courseList: [],
    isLoading: true,
    error: null
  };

  // Scrolling properties
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild('scrollContent') scrollContent!: ElementRef;
  isScrolling: boolean = true;
  private scrollInterval: any;
  private scrollSpeed: number = 1; // pixels per interval
  private scrollPosition: number = 0;

  chartOptions: any = {
    series: [],
    chart: {
      type: 'donut',
      height: 280,
      background: 'transparent'
    },
    labels: [],
    colors: [],
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: false
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    stroke: {
      width: 3,
      colors: ['#fff']
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 280,
            height: 250
          }
        }
      }
    ]
  };
  
  constructor(
    private accessDataService: AccessDataService,
    private globalService: GlobalService,
    private apiService: ApiService
  ) {
    this.user = this.globalService.getCurrentUser()
  }
  
  ngOnInit(): void {
    const maxValue = 10;

    // Initialize with fallback data first
    this.setFallbackData();

    this.loadStats();

    // Normalize series to percentages
    const normalizedSeries = this.originalSeries.map((value) => (value / maxValue) * 100);

    this.toursChart = {
      series: normalizedSeries,
      chart: {
        height: 280,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: '30%',
            background: 'transparent',
          },
          dataLabels: {
            labels: ['Hotels', 'Cars', 'Tours', 'Flights'],
            name: {
              show: true,
              offsetY: 20,
              fontSize: '14px',
            },
            value: {
              show: true,
              offsetY: -10,
              fontSize: '16px',
            },
          },
        },
      },
      colors: ['#155EEF', '#212E47', '#98AA30', '#CF3425'],
      labels: ['Hotels', 'Cars', 'Tours', 'Flights'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: true,
            },
            plotOptions: {
              radialBar: {
                dataLabels: {
                  fontSize: '8px',
                },
              },
            },
          },
        },
      ],
    };
    
    this.transactionChart={
      chart: {
        height: 250,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: false,
        }
      },
      colors: ['#CF3425', '#FEEDEB'],
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }],
      plotOptions: {
        bar: {
          borderRadius: 5,
          borderRadiusWhenStacked: 'all',
          horizontal: false,
          endingShape: 'rounded'
        },
      },
      series: [{
        name: 'Income',
        data: [5000, 16000, 8000, 5000, 4000, 5000, 12000, 5000, 8000, 5000, 5000, 8000]
      }, {
        name: 'Expenses',
        data: [5000, 4000, 4000, 5000, 8000, 5000, 4000, 5000, 4000, 5000, 5000, 4000]
      }],
    }
  }

  loadStats() {
    this.isLoadingDashboard = true;
    this.studentData.isLoading = true;

    // Minimum loading time to show the loading indicator
    const minLoadingTime = 1000; // 1 second
    const startTime = Date.now();

    // Check if we have a logged-in user
    if (this.user && this.user.id) {
      // Get student dashboard data from dashboard-user endpoint which provides comprehensive data
      this.apiService.getDashboardUserData(this.user.id).subscribe({
        next: (data) => {
          console.log('Student dashboard data:', data);

          if (data) {
            // Update student dashboard with API data from dashboard-user endpoint
            this.studentData.enrolledCourses = data.courses?.length || 0;
            this.studentData.completedCourses = data.completedCoursesCount || 0;
            this.studentData.totalSpent = data.totalCoursePrice || 0;
            this.studentData.activeCourses = (data.courses?.length || 0) - (data.completedCoursesCount || 0);

            // Process course list from enrollments (courses array)
            if (data.courses && data.courses.length) {
              this.studentData.courseList = data.courses.slice(0, 5).map((enrollment: any) => {
                return {
                  id: enrollment.id,
                  title: enrollment.course?.title || 'Untitled Course',
                  progress: enrollment.progress || 0,
                  image: enrollment.course?.media?.length ? enrollment.course.media[0].url : 'assets/img/course-placeholder.jpg',
                  category: enrollment.course?.category?.name || 'Uncategorized',
                  instructor: enrollment.course?.instructor?.name || 'Unknown Instructor',
                  status: enrollment.progress >= 100 ? 'Completed' : enrollment.progress > 0 ? 'In Progress' : 'Not Started'
                };
              });
            }

            // Create category chart data from enrollmentsPerCategory
            if (data.enrollmentsPerCategory && data.enrollmentsPerCategory.length) {
              this.categoryLabels = data.enrollmentsPerCategory.map((item: any) => item.category);
              this.categorySeries = data.enrollmentsPerCategory.map((item: any) => item.count);

              // Update chart options
              this.chartOptions.labels = this.categoryLabels;
              this.chartOptions.series = this.categorySeries;
              this.chartOptions.colors = this.categoryColors.slice(0, this.categoryLabels.length);
            } else if (data.data && data.data.length) {
              // Fallback to data array if enrollmentsPerCategory is not available
              this.categoryLabels = data.data.map((item: any) => item.category);
              this.categorySeries = data.data.map((item: any) => item.total);

              // Update chart options
              this.chartOptions.labels = this.categoryLabels;
              this.chartOptions.series = this.categorySeries;
              this.chartOptions.colors = this.categoryColors.slice(0, this.categoryLabels.length);
            }

            this.data = data;
          } else {
            // Fallback to demo data if API returns empty data
            this.setFallbackData();
          }

          // Ensure minimum loading time
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

          setTimeout(() => {
            this.studentData.isLoading = false;
            this.isLoadingDashboard = false;
          }, remainingTime);
        },
        error: (err) => {
          console.error('Error loading student dashboard data:', err);
          this.studentData.error = 'Failed to load dashboard data. Using demo data instead.';
          this.setFallbackData();

          // Ensure minimum loading time even on error
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

          setTimeout(() => {
            this.studentData.isLoading = false;
            this.isLoadingDashboard = false;
          }, remainingTime);
        }
      });
    } else {
      // No user logged in, use fallback data
      this.setFallbackData();

      // Ensure minimum loading time even when no user
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      setTimeout(() => {
        this.studentData.isLoading = false;
        this.isLoadingDashboard = false;
      }, remainingTime);
    }
  }

  getCategoryPercentage(index: number): string {
    if (!this.categorySeries || this.categorySeries.length === 0) {
      return '0%';
    }

    const total = this.categorySeries.reduce((sum, value) => sum + value, 0);
    if (total === 0) {
      return '0%';
    }

    const percentage = Math.round((this.categorySeries[index] / total) * 100);
    return `${percentage}%`;
  }

  setFallbackData() {
    // Demo data for the category chart
    this.categoryLabels = ['Web Development', 'Mobile Development', 'Data Science', 'Design', 'Business'];
    this.categorySeries = [30, 25, 20, 15, 10];
    this.chartOptions.labels = this.categoryLabels;
    this.chartOptions.series = this.categorySeries;
    this.chartOptions.colors = this.categoryColors;
    
    // Demo data for student dashboard
    this.studentData = {
      enrolledCourses: 5,
      completedCourses: 2,
      totalSpent: 499,
      activeCourses: 3,
      courseList: [
        {
          id: 1,
          title: 'Introduction to HTML & CSS',
          progress: 100,
          image: 'assets/img/course-placeholder.jpg',
          category: 'Web Development',
          instructor: 'Ahmed Bouazizi'
        },
        {
          id: 2,
          title: 'JavaScript Fundamentals',
          progress: 85,
          image: 'assets/img/course-placeholder.jpg',
          category: 'Web Development',
          instructor: 'Leila Kaddour'
        },
        {
          id: 3,
          title: 'React for Beginners',
          progress: 65,
          image: 'assets/img/course-placeholder.jpg',
          category: 'Web Development',
          instructor: 'Mohamed Ali'
        },
        {
          id: 4,
          title: 'Advanced Python Programming',
          progress: 32,
          image: 'assets/img/course-placeholder.jpg',
          category: 'Data Science',
          instructor: 'Sami Trabelsi'
        },
        {
          id: 5,
          title: 'Mobile App UI Design',
          progress: 100,
          image: 'assets/img/course-placeholder.jpg',
          category: 'Design',
          instructor: 'Amina Beldi'
        }
      ],
      isLoading: false,
      error: null
    };
  }

  getCategoryCount(index: number): number {
    return this.categorySeries[index] || 0;
  }



  ngAfterViewInit() {
    this.startAutoScroll();
  }

  ngOnDestroy() {
    this.stopAutoScroll();
  }

  startAutoScroll() {
    if (!this.scrollContainer || !this.scrollContent) return;
    
    this.scrollInterval = setInterval(() => {
      if (!this.isScrolling) return;
      
      const containerWidth = this.scrollContainer.nativeElement.offsetWidth;
      const contentWidth = this.scrollContent.nativeElement.scrollWidth;
      
      this.scrollPosition += this.scrollSpeed;
      
      if (this.scrollPosition >= contentWidth - containerWidth) {
        // Reset to start when reaching the end
        this.scrollPosition = 0;
      }
      
      this.scrollContainer.nativeElement.scrollLeft = this.scrollPosition;
    }, 30);
  }

  stopAutoScroll() {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
    }
  }

  pauseScroll() {
    this.isScrolling = false;
  }

  resumeScroll() {
    this.isScrolling = true;
    this.startAutoScroll();
  }

  // Get course image URL with fallbacks
  getCourseImageUrl(course: any): string {
    if (!course) {
      return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&crop=center';
    }
    
    // First try media_path.original_url (from mediaPath accessor)
    if (course.media_path && course.media_path.original_url) {
      return course.media_path.original_url;
    }
    
    // Then try cover_image.url (from coverImage accessor)
    if (course.cover_image && course.cover_image.url) {
      return course.cover_image.url;
    }
    
    // Fallback to a default course image
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&crop=center';
  }

  // Handle image loading errors
  onImageError(event: any): void {
    // Set a fallback image when the original fails to load
    event.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&crop=center';
  }
}





