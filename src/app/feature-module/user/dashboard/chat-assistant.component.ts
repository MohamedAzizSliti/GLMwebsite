import { Component, OnInit } from '@angular/core';

interface ChatMessage {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  questionType?: 'multiple-choice' | 'yes-no' | 'text-input' | 'question-list';
  options?: string[];
  questionIndex?: number;
  isRecommendation?: boolean;
  recommendationType?: string;
}

interface Question {
  id: number;
  text: string;
  type: 'multiple-choice' | 'yes-no' | 'text-input';
  options?: string[];
  placeholder?: string;
}

@Component({
  selector: 'app-chat-assistant',
  templateUrl: './chat-assistant.component.html',
  styleUrls: ['./chat-assistant.component.scss'],
  standalone: false
})
export class ChatAssistantComponent implements OnInit {
  messages: ChatMessage[] = [];
  isTyping = false;
  currentQuestionIndex = -1; // Start with -1 to show question list first
  userInput = '';
  showInput = false;
  selectedQuestionIndex = -1;
  
  questions: Question[] = [
    {
      id: 1,
      text: "Quel est le domaine rencontres-tu le plus de difficultés en ce moment ?",
      type: 'multiple-choice',
      options: ['Python', 'Réseau', 'Base de données', 'Développement web', 'Autre']
    },
    {
      id: 2,
      text: "As-tu récemment échoué ou eu un score faible à un quiz ou un examen ?",
      type: 'yes-no',
      options: ['Oui', 'Non']
    },
    {
      id: 3,
      text: "Quel est ton objectif actuel ?",
      type: 'text-input',
      placeholder: "Ex: réviser un cours, améliorer mes notes, passer une certification..."
    }
  ];

  // Store answers for personalized responses
  selectedDifficulty = '';
  selectedFailedQuiz = '';
  quizName = '';
  userObjective = '';

  constructor() { }

  ngOnInit(): void {
    this.initializeChat();
  }

  initializeChat(): void {
    // Welcome message
    setTimeout(() => {
      this.addBotMessage("👋 Salut ! Je suis ton assistant d'apprentissage. Je vais te poser quelques questions pour mieux t'aider.");
      
      setTimeout(() => {
        this.showQuestionList();
      }, 1500);
    }, 1000);
  }

  showQuestionList(): void {
    const questionTexts = this.questions.map((q, index) => `${index + 1}. ${q.text}`);
    this.addBotMessage("Choisis une question à laquelle tu veux répondre :", questionTexts, 'question-list');
  }

  addBotMessage(text: string, options?: string[], questionType?: 'multiple-choice' | 'yes-no' | 'text-input' | 'question-list', questionIndex?: number, isRecommendation?: boolean, recommendationType?: string): void {
    this.isTyping = true;
    
    setTimeout(() => {
      const message: ChatMessage = {
        id: this.messages.length + 1,
        text: text,
        isBot: true,
        timestamp: new Date(),
        options: options,
        questionType: questionType,
        questionIndex: questionIndex,
        isRecommendation: isRecommendation,
        recommendationType: recommendationType
      };
      
      this.messages.push(message);
      this.isTyping = false;
      this.scrollToBottom();
    }, 1000);
  }

  addUserMessage(text: string): void {
    const message: ChatMessage = {
      id: this.messages.length + 1,
      text: text,
      isBot: false,
      timestamp: new Date()
    };
    
    this.messages.push(message);
    this.scrollToBottom();
  }

  selectQuestion(questionText: string): void {
    // Find which question was selected
    const questionIndex = this.questions.findIndex(q => questionText.includes(q.text));
    if (questionIndex !== -1) {
      this.selectedQuestionIndex = questionIndex;
      this.addUserMessage(questionText);
      
      setTimeout(() => {
        this.askSpecificQuestion(questionIndex);
      }, 1000);
    }
  }

  askSpecificQuestion(questionIndex: number): void {
    const question = this.questions[questionIndex];
    
    if (question.type === 'text-input') {
      this.addBotMessage(question.text);
      this.showInput = true;
    } else {
      this.addBotMessage(question.text, question.options, question.type, questionIndex);
    }
  }

  selectOption(option: string, questionIndex: number): void {
    this.addUserMessage(option);
    
    // Store answers for personalized responses
    if (questionIndex === 0) {
      this.selectedDifficulty = option;
      this.provideSubjectRecommendation(option);
    } else if (questionIndex === 1) {
      this.selectedFailedQuiz = option;
      this.provideQuizRecommendation(option);
    }
  }

