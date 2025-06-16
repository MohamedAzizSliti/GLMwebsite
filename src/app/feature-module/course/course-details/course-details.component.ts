import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { LightGallery } from 'lightgallery/lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { BeforeSlideDetail } from 'lightgallery/lg-events';
import { routes } from '../../../shared/routes/routes';
import {AccessDataService} from "../../../services/access-data.service";
import {GlobalService} from "../../../services/global.service";
import {QuizModalService} from "../../quiz-modal-component/services/quiz-modal.service";
import {Exam} from "../../quiz-modal-component/models/exam.model";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../services/api.service";
import { environment } from '../../../../environments/environment';

interface data {
  value: string ;
}

// Static HTML & CSS Mini Exam
const HTML_CSS_MINI_EXAM = {
  id: 'static-html-css-exam',
  title: '✅ Mini Examen HTML & CSS (10 Questions)',
  duration: 30,
  mark_per_question: 1,
  pass_marks: 7,
  course_id: 16,
  isStatic: true,
  questions: [
    // Partie 1: Vrai ou Faux (3 Questions)
    {
      id: 1,
      question_text: 'HTML signifie HyperText Markup Language.',
      question_type: 'single_choice',
      correct_option: 'option_1', // Vrai
      section: 'Partie 1: Vrai ou Faux',
      options: {
        option_1: { text: 'Vrai', is_correct: true },
        option_2: { text: 'Faux', is_correct: false },
        option_3: { text: null, is_correct: false },
        option_4: { text: null, is_correct: false }
      },
      option_1: { text: 'Vrai', is_correct: true },
      option_2: { text: 'Faux', is_correct: false },
      option_3: { text: null, is_correct: false },
      option_4: { text: null, is_correct: false }
    },
    {
      id: 2,
      question_text: 'La balise <div> est utilisée pour créer un saut de ligne en HTML.',
      question_type: 'single_choice',
      correct_option: 'option_2', // Faux
      section: 'Partie 1: Vrai ou Faux',
      options: {
        option_1: { text: 'Vrai', is_correct: false },
        option_2: { text: 'Faux', is_correct: true },
        option_3: { text: null, is_correct: false },
        option_4: { text: null, is_correct: false }
      },
      option_1: { text: 'Vrai', is_correct: false },
      option_2: { text: 'Faux', is_correct: true },
      option_3: { text: null, is_correct: false },
      option_4: { text: null, is_correct: false }
    },
    {
      id: 3,
      question_text: 'CSS peut être utilisé pour changer la police, la couleur et la mise en page d\'une page web.',
      question_type: 'single_choice',
      correct_option: 'option_1', // Vrai
      section: 'Partie 1: Vrai ou Faux',
      options: {
        option_1: { text: 'Vrai', is_correct: true },
        option_2: { text: 'Faux', is_correct: false },
        option_3: { text: null, is_correct: false },
        option_4: { text: null, is_correct: false }
      },
      option_1: { text: 'Vrai', is_correct: true },
      option_2: { text: 'Faux', is_correct: false },
      option_3: { text: null, is_correct: false },
      option_4: { text: null, is_correct: false }
    },
    // Partie 2: Choix Multiple (4 Questions)
    {
      id: 4,
      question_text: 'Quelle balise HTML est utilisée pour créer un lien hypertexte ?',
      question_type: 'single_choice',
      correct_option: 'option_1',
      section: 'Partie 2: Choix Multiple',
      options: {
        option_1: { text: '<a>', is_correct: true },
        option_2: { text: '<link>', is_correct: false },
        option_3: { text: '<href>', is_correct: false },
        option_4: { text: '<button>', is_correct: false }
      },
      option_1: { text: '<a>', is_correct: true },
      option_2: { text: '<link>', is_correct: false },
      option_3: { text: '<href>', is_correct: false },
      option_4: { text: '<button>', is_correct: false }
    },
    {
      id: 5,
      question_text: 'Comment appliquer une classe CSS appelée "highlight" à un élément HTML ?',
      question_type: 'single_choice',
      correct_option: 'option_2',
      section: 'Partie 2: Choix Multiple',
      options: {
        option_1: { text: '<p id="highlight">', is_correct: false },
        option_2: { text: '<p class="highlight">', is_correct: true },
        option_3: { text: '<p style="highlight">', is_correct: false },
        option_4: { text: '<p class:highlight>', is_correct: false }
      },
      option_1: { text: '<p id="highlight">', is_correct: false },
      option_2: { text: '<p class="highlight">', is_correct: true },
      option_3: { text: '<p style="highlight">', is_correct: false },
      option_4: { text: '<p class:highlight>', is_correct: false }
    },
    {
      id: 6,
      question_text: 'Quelle propriété CSS est utilisée pour changer la couleur d\'arrière-plan d\'un élément ?',
      question_type: 'single_choice',
      correct_option: 'option_3',
      section: 'Partie 2: Choix Multiple',
      options: {
        option_1: { text: 'text-color', is_correct: false },
        option_2: { text: 'bgcolor', is_correct: false },
        option_3: { text: 'background-color', is_correct: true },
        option_4: { text: 'color', is_correct: false }
      },
      option_1: { text: 'text-color', is_correct: false },
      option_2: { text: 'bgcolor', is_correct: false },
      option_3: { text: 'background-color', is_correct: true },
      option_4: { text: 'color', is_correct: false }
    },
    {
      id: 7,
      question_text: 'Quelle est la bonne façon de mettre du texte en gras en CSS ?',
      question_type: 'single_choice',
      correct_option: 'option_1',
      section: 'Partie 2: Choix Multiple',
      options: {
        option_1: { text: 'font-weight: bold;', is_correct: true },
        option_2: { text: 'text-style: bold;', is_correct: false },
        option_3: { text: 'font-style: bold;', is_correct: false },
        option_4: { text: 'text-weight: bold;', is_correct: false }
      },
      option_1: { text: 'font-weight: bold;', is_correct: true },
      option_2: { text: 'text-style: bold;', is_correct: false },
      option_3: { text: 'font-style: bold;', is_correct: false },
      option_4: { text: 'text-weight: bold;', is_correct: false }
    },
    // Partie 3: Questions Ouvertes (3 Questions)
    {
      id: 8,
      question_text: 'Quelle est la différence principale entre HTML et CSS ?',
      question_type: 'single_choice',
      correct_option: 'option_1',
      section: 'Partie 3: Questions Ouvertes',
      options: {
        option_1: { text: 'HTML structure le contenu, CSS le stylise', is_correct: true },
        option_2: { text: 'HTML et CSS font la même chose', is_correct: false },
        option_3: { text: 'CSS structure le contenu, HTML le stylise', is_correct: false },
        option_4: { text: 'Les deux sont des langages de programmation', is_correct: false }
      },
      option_1: { text: 'HTML structure le contenu, CSS le stylise', is_correct: true },
      option_2: { text: 'HTML et CSS font la même chose', is_correct: false },
      option_3: { text: 'CSS structure le contenu, HTML le stylise', is_correct: false },
      option_4: { text: 'Les deux sont des langages de programmation', is_correct: false }
    },
    {
      id: 9,
      question_text: 'Quelle est la structure HTML de base correcte ?',
      question_type: 'single_choice',
      correct_option: 'option_1',
      section: 'Partie 3: Questions Ouvertes',
      options: {
        option_1: { text: '<html><head><title>Titre</title></head><body><h1>Titre</h1><p>Paragraphe</p></body></html>', is_correct: true },
        option_2: { text: '<html><h1>Titre</h1><p>Paragraphe</p></html>', is_correct: false },
        option_3: { text: '<head><body><h1>Titre</h1></body></head>', is_correct: false },
        option_4: { text: '<title><h1>Titre</h1><p>Paragraphe</p></title>', is_correct: false }
      },
      option_1: { text: '<html><head><title>Titre</title></head><body><h1>Titre</h1><p>Paragraphe</p></body></html>', is_correct: true },
      option_2: { text: '<html><h1>Titre</h1><p>Paragraphe</p></html>', is_correct: false },
      option_3: { text: '<head><body><h1>Titre</h1></body></head>', is_correct: false },
      option_4: { text: '<title><h1>Titre</h1><p>Paragraphe</p></title>', is_correct: false }
    },
    {
      id: 10,
      question_text: 'Quel est le rôle principal de la balise <head> dans un document HTML ?',
      question_type: 'single_choice',
      correct_option: 'option_1',
      section: 'Partie 3: Questions Ouvertes',
      options: {
        option_1: { text: 'Contient les métadonnées et informations du document', is_correct: true },
        option_2: { text: 'Affiche le contenu principal de la page', is_correct: false },
        option_3: { text: 'Crée l\'en-tête de page avec navigation', is_correct: false },
        option_4: { text: 'Définit le pied de page', is_correct: false }
      },
      option_1: { text: 'Contient les métadonnées et informations du document', is_correct: true },
      option_2: { text: 'Affiche le contenu principal de la page', is_correct: false },
      option_3: { text: 'Crée l\'en-tête de page avec navigation', is_correct: false },
      option_4: { text: 'Définit le pied de page', is_correct: false }
    }
  ]
};

