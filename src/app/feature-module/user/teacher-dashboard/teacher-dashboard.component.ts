import { Component, OnInit } from '@angular/core';
import { routes } from '../../../shared/routes/routes';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: false,
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.scss'
})
export class TeacherDashboardComponent implements OnInit {
  routes = routes;
  user: any;

  // Teacher static data
  teacherData: any = {
    totalStudents: 156,
    activeCourses: 8,
    completedCourses: 12,
    totalRevenue: 2450,
    studentProgress: [
      { name: 'Ahmed Ben Ali', course: 'HTML/CSS Avancé', progress: 85, avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
      { name: 'Fatima Zahra', course: 'JavaScript ES6', progress: 92, avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
      { name: 'Mohamed Slim', course: 'React Fundamentals', progress: 67, avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
      { name: 'Amina Khelil', course: 'Node.js Backend', progress: 78, avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
      { name: 'Youssef Mansour', course: 'Database Design', progress: 94, avatar: 'https://randomuser.me/api/portraits/men/5.jpg' }
    ],
    recentCourses: [
      { 
        title: 'HTML/CSS Avancé', 
        students: 45, 
        completion: 78, 
        category: 'Programmation',
        image: 'https://eliezermolina.net/wp-content/uploads/2018/11/HTML-CSS@2x-768x384.png',
        createdAt: new Date('2024-01-15')
      },
      { 
        title: 'JavaScript ES6', 
        students: 38, 
        completion: 85, 
        category: 'Programmation',
        image: 'https://eliezermolina.net/wp-content/uploads/2018/11/HTML-CSS@2x-768x384.png',
        createdAt: new Date('2024-02-10')
      },
      { 
        title: 'React Fundamentals', 
        students: 29, 
        completion: 62, 
        category: 'Programmation',
        image: 'https://eliezermolina.net/wp-content/uploads/2018/11/HTML-CSS@2x-768x384.png',
        createdAt: new Date('2024-03-05')
      }
    ],
    courseProgress: [
      { course: 'HTML/CSS Avancé', totalStudents: 45, completed: 35, inProgress: 8, notStarted: 2 },
      { course: 'JavaScript ES6', totalStudents: 38, completed: 32, inProgress: 5, notStarted: 1 },
      { course: 'React Fundamentals', totalStudents: 29, completed: 18, inProgress: 9, notStarted: 2 }
    ]
  };

  constructor(private globalService: GlobalService) {
    this.user = this.globalService.getCurrentUser();
  }

  ngOnInit(): void {
    // Teacher dashboard initialization
  }
} 