  provideSubjectRecommendation(subject: string): void {
    let recommendationText = '';
    let recommendationType = '';
    
    switch (subject) {
      case 'Python':
        recommendationText = `🐍 Parfait ! Pour Python, je recommande :
        
📚 **Cours suggérés :**
• Les bases de Python (variables, boucles, fonctions)
• Programmation orientée objet en Python
• Manipulation de données avec Pandas

🎯 **Quiz pratiques :**
• Quiz Python débutant (20 questions)
• Exercices sur les listes et dictionnaires
• Défis de programmation Python

💡 **Astuce :** Commence par réviser les concepts de base avant de passer aux projets avancés !`;
        recommendationType = 'python';
        break;
        
      case 'Réseau':
        recommendationText = `🌐 Excellent choix ! Pour les réseaux :
        
📚 **Cours recommandés :**
• Fondamentaux des réseaux TCP/IP
• Configuration des routeurs et switches
• Sécurité réseau et pare-feu

🎯 **Labs pratiques :**
• Simulation réseau avec Packet Tracer
• Configuration VLAN
• Diagnostic de problèmes réseau

💡 **Conseil :** La pratique avec des simulateurs est essentielle !`;
        recommendationType = 'network';
        break;
        
      case 'Base de données':
        recommendationText = `🗄️ Super ! Pour les bases de données :
        
📚 **Cours essentiels :**
• SQL fondamental (SELECT, INSERT, UPDATE)
• Conception de bases de données relationnelles
• Optimisation des requêtes

🎯 **Exercices pratiques :**
• Création de schémas de base
• Requêtes SQL complexes
• Gestion des index et performances

💡 **Tip :** Pratique avec des vraies bases de données !`;
        recommendationType = 'database';
        break;
        
      case 'Développement web':
        recommendationText = `💻 Génial ! Pour le développement web :
        
📚 **Parcours suggéré :**
• HTML5 et CSS3 modernes
• JavaScript ES6+ et DOM
• Frameworks (React, Angular, Vue)

🎯 **Projets pratiques :**
• Site web responsive
• Application web interactive
• API REST avec Node.js

💡 **Recommandation :** Construis des projets concrets !`;
        recommendationType = 'webdev';
        break;
        
      default:
        recommendationText = `🎯 Pas de problème ! Voici des ressources générales :
        
📚 **Cours populaires :**
• Algorithmique et structures de données
• Gestion de projet informatique
• Méthodologies de développement

🎯 **Compétences transversales :**
• Résolution de problèmes
• Travail en équipe
• Veille technologique

💡 **Conseil :** Identifie tes intérêts spécifiques !`;
        recommendationType = 'general';
    }
    
    setTimeout(() => {
      this.addBotMessage(recommendationText, undefined, undefined, undefined, true, recommendationType);
      
      setTimeout(() => {
        this.askIfMoreQuestions();
      }, 2000);
    }, 1500);
  }

  provideQuizRecommendation(answer: string): void {
    if (answer === 'Oui') {
      setTimeout(() => {
        this.addBotMessage("Peux-tu préciser le nom du quiz ou examen ?");
        this.showInput = true;
      }, 1000);
    } else {
      setTimeout(() => {
        this.addBotMessage(`✅ Parfait ! Continue comme ça ! Voici quelques quiz pour renforcer tes connaissances :

🎯 **Quiz recommandés :**
• Quiz de révision générale
• Tests de compréhension
• Exercices pratiques
• Simulations d'examen

💪 Garde cette motivation !`, undefined, undefined, undefined, true, 'quiz-success');
        
        setTimeout(() => {
          this.askIfMoreQuestions();
        }, 2000);
      }, 1000);
    }
  }

  sendTextInput(): void {
    if (this.userInput.trim()) {
      if (this.selectedQuestionIndex === 1 && this.selectedFailedQuiz === 'Oui') {
        // Quiz name follow-up
        this.quizName = this.userInput;
        this.addUserMessage(this.userInput);
        this.userInput = '';
        this.showInput = false;
        
        setTimeout(() => {
          this.addBotMessage(`📚 Je vois que tu as eu des difficultés avec "${this.quizName}". 

🎯 **Plan de révision personnalisé :**
• Révision ciblée des concepts du quiz
• Exercices pratiques similaires
• Quiz d'entraînement progressifs
• Session de révision avant le prochain test

💪 Ne t'inquiète pas, nous allons t'aider à réussir la prochaine fois !`, undefined, undefined, undefined, true, 'quiz-help');
          
          setTimeout(() => {
            this.askIfMoreQuestions();
          }, 2000);
        }, 1000);
      } else if (this.selectedQuestionIndex === 2) {
        // Objective question
        this.userObjective = this.userInput;
        this.addUserMessage(this.userInput);
        this.userInput = '';
        this.showInput = false;
        
        setTimeout(() => {
          this.addBotMessage(`🎯 Excellent objectif : "${this.userObjective}" !

📋 **Plan d'action suggéré :**
• Identifie les compétences nécessaires
• Crée un planning d'étude
• Pratique régulièrement
• Évalue tes progrès

🚀 **Ressources recommandées :**
• Cours ciblés sur ton objectif
• Exercices pratiques
• Projets concrets
• Communauté d'apprentissage

Tu es sur la bonne voie ! 💪`, undefined, undefined, undefined, true, 'objective-plan');
          
          setTimeout(() => {
            this.askIfMoreQuestions();
          }, 2000);
        }, 1000);
      }
    }
  }

  askIfMoreQuestions(): void {
    setTimeout(() => {
      this.addBotMessage("Veux-tu répondre à une autre question ?", ['Oui, une autre question', 'Non, c\'est bon'], 'yes-no', -1);
    }, 1000);
  }

  handleMoreQuestions(answer: string): void {
    this.addUserMessage(answer);
    
    if (answer === 'Oui, une autre question') {
      setTimeout(() => {
        this.showQuestionList();
      }, 1000);
    } else {
      setTimeout(() => {
        this.addBotMessage(`🎉 Merci pour tes réponses ! 

📱 **Accès rapide :**`, ['📚 Voir les cours', '🎯 Faire un quiz', '📊 Tableau de bord'], 'multiple-choice', -1, true, 'final');
      }, 1000);
    }
  }

  handleFinalAction(action: string): void {
    this.addUserMessage(action);
    
    setTimeout(() => {
      switch (action) {
        case '📚 Voir les cours':
          this.addBotMessage("🎓 Redirection vers tes cours recommandés en cours...");
          break;
        case '🎯 Faire un quiz':
          this.addBotMessage("🎮 Préparation d'un quiz personnalisé en cours...");
          break;
        case '📊 Tableau de bord':
          this.addBotMessage("📈 Ouverture de ton tableau de bord personnalisé...");
          break;
      }
    }, 1000);
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }
} 