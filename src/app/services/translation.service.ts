import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Translation {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguageSubject = new BehaviorSubject<string>('fr');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private translations: { [lang: string]: Translation } = {
    fr: {
      // Navigation
      'nav.home': 'Accueil',
      'nav.courses': 'Cours',
      'nav.about': 'À Propos',
      'nav.contact': 'Contact',
      'nav.login': 'Connexion',
      'nav.register': 'Inscription',
      'nav.logout': 'Déconnexion',
      'nav.dashboard': 'Tableau de bord',
      'nav.my_courses': 'Mes cours',
      'nav.profile': 'Profil',
      'nav.back_to_dashboard': 'Retour au tableau de bord',
      'nav.back_to_course': 'Retour au cours',
      'nav.chat_assistant': 'Assistant Chat',
      
      // Authentication
      'auth.welcome': 'Bienvenue à Gold LMS',
      'auth.login_success': 'Connexion réussie',
      'auth.register_success': 'Votre compte a été créé avec succès',
      'auth.logout_success': 'Déconnexion réussie',
      'auth.email': 'Email',
      'auth.password': 'Mot de passe',
      'auth.confirm_password': 'Confirmer le mot de passe',
      'auth.name': 'Nom',
      'auth.phone': 'Téléphone',
      
      // Buttons
      'btn.submit': 'Soumettre',
      'btn.cancel': 'Annuler',
      'btn.save': 'Enregistrer',
      'btn.edit': 'Modifier',
      'btn.delete': 'Supprimer',
      'btn.view': 'Voir',
      'btn.back': 'Retour',
      
      // Messages
      'msg.loading': 'Chargement...',
      'msg.error': 'Une erreur est survenue',
      'msg.success': 'Opération réussie',
      'msg.no_data': 'Aucune donnée disponible',
      
      // Courses
      'course.title': 'Titre du cours',
      'course.description': 'Description',
      'course.price': 'Prix',
      'course.level': 'Niveau',
      'course.language': 'Langue',
      'course.create': 'Créer un cours',
      'course.edit': 'Modifier le cours',
      'course.delete': 'Supprimer le cours',
      
      // Roles
      'role.student': 'Étudiant',
      'role.teacher': 'Enseignant',
      'role.admin': 'Administrateur',

      // Common
      'common.main': 'Principal',
      'common.settings': 'Paramètres',
      'common.search': 'Rechercher',
      'common.filter': 'Filtrer',
      'common.sort': 'Trier',

      // Sidebar
      'sidebar.dashboard': 'Tableau de bord',
      'sidebar.chat_assistant': 'Assistant Chat',
      'sidebar.my_enrollments': 'Mes Inscriptions',
      'sidebar.my_courses': 'Mes cours',
      'sidebar.add_course': 'Ajouter un cours',

      // Registration
      'register.step1.title': 'Créez votre compte',
      'register.step1.desc': 'Inscrivez-vous en tant qu\'étudiant pour accéder à l\'ensemble des cours disponibles sur la plateforme.',
      'register.step2.title': 'Explorez les cours',
      'register.step2.desc': 'Découvrez notre large gamme de cours dans différents domaines.',
      'register.step3.title': 'Commencez à apprendre',
      'register.step3.desc': 'Suivez vos cours préférés et développez vos compétences.',
      'register.become_student': 'Étudiant',
      'register.become_teacher': 'Formateur',
      'register.agree_terms': 'J\'accepte les conditions',
      'register.terms_conditions': 'générales d\'utilisation.',
      'register.submit': 'Inscrire',
      'register.title': 'Inscription',
      'register.subtitle': 'Créer votre compte',
      'register.login_link': 'Avez-vous déjà un compte ?',
      'register.sign_in': 'Se connecter',

      // Login
      'login.title': 'Connectez-vous',
      'login.subtitle': 'Connectez-vous pour commencer à gérer votre compte Gold LMS',
      'login.remember_me': 'Se souvenir de moi',
      'login.forgot_password': 'Mot de passe oublié ?',
      'login.no_account': 'Vous n\'avez pas de compte ?',
      'login.sign_up': 'S\'inscrire',

      // Header & Navigation
      'header.login': 'Se connecter',
      'header.register': 'S\'inscrire',
      'header.profile': 'Mon Profil',
      'header.students': 'Étudiants',
      'header.certifications': 'Certifications',
      'header.add_course': 'Ajouter un cours',
      'header.browse_courses': 'Parcourir les cours',
      'header.contact_us': 'Contactez-nous',
      'header.email': 'Email',

      // Forms
      'form.name': 'Nom',
      'form.email': 'Email',
      'form.phone': 'Téléphone',
      'form.password': 'Mot de passe',
      'form.confirm_password': 'Confirmer le mot de passe',
      'form.enter_name': 'Entrez votre nom',
      'form.enter_email': 'Entrez votre email',
      'form.enter_phone': 'Entrez votre téléphone',
      'form.enter_password': 'Entrez votre mot de passe',

      // Password
      'password.change': 'Changer le mot de passe',
      'password.forgot': 'Mot de passe oublié',
      'password.reset': 'Réinitialiser le mot de passe',
      'password.remember': 'Se souvenir du mot de passe ?',

      // Teacher specific
      'teacher.create_account': 'Créer un compte formateur',
      'teacher.create_account_desc': 'Pour commencer à diffuser des cours',
      'teacher.step1.title': 'Inscrivez-vous',
      'teacher.step1.desc': 'Créez votre compte en remplissant notre formulaire d\'inscription rapide, puis configurez votre profil formateur.',
      'teacher.step2.title': 'Publiez vos cours',
      'teacher.step2.desc': 'Ajoutez vos cours avec des descriptions détaillées, des quiz, des examens et fixez votre prix pour attirer plus d\'apprenants.',
      'teacher.step3.title': 'Commencez à enseigner',
      'teacher.step3.desc': 'Les étudiants découvriront vos cours, les achèteront directement via la plateforme, et vous commencerez à générer des revenus.',
      'teacher.how_it_works': 'Comment ça fonctionne',
      'teacher.how_it_works_desc': 'Découvrez à quel point il est simple de partager vos connaissances. Suivez ces étapes pour publier vos cours et générer des revenus grâce à votre expertise !',

      // Student specific
      'student.create_account': 'Créer un compte étudiant',
      'student.create_account_desc': 'Pour commencer à suivre des cours',
      'student.how_it_works': 'Comment ça fonctionne',
      'student.how_it_works_desc': 'Suivez ces étapes simples pour découvrir, acheter et suivre des cours en ligne selon votre rythme.',
      'student.step3_title': 'Apprenez à votre rythme',
      'student.step3_desc': 'Accédez aux vidéos, quiz, examens et suivez votre progression depuis votre espace personnel sécurisé.',

      // Chat
      'chat.chat_with': 'Chat avec',
      'chat.messages': 'Messages',
      'chat.no_conversations': 'Aucune conversation',
      'chat.new_conversation': 'Nouvelle conversation',

      // Certification
      'certification.management': 'Gestion des Certifications',
      'certification.manage_description': 'Gérez les certifications de vos étudiants',
      'certification.students': 'Étudiants',
      'certification.certified': 'Certifiés',
      'certification.total_students': 'Total Étudiants',
      'certification.pending': 'En Attente',
      'certification.not_eligible': 'Non Éligibles',
      'certification.list': 'Liste des Certifications',
      'certification.student': 'Étudiant',
      'certification.course': 'Cours',
      'certification.quizzes_completed': 'Quiz complétés',
      'certification.average_score': 'Score moyen',
      'certification.status': 'Certification',
      'certification.actions': 'Actions',
      'certification.validate': 'Valider',
      'certification.view_details': 'Voir les détails',
      'certification.download_certificate': 'Télécharger le certificat',
      'certification.all': 'Tous',
      'btn.refresh': 'Actualiser',
      'certification.confirm_validate': 'Êtes-vous sûr de vouloir valider la certification pour {name} ?',
      'certification.validation_success': 'Certification validée avec succès pour {name} !',
      'common.data_refreshed': 'Données actualisées avec succès',
      'certification.loading_data': 'Chargement des données de certification...',
      'certification.no_students': 'Aucun étudiant trouvé',
      'certification.no_students_description': 'Il n\'y a actuellement aucun étudiant inscrit à vos cours.',
      'common.loading': 'Chargement',

    },
    en: {
      // Navigation
      'nav.home': 'Home',
      'nav.courses': 'Courses',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'nav.login': 'Login',
      'nav.register': 'Register',
      'nav.logout': 'Logout',
      'nav.dashboard': 'Dashboard',
      'nav.my_courses': 'My Courses',
      'nav.profile': 'Profile',
      'nav.back_to_dashboard': 'Back to Dashboard',
      'nav.back_to_course': 'Back to Course',
      'nav.chat_assistant': 'Chat Assistant',
      
      // Authentication
      'auth.welcome': 'Welcome to Gold LMS',
      'auth.login_success': 'Login successful',
      'auth.register_success': 'Your account has been created successfully',
      'auth.logout_success': 'Logout successful',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.confirm_password': 'Confirm Password',
      'auth.name': 'Name',
      'auth.phone': 'Phone',
      
      // Buttons
      'btn.submit': 'Submit',
      'btn.cancel': 'Cancel',
      'btn.save': 'Save',
      'btn.edit': 'Edit',
      'btn.delete': 'Delete',
      'btn.view': 'View',
      'btn.back': 'Back',
      
      // Messages
      'msg.loading': 'Loading...',
      'msg.error': 'An error occurred',
      'msg.success': 'Operation successful',
      'msg.no_data': 'No data available',
      
      // Courses
      'course.title': 'Course Title',
      'course.description': 'Description',
      'course.price': 'Price',
      'course.level': 'Level',
      'course.language': 'Language',
      'course.create': 'Create Course',
      'course.edit': 'Edit Course',
      'course.delete': 'Delete Course',
      
      // Roles
      'role.student': 'Student',
      'role.teacher': 'Teacher',
      'role.admin': 'Administrator',

      // Common
      'common.main': 'Main',
      'common.settings': 'Settings',
      'common.search': 'Search',
      'common.filter': 'Filter',
      'common.sort': 'Sort',

      // Sidebar
      'sidebar.dashboard': 'Dashboard',
      'sidebar.chat_assistant': 'Chat Assistant',
      'sidebar.my_enrollments': 'My Enrollments',
      'sidebar.my_courses': 'My Courses',
      'sidebar.add_course': 'Add Course',

      // Registration
      'register.step1.title': 'Create your account',
      'register.step1.desc': 'Register as a student to access all available courses on the platform.',
      'register.step2.title': 'Explore courses',
      'register.step2.desc': 'Discover our wide range of courses in different fields.',
      'register.step3.title': 'Start learning',
      'register.step3.desc': 'Follow your favorite courses and develop your skills.',
      'register.become_student': 'Student',
      'register.become_teacher': 'Teacher',
      'register.agree_terms': 'I accept the',
      'register.terms_conditions': 'terms and conditions.',
      'register.submit': 'Register',
      'register.title': 'Registration',
      'register.subtitle': 'Create your account',
      'register.login_link': 'Already have an account?',
      'register.sign_in': 'Sign In',

      // Login
      'login.title': 'Sign In',
      'login.subtitle': 'Sign in to start managing your Gold LMS account',
      'login.remember_me': 'Remember Me',
      'login.forgot_password': 'Forgot Password?',
      'login.no_account': 'Don\'t have an account?',
      'login.sign_up': 'Sign Up',

      // Header & Navigation
      'header.login': 'Login',
      'header.register': 'Register',
      'header.profile': 'My Profile',
      'header.students': 'Students',
      'header.certifications': 'Certifications',
      'header.add_course': 'Add Course',
      'header.browse_courses': 'Browse Courses',
      'header.contact_us': 'Contact Us',
      'header.email': 'Email',

      // Forms
      'form.name': 'Name',
      'form.email': 'Email',
      'form.phone': 'Phone',
      'form.password': 'Password',
      'form.confirm_password': 'Confirm Password',
      'form.enter_name': 'Enter your name',
      'form.enter_email': 'Enter your email',
      'form.enter_phone': 'Enter your phone',
      'form.enter_password': 'Enter your password',

      // Password
      'password.change': 'Change Password',
      'password.forgot': 'Forgot Password',
      'password.reset': 'Reset Password',
      'password.remember': 'Remember Password?',

      // Teacher specific
      'teacher.create_account': 'Create Teacher Account',
      'teacher.create_account_desc': 'To start teaching courses',
      'teacher.step1.title': 'Sign Up',
      'teacher.step1.desc': 'Create your account by filling out our quick registration form, then set up your teacher profile.',
      'teacher.step2.title': 'Publish Your Courses',
      'teacher.step2.desc': 'Add your courses with detailed descriptions, quizzes, exams and set your price to attract more learners.',
      'teacher.step3.title': 'Start Teaching',
      'teacher.step3.desc': 'Students will discover your courses, purchase them directly through the platform, and you\'ll start generating revenue.',
      'teacher.how_it_works': 'How It Works',
      'teacher.how_it_works_desc': 'Discover how simple it is to share your knowledge. Follow these steps to publish your courses and generate revenue from your expertise!',

      // Student specific
      'student.create_account': 'Create Student Account',
      'student.create_account_desc': 'To start taking courses',
      'student.how_it_works': 'How It Works',
      'student.how_it_works_desc': 'Follow these simple steps to discover, purchase and take online courses at your own pace.',
      'student.step3_title': 'Learn at Your Own Pace',
      'student.step3_desc': 'Access videos, quizzes, exams and track your progress from your secure personal space.',

      // Chat
      'chat.chat_with': 'Chat with',
      'chat.messages': 'Messages',
      'chat.no_conversations': 'No conversations',
      'chat.new_conversation': 'New conversation',

      // Certification
      'certification.management': 'Certification Management',
      'certification.manage_description': 'Manage the certifications of your students',
      'certification.students': 'Students',
      'certification.certified': 'Certified',
      'certification.total_students': 'Total Students',
      'certification.pending': 'Pending',
      'certification.not_eligible': 'Not Eligible',
      'certification.list': 'Certification List',
      'certification.student': 'Student',
      'certification.course': 'Course',
      'certification.quizzes_completed': 'Quizzes Completed',
      'certification.average_score': 'Average Score',
      'certification.status': 'Certification Status',
      'certification.actions': 'Actions',
      'certification.validate': 'Validate',
      'certification.view_details': 'View Details',
      'certification.download_certificate': 'Download Certificate',
      'certification.all': 'All',
      'btn.refresh': 'Refresh',
      'certification.confirm_validate': 'Are you sure you want to validate the certification for {name}?',
      'certification.validation_success': 'Certification successfully validated for {name}!',
      'common.data_refreshed': 'Data refreshed successfully',
      'certification.loading_data': 'Loading certification data...',
      'certification.no_students': 'No students found',
      'certification.no_students_description': 'There are currently no students enrolled in your courses.',
      'common.loading': 'Loading',

    }
  };

  constructor() {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem('language') || 'fr';
    this.setLanguage(savedLang);
  }

  setLanguage(lang: string) {
    if (this.translations[lang]) {
      this.currentLanguageSubject.next(lang);
      localStorage.setItem('language', lang);
      
      // Set document language
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', lang);
    }
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  translate(key: string, params?: { [key: string]: string | number }): string {
    const currentLang = this.getCurrentLanguage();
    let translation = this.translations[currentLang]?.[key];
    
    if (!translation) {
      return key; // Return key if translation not found
    }
    
    // Replace parameters in the translation if provided
    if (params) {
      Object.keys(params).forEach(paramKey => {
        const placeholder = `{${paramKey}}`;
        translation = translation.replace(new RegExp(placeholder, 'g'), String(params[paramKey]));
      });
    }
    
    return translation;
  }

  getAvailableLanguages(): { code: string, name: string, flag: string }[] {
    return [
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'en', name: 'English', flag: '🇺🇸' }
    ];
  }
}
