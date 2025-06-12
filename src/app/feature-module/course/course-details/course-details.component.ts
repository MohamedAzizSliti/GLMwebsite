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

    constructor(private router: Router,
                private accessDataService:AccessDataService,
                private globalService:GlobalService,
                private http:HttpClient,
                private quizModalService: QuizModalService,
                private route : ActivatedRoute) {
    this.currentUser = this.globalService.getCurrentUser();
    }
    bsValue=new Date();
    public isClassAdded: boolean[] = [false];
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
  toggleClass(index: number){
    this.isClassAdded[index] = !this.isClassAdded[index]
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
    this.route.params
      .subscribe((params:any) => {
        if (params.id){
          this.accessDataService.getData(null,'course/'+params.id).subscribe(
            (response: any) => {
              this.course = response.data;
              
              // Add static exam to the course if it's course ID 16
              if (params.id == '16') {
                // Initialize exams array if it doesn't exist
                if (!this.course.exams) {
                  this.course.exams = [];
                }
                
                // Check if static exam is not already added
                const hasStaticExam = this.course.exams.some((exam: any) => exam.id === this.staticExam.id);
                if (!hasStaticExam) {
                  this.course.exams.unshift(this.staticExam); // Add at the beginning
                  console.log('Static exam added:', this.staticExam);
                  console.log('Course exams now:', this.course.exams);
                }
              }
              
              this.accessDataService.getData(null,'rollements-course/'+params.id+'/'+this.currentUser.id).subscribe(
                    (response: any) => {
                      this.enrollment = response;
                    },
                    error => {
                    },
                    () => {
                    }
                  )

            },
            error => {
            },
            () => {
            }
          );
        }else{
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
    // Handle static exam differently
    if (exam.isStatic) {
      this.openStaticExam(exam);
      return;
    }

    this.accessDataService.getData(null,'examen/'+exam.id).subscribe(
      (response: any) => {
        const examData: Exam = {
          id: response.exam.id,
          title: response.exam.title,
          duration: response.exam.duration,
          mark_per_question: response.exam.mark_per_question,
          pass_marks: response.exam.pass_marks,
          course_id: response.exam.course_id,
          created_at: response.exam.created_at,
          updated_at: response.exam.updated_at,
          nbr_question: response.exam.questions.length,
          questions: response.exam.questions.map((q: any) => ({
            id: q.id,
            question_text: q.question_text,
            question_type: q.question_type,
            options: q.question_type === 'multiple_choice' ? [
              { text: q.option_1?.text || '', is_correct: q.option_1?.is_correct || false },
              { text: q.option_2?.text || '', is_correct: q.option_2?.is_correct || false },
              { text: q.option_3?.text || '', is_correct: q.option_3?.is_correct || false },
              { text: q.option_4?.text || '', is_correct: q.option_4?.is_correct || false }
            ] : [],
            correct_option: q.correct_option,
            prompt_answer: q.prompt_answer,
            max_words: q.max_words
          }))
        };

        this.quizModalService.openModal(examData);
      },
      error => {
        console.error('Error loading exam:', error);
      }
    );
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
        question_text: q.question_text,
        question_type: q.question_type,
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

  openQuiz(idQuiz:any){
    // For now, we'll need to implement quiz loading similar to exam loading
    // Since openQuizModal doesn't exist, we'll handle it differently
    console.log('Quiz functionality needs to be implemented for quiz ID:', idQuiz);
  }

  handleContentClick(content: any, chapterIndex: number, contentIndex: number) {
    this.openContent(content);
    this.updateProgress(chapterIndex, contentIndex);
  }

  openContent(content: any) {

    if (content.type === 'image') {
      this.openImageModal(content.media_path?.original_url);
    } else if (content.type === 'video') {
      this.playVideo(content.media_path?.original_url);
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

  playVideo(url: string) {
    this.modalVideoUrl = url;
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
    return exam.questions.filter((q: any) => q.section === section);
  }

  // Helper method to get option letters (a, b, c, d)
  getOptionLetter(index: number): string {
    return String.fromCharCode(97 + index); // 97 is ASCII for 'a'
  }
}
