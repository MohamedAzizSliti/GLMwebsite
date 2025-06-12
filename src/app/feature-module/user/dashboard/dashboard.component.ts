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
  constructor(private accessDataService: AccessDataService,
              private globalService: GlobalService) {
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
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct','Nov', 'Dec'],
    labels: {
      style: {
        colors: '#4E5561',
        fontSize: '12px',
      }
    }
  },
  yaxis: {
    labels: {
      formatter: (val:any) => {
        return val / 1000 + 'K'
      },
      offsetX: -15,
      style: {
        colors: '#4E5561',
        fontSize: '13px',
      }
    }
  },
  grid: {
    show:false,
  },
  legend: {
    show: false
  },
  dataLabels: {
    enabled: false // Disable data labels
  },
  fill: {
    opacity: 1
  },
}
}

  loadStats(){
    this.accessDataService.getData(null,'dashboard-user/'+this.user.id).subscribe(
          (response: any) => {
            this.data = response;
            this.categoryLabels = response.data.map((d:any) => d.category);
            this.categorySeries = response.data.map((d:any) => d.total);

            this.chartOptions.series = this.categorySeries;
            this.chartOptions.labels = this.categoryLabels;
            this.chartOptions.colors = this.categoryColors.slice(0, this.categoryLabels.length);
          },
          error => {
            // Fallback data for demo
            this.setFallbackData();
          },
          () => {
          }
        )
  }

  setFallbackData() {
    // Fallback data similar to the image
    this.categoryLabels = ['Réparation', 'Programmation'];
    this.categorySeries = [1, 3]; // 1 repair course, 3 programming courses
    this.data = {
      totalCoursePrice: 111
    };
    
    this.chartOptions.series = this.categorySeries;
    this.chartOptions.labels = this.categoryLabels;
    this.chartOptions.colors = ['#3b82f6', '#0ea5e9']; // Blue colors like in the image
  }

  getCategoryCount(index: number): number {
    return this.categorySeries[index] || 0;
  }

  getCategoryPercentage(index: number): string {
    const total = this.categorySeries.reduce((sum, val) => sum + val, 0);
    if (total === 0) return '0%';
    const percentage = (this.categorySeries[index] / total) * 100;
    return percentage.toFixed(1) + '%';
  }

  ngAfterViewInit() {
    this.startAutoScroll();
  }

  ngOnDestroy() {
    this.stopAutoScroll();
  }

  startAutoScroll() {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
    }
    
    this.scrollInterval = setInterval(() => {
      if (this.isScrolling && this.scrollContainer && this.scrollContent) {
        try {
          const container = this.scrollContainer.nativeElement;
          const content = this.scrollContent.nativeElement;
          
          if (!container || !content) {
            return;
          }
          
          this.scrollPosition += this.scrollSpeed;
          
          // Reset scroll position when we've scrolled through half the content (for seamless loop)
          const halfContentHeight = content.scrollHeight / 2;
          if (this.scrollPosition >= halfContentHeight) {
            this.scrollPosition = 0;
          }
          
          container.scrollTop = this.scrollPosition;
        } catch (error) {
          console.warn('Error during auto-scroll:', error);
          // Stop scrolling if there's an error
          this.stopAutoScroll();
        }
      }
    }, 50); // 50ms interval for smooth scrolling
  }

  stopAutoScroll() {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }
  }

  pauseScroll() {
    this.isScrolling = false;
  }

  resumeScroll() {
    this.isScrolling = true;
  }

}