@Component({
  selector: 'app-course-details',
  standalone: false,
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.scss'
})
export class CourseDetailsComponent {
  public routes=routes;
  isLess =true;
  isMore:boolean[] =[false];
  time: Date | null = null; // Bind this to the p-calendar
  course: any = {};
  modalImageUrl: string | null = null;
  isPurchased : any = false;
  currentUser : any = null;
  enrollment : any = null;
  modalVideoUrl: string | null = null;
  staticExam = HTML_CSS_MINI_EXAM;
  isExamDropdownOpen = false;
  
  // Quiz/Exam session tracking
  completedQuizzes: Set<number> = new Set();
  completedExams: Set<number> = new Set();
  quizSessions: any[] = [];
  examSessions: any[] = [];
  isLoadingQuiz = false;
  isLoadingExam = false;
  
  // Chapter toggle states
  isClassAdded: boolean[] = [];

    constructor(private router: Router,
                private accessDataService:AccessDataService,
                private globalService:GlobalService,
                private http:HttpClient,
                private quizModalService: QuizModalService,
                private route : ActivatedRoute,
                private apiService: ApiService) {
    this.currentUser = this.globalService.getCurrentUser();
    }
    bsValue=new Date();
    toreset=true;
    navContainer?: string;

  // Configuration for the main slider
  mainSliderConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    asNavFor: '.slider-nav', // Link with the thumbnail slider
    prevArrow: "<span class='slick-next'><i class='fa-solid fa-chevron-right'></i></span>",
    nextArrow: "<span class='slick-prev'><i class='fa-solid fa-chevron-left'></i></span>",
  };

  // Configuration for the thumbnail slider
  thumbSliderConfig = {
    slidesToShow: 5,
    slidesToScroll: 1,
    vertical: false,
    asNavFor: '.slider-fors', // Link with the main slider
    dots: false,
    arrows: true,
    focusOnSelect: true,
    prevArrow: "<span class='slick-next'><i class='fa-solid fa-chevron-right'></i></span>",
    nextArrow: "<span class='slick-prev'><i class='fa-solid fa-chevron-left'></i></span>",

  };

  // Example slides data
  mainSlides = [
    'assets/img/hotels/hotel-large-01.jpg',
    'assets/img/hotels/hotel-large-02.jpg',
    'assets/img/hotels/hotel-large-03.jpg',
    'assets/img/hotels/hotel-large-04.jpg',
    'assets/img/hotels/hotel-large-05.jpg',
    'assets/img/hotels/hotel-large-06.jpg',
  ];

  thumbSlides = [
    'assets/img/hotels/hotel-thumb-01.jpg',
    'assets/img/hotels/hotel-thumb-02.jpg',
    'assets/img/hotels/hotel-thumb-03.jpg',
    'assets/img/hotels/hotel-thumb-04.jpg',
    'assets/img/hotels/hotel-thumb-05.jpg',
    'assets/img/hotels/hotel-thumb-06.jpg',
  ];

   settings = {
      counter: false,
      plugins: [lgZoom, lgVideo],
    };
  private lightGallery!: LightGallery;
    private needRefresh = false;
    ngAfterViewChecked(): void {
      if (this.needRefresh) {
        this.lightGallery.refresh();
        this.needRefresh = false;
      }
    }
    onInit = (detail: { instance: LightGallery }): void => {
      this.lightGallery = detail.instance;
    };
      images = [
    {
      src: 'assets/img/hotels/hotel-large-02.jpg',
    },
    {
      src: 'assets/img/hotels/hotel-large-07.jpg',
    }
    ,
    {
      src: 'assets/img/hotels/hotel-large-08.jpg',
    }
    ,
    {
      src: 'assets/img/hotels/hotel-large-09.jpg',
    }
    ,
    {
      src: 'assets/img/hotels/hotel-large-10.jpg',
    }
    ,
    {
      src: 'assets/img/hotels/hotel-large-11.jpg',
    }
    ,
    {
      src: 'assets/img/hotels/hotel-large-12.jpg',
    }
    ,
    {
      src: 'assets/img/hotels/hotel-large-13.jpg',
    }
    ,
    {
      src: 'assets/img/hotels/hotel-large-15.jpg',
    }
    ,
    {
      src: 'assets/img/hotels/hotel-large-16.jpg',
    }
    ,
    {
      src: 'assets/img/hotels/hotel-large-10.jpg',
    }
    ,
    {
      src: 'assets/img/hotels/hotel-large-10.jpg',
    }
    ,
    {
      src: 'assets/img/hotels/hotel-large-10.jpg',
    }
    ,
    {
      src: 'assets/img/hotels/hotel-large-10.jpg',
    }
    ,
    {
      src: 'assets/img/hotels/hotel-large-10.jpg',
    }
  ];
  gallerySettings = {
    counter: true,
    download: true
  };
  public imageSlider : OwlOptions ={
    loop: true,
      margin: 20,
      nav: true,
      dots: true,
      smartSpeed: 2000,
      autoplay: false,
      navText: [
        '<i class="fa-solid fa-chevron-left"></i>',
        '<i class="fa-solid fa-chevron-right"></i>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        550: {
          items: 1,
        },
        768: {
          items: 1,
        },
        1000: {
          items: 1,
        },
      },
  }
  public roomSlider : OwlOptions={
    loop: true,
      margin: 0,
      nav: true,
      dots: false,
      autoWidth:true,
      autoplay: false,
      smartSpeed: 2000,
      navText: [
        "<i class='fa-solid fa-chevron-left'></i>",
        "<i class='fa-solid fa-chevron-right'></i>",
      ],
      responsive: {
        0: {
          items: 1,
        },
        550: {
          items: 1,
        },
        768: {
          items: 1,
        },
        1000: {
          items: 1,
        },
      },
  }
  onBeforeSlide = (detail: BeforeSlideDetail): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { index, prevIndex } = detail;
  };
  showMore() : void{
    this.isLess=!this.isLess;
  }
  showLess(index:number) : void{
    this.isMore[index]=!this.isMore[index];
  }
  onSubmit() :void {
    this.router.navigateByUrl('/hotel/hotel-details');
  }
  onSubmit1() :void {
    this.router.navigateByUrl('/hotel/hotel-booking');
  }

  ngOnInit(){
    this.route.params.subscribe(params => {
      const courseId = params['id'];
      if (courseId) {
        this.accessDataService.getData(null,'course/'+courseId).subscribe(
            (response: any) => {
            // Handle different response formats
            this.course = response.course || response.data || response;
            console.log('Course loaded:', this.course);
            
            // Ensure course has required properties
            if (!this.course.chapters) this.course.chapters = [];
            if (!this.course.quizzes) this.course.quizzes = [];
            if (!this.course.exams) this.course.exams = [];
            
            // Load quiz and exam completion status
            this.loadQuizExamStatus();
            
            if (this.currentUser) {
              this.accessDataService.getData(null,'rollements-course/'+courseId+'/'+this.currentUser.id).subscribe(
                    (response: any) => {
                      this.enrollment = response;
                  if (this.enrollment) {
                    this.isPurchased = true;
                  }
                    },
                    error => {
                  console.log('No enrollment found');
                    }
              );
            }
            },
            error => {
            console.error('Error loading course:', error);
            // Initialize empty course object on error
            this.course = {
              id: null,
              title: 'Course not found',
              chapters: [],
              quizzes: [],
              exams: [],
              instructor: { name: 'Unknown', email: '' }
            };
          }
        );
        }
      });
  }

  purchaseFormation(event :any){
    localStorage.setItem('purchased_course',JSON.stringify(this.course));
    this.router.navigateByUrl('course/course-purchase');
     if (this.globalService.getCurrentUser()){

     }else{

     }
  }

  // Fonction appelée lors du clic sur le bouton
  openQuizModal(exam:any) {
    console.log('🔍 DEBUG: Opening quiz modal with exam:', exam);
    console.log('🔍 DEBUG: Exam questions:', exam.questions);
    
    if (!this.currentUser) {
      alert('Vous devez être connecté pour passer cet examen.');
      return;
    }

    if (!this.isPurchased) {
      alert('Vous devez être inscrit à ce cours pour passer cet examen.');
      return;
    }

    // Handle static exam differently
    if (exam.isStatic) {
      console.log('🔍 DEBUG: Opening static exam');
      this.openStaticExam(exam);
      return;
    }

    console.log('🔍 DEBUG: Opening database exam');
    this.isLoadingExam = true;

    // Start exam session
    this.apiService.startExamSession(exam.id).subscribe({
      next: (response: any) => {
        console.log('Exam session started:', response);
        
        // Get exam details
        this.apiService.getExamDetails(exam.id).subscribe({
          next: (examResponse: any) => {
            const examData = examResponse.exam || examResponse;
            console.log('🔍 DEBUG: Raw exam data from API:', examData);
            console.log('🔍 DEBUG: Raw exam questions from API:', examData.questions);
            
            const formattedExam: Exam = {
              id: examData.id,
              title: examData.title,
              duration: examData.duration || 60,
              mark_per_question: examData.mark_per_question || 1,
              pass_marks: examData.pass_marks || examData.passing_marks || 0,
              course_id: examData.course_id,
              created_at: examData.created_at,
              updated_at: examData.updated_at,
              nbr_question: examData.questions?.length || 0,
              questions: (examData.questions || []).map((q: any) => {
                console.log('🔍 DEBUG: Processing question:', q);
                
                const formattedQuestion = {
            id: q.id,
                  course_id: examData.course_id,
                  exam_id: examData.id,
                  quiz_id: null,
                  question: q.question,
                  question_text: q.question,
                  type: q.type,
                  question_type: q.type,
                  options: q.options, // JSON string like "[\"Oui\",\"Non\"]"
                  correct_answer: q.correct_answer, // String like "Oui"
                  created_at: q.created_at || new Date().toISOString(),
                  updated_at: q.updated_at || new Date().toISOString()
                };
                console.log('🔍 DEBUG: Formatted question:', formattedQuestion);
                return formattedQuestion;
              }),
              session_id: response.exam_session.id,
              is_quiz: false
            };

            console.log('🔍 DEBUG: Final formatted exam for modal:', formattedExam);
            this.quizModalService.openModal(formattedExam);
            this.isLoadingExam = false;
          },
          error: (error) => {
            console.error('Error loading exam details:', error);
            this.isLoadingExam = false;
            alert('Erreur lors du chargement de l\'examen.');
          }
        });
      },
      error: (error) => {
        console.error('Error starting exam session:', error);
        this.isLoadingExam = false;
        
        if (error.status === 401) {
          alert('Vous devez être connecté pour passer cet examen. Veuillez vous connecter.');
          // Optionally redirect to login
          // this.router.navigate(['/auth/login']);
        } else if (error.status === 400 && error.error?.message?.includes('route') && error.error?.message?.includes('not be found')) {
          alert('La fonctionnalité d\'examen est en cours de développement. Veuillez réessayer plus tard.');
        } else if (error.status === 403) {
          alert('Vous devez être inscrit à ce cours pour passer cet examen.');
        } else if (error.status === 422) {
          alert('Vous avez déjà terminé cet examen.');
        } else {
          alert('Erreur lors du démarrage de l\'examen. Veuillez vérifier votre connexion et réessayer.');
        }
      }
    });
  }

  openStaticExam(exam: any) {
    // Convert static exam to the format expected by quiz modal
    const examData: Exam = {
      id: exam.id,
      title: exam.title,
      duration: exam.duration,
      mark_per_question: exam.mark_per_question,
      pass_marks: exam.pass_marks,
      course_id: exam.course_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      nbr_question: exam.questions.length,
      questions: exam.questions.map((q: any) => ({
        id: q.id,
        course_id: exam.course_id,
        exam_id: exam.id,
        quiz_id: null,
        question: q.question_text || q.question,
        question_text: q.question_text || q.question,
        type: q.question_type || q.type,
        question_type: q.question_type || q.type,
        options: q.options,
        option_1: q.option_1,
        option_2: q.option_2,
        option_3: q.option_3,
        option_4: q.option_4,
        correct_option: q.correct_option,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
    };

    this.quizModalService.openModal(examData);
  }

  loadQuizExamStatus() {
    if (!this.currentUser) return;
    
    // Debug: Check user enrollments
    this.apiService.debugUserEnrollments().subscribe({
      next: (response: any) => {
        console.log('Debug - User enrollments:', response);
        
        // Check if user is enrolled in current course
        const currentCourseEnrollment = response.enrollments.find((e: any) => e.course_id == this.course.id);
        if (currentCourseEnrollment) {
          console.log('Debug - Current course enrollment:', currentCourseEnrollment);
        } else {
          console.log('Debug - No enrollment found for current course ID:', this.course.id);
        }
      },
      error: (error) => {
        console.log('Debug - Error checking enrollments:', error);
      }
    });
    
    // Load user's quiz sessions to track completion
    this.apiService.getUserQuizSessions().subscribe({
      next: (response: any) => {
        this.quizSessions = response.quiz_sessions || [];
        this.completedQuizzes.clear();
        
        // Mark completed quizzes
        this.quizSessions.forEach((session: any) => {
          if (session.status === 'completed') {
            this.completedQuizzes.add(session.quiz_id);
          }
        });
        
        console.log('✅ Quiz sessions loaded successfully:', this.quizSessions.length, 'sessions found');
        console.log('✅ Completed quizzes:', Array.from(this.completedQuizzes));
      },
      error: (error) => {
        console.log('ℹ️ Quiz sessions info:', {
          status: error.status,
          message: error.error?.message || 'No specific error message',
          interpretation: error.status === 400 ? 'Likely no quiz sessions found (user may have completed all quizzes)' : 'API error'
        });
        
        // Don't show error to user - this is expected when user has completed quizzes
        // Just log for debugging purposes
        if (error.status !== 400) {
          console.warn('Unexpected error loading quiz sessions:', error);
        }
      }
    });

    // Load user's exam sessions to track completion
    this.apiService.getUserExamSessions().subscribe({
      next: (response: any) => {
        this.examSessions = response.exam_sessions || [];
        this.completedExams.clear();
        
        // Mark completed exams
        this.examSessions.forEach((session: any) => {
          if (session.status === 'completed') {
            this.completedExams.add(session.exam_id);
          }
        });
        
        console.log('✅ Exam sessions loaded successfully:', this.examSessions.length, 'sessions found');
        console.log('✅ Completed exams:', Array.from(this.completedExams));
      },
      error: (error) => {
        console.log('ℹ️ Exam sessions info:', {
          status: error.status,
          message: error.error?.message || 'No specific error message',
          interpretation: error.status === 400 ? 'Likely no exam sessions found (user may have completed all exams)' : 'API error'
        });
        
        // Don't show error to user - this is expected when user has completed exams
        // Just log for debugging purposes
        if (error.status !== 400) {
          console.warn('Unexpected error loading exam sessions:', error);
        }
      }
    });
  }

  openQuiz(quizId: number) {
    // Check if quiz is already completed
    if (this.isQuizCompleted(quizId)) {
      const status = this.getQuizCompletionStatus(quizId);
      alert(`✅ Félicitations ! Vous avez déjà terminé ce quiz avec le statut: ${status}\n\nVous ne pouvez pas repasser un quiz déjà réussi.`);
      return;
    }

    if (!this.currentUser) {
      alert('Vous devez être connecté pour passer ce quiz.');
      return;
    }

    if (!this.isPurchased) {
      alert('Vous devez être inscrit à ce cours pour passer ce quiz.');
      return;
    }

    console.log('🎯 Starting quiz session debug info:', {
      quizId: quizId,
      courseId: this.course.id,
      currentUser: this.currentUser,
      isPurchased: this.isPurchased,
      enrollment: this.enrollment
    });

    // Debug: Check enrollments before starting quiz
    this.apiService.debugUserEnrollments().subscribe({
      next: (enrollmentDebug: any) => {
        console.log('🔍 Enrollment debug before quiz start:', enrollmentDebug);
        
        const courseEnrollment = enrollmentDebug.enrollments.find((e: any) => e.course_id == this.course.id);
        if (courseEnrollment) {
          console.log('✅ Found enrollment for current course:', courseEnrollment);
        } else {
          console.log('❌ No enrollment found for course ID:', this.course.id);
          console.log('Available enrollments:', enrollmentDebug.enrollments.map((e: any) => ({
            id: e.id,
            course_id: e.course_id,
            course_title: e.course_title,
            status: e.status
          })));
        }
        
        // Proceed with quiz start after debugging
        this.startQuizSession(quizId);
      },
      error: (error) => {
        console.log('❌ Error checking enrollments before quiz:', error);
        // Still try to start quiz even if debug fails
        this.startQuizSession(quizId);
      }
    });
  }

  private startQuizSession(quizId: number) {
    this.isLoadingQuiz = true;

    // Use normal quiz start endpoint (controller now bypasses enrollment check temporarily)
    console.log('🎯 Starting quiz session with modified controller');
    console.log('🔍 API URL being called:', `${environment.apiUrl}/quiz/start`);
    console.log('🔍 Request payload:', { quiz_id: quizId });
    console.log('🔍 Current user token:', localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).access_token?.substring(0, 20) + '...' : 'No token');
    
    this.apiService.startQuizSession(quizId).subscribe({
      next: (response: any) => {
        console.log('✅ Quiz session started:', response);
        
        // Get quiz details and convert to exam format for modal
        this.apiService.getQuizDetails(quizId).subscribe({
          next: (quizResponse: any) => {
            const quiz = quizResponse.quiz || quizResponse;
            console.log('🔍 DEBUG: Raw quiz data from API:', quiz);
            console.log('🔍 DEBUG: Raw quiz questions from API:', quiz.questions);
            
            // Convert quiz to exam format for the modal
            const examData: Exam = {
              id: quiz.id,
              title: quiz.title,
              duration: quiz.duration || 15,
              mark_per_question: 1, // Default for quizzes
              pass_marks: quiz.passing_marks || quiz.total_marks * 0.6,
              course_id: quiz.course_id,
              created_at: quiz.created_at,
              updated_at: quiz.updated_at,
              nbr_question: quiz.questions?.length || 0,
              questions: (quiz.questions || []).map((q: any) => {
                console.log('🔍 DEBUG: Processing quiz question:', q);
                
                const formattedQuestion = {
                  id: q.id,
                  course_id: quiz.course_id,
                  exam_id: null,
                  quiz_id: quiz.id,
                  question: q.question,
                  question_text: q.question,
                  type: q.type,
                  question_type: q.type,
                  options: q.options, // JSON string like "[\"Oui\",\"Non\"]"
                  correct_answer: q.correct_answer, // String like "Oui"
                  created_at: q.created_at || new Date().toISOString(),
                  updated_at: q.updated_at || new Date().toISOString()
                };
                console.log('🔍 DEBUG: Formatted question:', formattedQuestion);
                return formattedQuestion;
              }),
              session_id: response.quiz_session.id,
              is_quiz: true
            };

            console.log('🔍 DEBUG: Final formatted quiz for modal:', examData);
            this.quizModalService.openModal(examData);
            this.isLoadingQuiz = false;
          },
          error: (error) => {
            console.error('Error loading quiz details:', error);
            this.isLoadingQuiz = false;
            alert('Erreur lors du chargement du quiz.');
          }
        });
      },
      error: (error) => {
        console.error('Error starting quiz session:', error);
        this.isLoadingQuiz = false;
        
        // Enhanced error logging
        console.log('🚨 Quiz start error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.error?.message,
          url: error.url,
          fullError: error
        });

        // Log the actual API response for debugging
        console.log('🔍 Raw API Error Response:', error.error);
        console.log('🔍 Quiz completion status:', {
          quizId: quizId,
          isCompleted: this.isQuizCompleted(quizId),
          completedQuizzes: Array.from(this.completedQuizzes),
          quizSessions: this.quizSessions
        });
        
        if (error.status === 401) {
          alert('Vous devez être connecté pour passer ce quiz. Veuillez vous connecter.');
          // Optionally redirect to login
          // this.router.navigate(['/auth/login']);
        } else if (error.status === 400) {
          // Handle different 400 error scenarios
          const errorMessage = error.error?.message || '';
          
          if (errorMessage.includes('already completed') || errorMessage.includes('déjà terminé')) {
            alert('✅ Félicitations ! Vous avez déjà réussi ce quiz. Vous ne pouvez pas le repasser.');
          } else if (errorMessage.includes('no active session') || errorMessage.includes('session active')) {
            alert('ℹ️ Aucune session de quiz active trouvée. Cela peut signifier que vous avez déjà terminé ce quiz.');
          } else if (errorMessage.includes('route') && errorMessage.includes('not be found')) {
            alert('La fonctionnalité de quiz est en cours de développement. Veuillez réessayer plus tard.');
          } else if (errorMessage.includes('quiz not found') || errorMessage.includes('quiz introuvable')) {
            alert('Ce quiz n\'est plus disponible ou a été supprimé.');
          } else {
            // Generic 400 error - likely quiz already completed or backend issue
            alert('✅ Bonne nouvelle ! Il semble que vous ayez déjà terminé ce quiz avec succès.\n\nSi ce n\'est pas le cas, la fonctionnalité de quiz est peut-être en cours de développement.');
          }
        } else if (error.status === 403) {
          alert('Vous devez être inscrit à ce cours pour passer ce quiz.');
        } else if (error.status === 404) {
          alert('Ce quiz n\'existe pas ou n\'est plus disponible.');
        } else if (error.status === 422) {
          alert('Données invalides. Veuillez vérifier les informations du quiz.');
        } else {
          alert('Erreur lors du démarrage du quiz. Veuillez vérifier votre connexion et réessayer.');
        }
      }
    });
  }

  // Enhanced progress update that includes quiz/exam completion
  updateProgressWithQuizExam() {
    if (!this.enrollment) return;

    const totalItems = this.getTotalCourseItems();
    const completedItems = this.getCompletedItems();
    
    const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    this.accessDataService.postData({
      enrollmentId: this.enrollment.id,
      progress: Math.min(100, Number(progress.toFixed(2)))
    }, 'enrolement/progress/update').subscribe({
      next: (response: any) => {
        console.log('Progress updated:', progress.toFixed(2) + '%');
      },
      error: (error) => {
        console.error('Error updating progress:', error);
      }
    });
  }

  // Calculate total course items (contents + quizzes + exams)
  getTotalCourseItems(): number {
    const contentCount = this.course.chapters?.reduce((sum: number, ch: any) => sum + (ch.contents?.length || 0), 0) || 0;
    const quizCount = this.course.quizzes?.length || 0;
    const examCount = this.course.exams?.length || 0;
    return contentCount + quizCount + examCount;
  }

  // Calculate completed items
  getCompletedItems(): number {
    // For now, we'll count content completion based on current logic
    // You might want to track individual content completion in the future
    const contentProgress = this.enrollment?.progress || 0;
    const totalContents = this.course.chapters?.reduce((sum: number, ch: any) => sum + (ch.contents?.length || 0), 0) || 0;
    const completedContents = Math.floor((contentProgress / 100) * totalContents);
    
    const completedQuizzes = this.completedQuizzes.size;
    const completedExams = this.completedExams.size;
    
    return completedContents + completedQuizzes + completedExams;
  }

  // Get total content count across all chapters
  getTotalContentCount(): number {
    return this.course.chapters?.reduce((sum: number, ch: any) => sum + (ch.contents?.length || 0), 0) || 0;
  }

  // Get content type label for display
  getContentTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'video': 'Vidéo',
      'pdf': 'PDF',
      'text': 'Texte',
      'image': 'Image',
      'audio': 'Audio'
    };
    return labels[type] || type;
  }

  // Check if content is completed (placeholder - implement based on your tracking logic)
  isContentCompleted(chapterIndex: number, contentIndex: number): boolean {
    // This is a placeholder - you'll need to implement actual content completion tracking
    // For now, we'll return false, but you can implement this based on your requirements
    return false;
  }

  // Handle content click (play video, open PDF, etc.) - MAIN IMPLEMENTATION
  handleContentClick(content: any, chapterIndex: number, contentIndex: number) {
    if (!this.isPurchased && !content.is_free) {
      alert('Vous devez être inscrit à ce cours pour accéder à ce contenu.');
      return;
    }

    console.log('Content clicked:', content);
    
    // Handle different content types
    switch (content.type) {
      case 'video':
        this.playVideo(content);
        break;
      case 'pdf':
        this.openPDF(content);
        break;
      case 'text':
        this.showTextContent(content);
        break;
      case 'audio':
        this.playAudio(content);
        break;
      case 'image':
        this.openImageModal(content.media_path?.original_url || content.media_link);
        break;
      default:
        console.log('Unknown content type:', content.type);
        // Fallback to old method for backward compatibility
    this.openContent(content);
    }

    // Mark content as viewed/completed and update progress
    this.markContentAsCompleted(chapterIndex, contentIndex);
    this.updateProgress(chapterIndex, contentIndex);
  }

  openContent(content: any) {
    if (content.type === 'image') {
      this.openImageModal(content.media_path?.original_url);
    } else if (content.type === 'video') {
      this.playVideoUrl(content.media_path?.original_url);
    } else if (content.type === 'pdf') {
      window.open(content.url, '_blank');
    }
  }

  updateProgress(chapterIndex: number, contentIndex: number) {
    const totalContents = this.course.chapters.reduce((sum :any, ch :any) => sum + ch.contents.length, 0);
    const flatIndex = this.getFlatContentIndex(chapterIndex, contentIndex);

    const progress = ((flatIndex + 1) / totalContents) * 100;

    this.accessDataService.postData({
      enrollmentId: this.enrollment.id,
      progress: progress.toFixed(2)
    },'enrolement/progress/update').subscribe(
          (response: any) => {
          },
          error => {
          },
          () => {
          }
        )
  }

  getFlatContentIndex(chapterIndex: number, contentIndex: number): number {
    let index = 0;
    for (let i = 0; i < chapterIndex; i++) {
      index += this.course.chapters[i].contents.length;
    }
    return index + contentIndex;
  }

  openImageModal(url: string) {
    this.modalImageUrl = url;
  }

  closeImageModal() {
    this.modalImageUrl = null;
  }

  // Play video with URL (for backward compatibility)
  playVideoUrl(url: string) {
    this.modalVideoUrl = url;
  }

  // Play video content - MAIN IMPLEMENTATION
  playVideo(content: any) {
    if (content.media_link) {
      this.modalVideoUrl = content.media_link;
      console.log('Playing video:', content.media_link);
    } else if (content.media_path?.original_url) {
      this.modalVideoUrl = content.media_path.original_url;
      console.log('Playing video:', content.media_path.original_url);
    } else {
      alert('Lien vidéo non disponible.');
    }
  }

  closeVideoModal() {
    this.modalVideoUrl = null;
  }

  getExamTypeIcon(exam: any): string {
    if (exam.isStatic) {
      return 'fas fa-star';
    }
    return 'fas fa-graduation-cap';
  }

  getExamTypeBadge(exam: any): string {
    if (exam.isStatic) {
      return 'badge-warning';
    }
    return 'badge-primary';
  }

  getExamTypeLabel(exam: any): string {
    if (exam.isStatic) {
      return 'Mini Exam';
    }
    return 'Examen';
  }

  // Helper method to get questions by section
  getQuestionsBySection(exam: any, section: string): any[] {
    if (!exam.questions) return [];
    
    // Check if this is a static exam with section properties
    const hasSection = exam.questions.some((q: any) => q.section);
    
    if (hasSection) {
      // Static exam with section properties - filter by section
    return exam.questions.filter((q: any) => q.section === section);
    } else {
      // Database exam without section properties - distribute questions by section
      const totalQuestions = exam.questions.length;
      
      if (section === 'Partie 1: Vrai ou Faux') {
        // Return first 3 questions (or 30% of total questions)
        const count = Math.min(3, Math.ceil(totalQuestions * 0.3));
        return exam.questions.slice(0, count);
      } else if (section === 'Partie 2: Choix Multiple') {
        // Return middle questions (40% of total questions)
        const startIndex = Math.min(3, Math.ceil(totalQuestions * 0.3));
        const count = Math.min(4, Math.ceil(totalQuestions * 0.4));
        return exam.questions.slice(startIndex, startIndex + count);
      } else if (section === 'Partie 3: Questions Ouvertes') {
        // Return remaining questions (30% of total questions)
        const startIndex = Math.min(7, Math.ceil(totalQuestions * 0.7));
        return exam.questions.slice(startIndex);
      }
    }
    
    return [];
  }

  // Helper method to get option letters (a, b, c, d)
  getOptionLetter(index: number): string {
    return String.fromCharCode(97 + index); // 97 is ASCII for 'a'
  }

  // Check if quiz is completed
  isQuizCompleted(quizId: number): boolean {
    return this.completedQuizzes.has(quizId);
  }

  // Check if exam is completed
  isExamCompleted(examId: number): boolean {
    return this.completedExams.has(examId);
  }

  // Get quiz completion status
  getQuizCompletionStatus(quizId: number): string {
    if (this.isQuizCompleted(quizId)) {
      const session = this.quizSessions.find(s => s.quiz_id === quizId && s.status === 'completed');
      return session?.passed ? 'Réussi' : 'Échoué';
    }
    return 'Non commencé';
  }

  // Get exam completion status
  getExamCompletionStatus(examId: number): string {
    if (this.isExamCompleted(examId)) {
      const session = this.examSessions.find(s => s.exam_id === examId && s.status === 'completed');
      return session?.passed ? 'Réussi' : 'Échoué';
    }
    return 'Non commencé';
  }

  // Open PDF content
  openPDF(content: any) {
    if (content.media_link) {
      window.open(content.media_link, '_blank');
    } else {
      alert('Lien PDF non disponible.');
    }
  }

  // Show text content
  showTextContent(content: any) {
    // You might want to open a modal with the text content
    alert('Contenu texte: ' + (content.description || 'Contenu non disponible'));
  }

  // Play audio content
  playAudio(content: any) {
    if (content.media_link) {
      // You might want to open an audio player modal
      console.log('Playing audio:', content.media_link);
    } else {
      alert('Lien audio non disponible.');
    }
  }

  // Mark content as completed (implement your tracking logic)
  markContentAsCompleted(chapterIndex: number, contentIndex: number) {
    // Implement your content completion tracking logic here
    // This might involve calling an API to update progress
    console.log(`Content marked as completed: Chapter ${chapterIndex}, Content ${contentIndex}`);
    
    // Update overall progress
    this.updateProgressWithQuizExam();
  }

  // Get quizzes for a specific chapter
  getChapterQuizzes(chapterId: number): any[] {
    return this.course.quizzes?.filter((quiz: any) => quiz.chapter_id === chapterId) || [];
  }

  // Get exams for a specific chapter
  getChapterExams(chapterId: number): any[] {
    return this.course.exams?.filter((exam: any) => exam.chapter_id === chapterId) || [];
  }

  // Get course-level quizzes (not tied to specific chapters)
  getCourseQuizzes(): any[] {
    return this.course.quizzes?.filter((quiz: any) => !quiz.chapter_id) || [];
  }

  // Get course-level exams (not tied to specific chapters)
  getCourseExams(): any[] {
    return this.course.exams?.filter((exam: any) => !exam.chapter_id) || [];
  }

  // Toggle chapter content visibility - MAIN IMPLEMENTATION
  toggleClass(index: number) {
    if (!this.isClassAdded) {
      this.isClassAdded = [];
    }
    this.isClassAdded[index] = !this.isClassAdded[index];
  }
}
