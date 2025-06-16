import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeminiService } from '../../../shared/services/gemini.service';

interface ChatMessage {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  questionType?: 'multiple-choice' | 'yes-no' | 'text-input' | 'question-list' | 'ai-chat';
  options?: string[];
  questionIndex?: number;
  isRecommendation?: boolean;
  recommendationType?: string;
  senderId?: number;
  senderName?: string;
  isCurrentUser?: boolean;
}

interface Question {
  id: number;
  text: string;
  type: 'multiple-choice' | 'yes-no' | 'text-input';
  options?: string[];
  placeholder?: string;
}

interface User {
  id: number;
  name: string;
  avatar?: string;
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
  currentQuestionIndex = -1;
  userInput = '';
  showInput = false;
  selectedQuestionIndex = -1;
  
  // Dynamic chat mode
  isDynamicChatMode = false;
  currentUser: User | null = null;
  chatPartner: User | null = null;
  conversationId: string = '';
  
  // AI Chat mode
  isAIChatMode = false;
  showAITuning = false;
  
  // AI Tuning Options
  aiPersonality: 'helpful' | 'professional' | 'friendly' = 'helpful';
  aiResponseLength: 'short' | 'medium' | 'detailed' = 'medium';
  aiExpertise: 'beginner' | 'intermediate' | 'advanced' = 'intermediate';
  
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

  constructor(
    private geminiService: GeminiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Check URL parameters for dynamic chat
    this.route.queryParams.subscribe(params => {
      if (params['userId'] && params['userName']) {
        this.initializeDynamicChat(params['userId'], params['userName']);
      } else {
        this.initializeChat();
      }
    });
  }

  initializeDynamicChat(userId: string, userName: string): void {
    this.isDynamicChatMode = true;
    this.showInput = true;
    
    // Set chat partner
    this.chatPartner = {
      id: parseInt(userId),
      name: userName,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=007bff&color=fff`
    };
    
    // Set current user (in a real app, get this from auth service)
    this.currentUser = {
      id: 1, // Should come from auth service
      name: 'Vous', // Should come from auth service
      avatar: 'https://ui-avatars.com/api/?name=Vous&background=28a745&color=fff'
    };

    this.conversationId = `chat_${this.currentUser.id}_${this.chatPartner.id}`;
    
    // Load conversation history
    this.loadChatHistory();
    
    // Add welcome message
    setTimeout(() => {
      this.addSystemMessage(`💬 Conversation avec ${userName}`);
    }, 500);
  }

  loadChatHistory(): void {
    // Simulate loading chat history from localStorage or API
    const savedMessages = localStorage.getItem(this.conversationId);
    
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        this.messages = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (error) {
        console.error('Error loading chat history:', error);
        this.messages = [];
      }
    } else {
      // Create initial conversation
      this.messages = [
        {
          id: 1,
          text: `Salut ! Je suis ${this.chatPartner?.name}. Comment puis-je t'aider aujourd'hui ?`,
          isBot: false,
          timestamp: new Date(Date.now() - 300000), // 5 minutes ago
          senderId: this.chatPartner?.id,
          senderName: this.chatPartner?.name,
          isCurrentUser: false
        }
      ];
    }
    
    this.scrollToBottom();
  }

  saveChatHistory(): void {
    // Save messages to localStorage (in a real app, save to API)
    try {
      localStorage.setItem(this.conversationId, JSON.stringify(this.messages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }

  addSystemMessage(text: string): void {
    const message: ChatMessage = {
      id: this.messages.length + 1,
      text: text,
      isBot: true,
      timestamp: new Date(),
      senderId: 0,
      senderName: 'Système'
    };
    
    this.messages.push(message);
    this.scrollToBottom();
  }

  initializeChat(): void {
    // Welcome message
    setTimeout(() => {
      this.addBotMessage("👋 Salut ! Je suis ton assistant d'apprentissage alimenté par l'IA. Je vais te poser quelques questions pour mieux t'aider.");
      
      setTimeout(() => {
        this.showQuestionList();
      }, 1500);
    }, 1000);
  }

  showQuestionList(): void {
    const questionTexts = this.questions.map((q, index) => `${index + 1}. ${q.text}`);
    // Add AI chat option
    questionTexts.push("4. 🤖 Chat libre avec l'IA");
    this.addBotMessage("Choisis une question à laquelle tu veux répondre :", questionTexts, 'question-list');
  }

  addBotMessage(text: string, options?: string[], questionType?: 'multiple-choice' | 'yes-no' | 'text-input' | 'question-list' | 'ai-chat', questionIndex?: number, isRecommendation?: boolean, recommendationType?: string): void {
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
    // Check if AI chat was selected
    if (questionText.includes("🤖 Chat libre avec l'IA")) {
      this.startAIChat();
      return;
    }
    
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

  startAIChat(): void {
    this.isAIChatMode = true;
    this.addUserMessage("🤖 Chat libre avec l'IA");
    
    setTimeout(() => {
      this.addBotMessage("🤖 Parfait ! Je suis maintenant en mode chat libre. Tu peux me poser n'importe quelle question sur tes cours, tes difficultés, ou demander des conseils d'apprentissage. Que veux-tu savoir ?", ['⚙️ Régler l\'IA'], 'ai-chat');
      this.showInput = true;
    }, 1000);
  }

  toggleAITuning(): void {
    this.showAITuning = !this.showAITuning;
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

  async provideSubjectRecommendation(subject: string): Promise<void> {
    let recommendationText = '';
    let recommendationType = '';
    
    // Generate AI-enhanced recommendations
    try {
      const aiPrompt = this.generateAIPrompt(`L'étudiant a des difficultés en ${subject}. Donne des recommandations personnalisées avec des cours, quiz et conseils pratiques.`);
      const aiRecommendation = await this.geminiService.generateResponse(`Difficultés en ${subject}`, aiPrompt);
      
      recommendationText = `🎯 **Recommandations IA pour ${subject} :**\n\n${aiRecommendation}`;
      recommendationType = subject.toLowerCase();
    } catch (error) {
      // Fallback to original recommendations
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

  async sendMessage(): Promise<void> {
    // No event parameter needed - direct method call
    if (!this.userInput || !this.userInput.trim()) {
      console.log('Empty input, not sending message');
      return;
    }

    console.log('Sending message:', this.userInput.trim());
    const userMessage = this.userInput.trim();
    this.addUserMessage(userMessage);
    
    if (this.isAIChatMode) {
      // AI Chat mode
      this.userInput = '';
      this.isTyping = true;
      
      try {
        const aiPrompt = this.generateAIPrompt("Tu es un assistant d'apprentissage. Réponds de manière utile et encourageante.");
        const aiResponse = await this.geminiService.generateResponse(userMessage, aiPrompt);
        
        this.isTyping = false;
        this.addBotMessage(aiResponse);
      } catch (error) {
        console.error('AI response error:', error);
        this.isTyping = false;
        const fallbackResponse = this.geminiService.generateFallbackResponse(userMessage, 'learning');
        this.addBotMessage(fallbackResponse);
      }
    } else {
      // Original logic for quiz/objective questions
      this.userInput = '';
      this.showInput = false;
      
      if (this.selectedQuestionIndex === 1 && this.selectedFailedQuiz === 'Oui') {
        // Quiz name follow-up with AI enhancement
        this.quizName = userMessage;
        
        setTimeout(async () => {
          try {
            const aiPrompt = this.generateAIPrompt(`L'étudiant a échoué au quiz "${this.quizName}". Donne un plan de révision personnalisé et encourageant.`);
            const aiResponse = await this.geminiService.generateResponse(`Plan de révision pour ${this.quizName}`, aiPrompt);
            
            this.addBotMessage(`📚 **Plan de révision IA pour "${this.quizName}" :**\n\n${aiResponse}`, undefined, undefined, undefined, true, 'quiz-help');
          } catch (error) {
            // Fallback to original response
            this.addBotMessage(`📚 Je vois que tu as eu des difficultés avec "${this.quizName}". 

🎯 **Plan de révision personnalisé :**
• Révision ciblée des concepts du quiz
• Exercices pratiques similaires
• Quiz d'entraînement progressifs
• Session de révision avant le prochain test

💪 Ne t'inquiète pas, nous allons t'aider à réussir la prochaine fois !`, undefined, undefined, undefined, true, 'quiz-help');
          }
          
          setTimeout(() => {
            this.askIfMoreQuestions();
          }, 2000);
        }, 1000);
      } else if (this.selectedQuestionIndex === 2) {
        // Objective question with AI enhancement
        this.userObjective = userMessage;
        
        setTimeout(async () => {
          try {
            const aiPrompt = this.generateAIPrompt(`L'étudiant a pour objectif: "${this.userObjective}". Crée un plan d'action détaillé et motivant.`);
            const aiResponse = await this.geminiService.generateResponse(`Plan pour objectif: ${this.userObjective}`, aiPrompt);
            
            this.addBotMessage(`🎯 **Plan d'action IA pour "${this.userObjective}" :**\n\n${aiResponse}`, undefined, undefined, undefined, true, 'objective-plan');
          } catch (error) {
            // Fallback to original response
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
          }
          
          setTimeout(() => {
            this.askIfMoreQuestions();
          }, 2000);
        }, 1000);
      }
    }
  }

  generateAIPrompt(context: string): string {
    let prompt = "Tu es un assistant d'apprentissage pour une plateforme LMS. ";
    
    // Add personality
    switch (this.aiPersonality) {
      case 'helpful':
        prompt += "Tu es serviable, encourageant et patient. ";
        break;
      case 'professional':
        prompt += "Tu es professionnel et précis. ";
        break;
      case 'friendly':
        prompt += "Tu es amical et accessible. ";
        break;
    }
    
    // Add response length
    switch (this.aiResponseLength) {
      case 'short':
        prompt += "Garde tes réponses courtes et concises. ";
        break;
      case 'medium':
        prompt += "Donne des réponses de longueur moyenne. ";
        break;
      case 'detailed':
        prompt += "Fournis des réponses détaillées. ";
        break;
    }
    
    // Add expertise level
    switch (this.aiExpertise) {
      case 'beginner':
        prompt += "Adapte pour un niveau débutant avec des explications simples. ";
        break;
      case 'intermediate':
        prompt += "Utilise un niveau intermédiaire. ";
        break;
      case 'advanced':
        prompt += "Tu peux utiliser un vocabulaire technique avancé. ";
        break;
    }
    
    prompt += "Réponds toujours en français. " + context;
    
    return prompt;
  }

  exitAIChat(): void {
    this.isAIChatMode = false;
    this.showInput = false;
    this.addBotMessage("🔄 Retour au mode questions guidées. Veux-tu répondre à une autre question ?", ['Oui, une autre question', 'Non, c\'est bon'], 'yes-no', -1);
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

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      console.log('Enter key pressed - sending message directly');
      event.preventDefault(); // Prevent any default behavior
      this.sendMessage();
    }
  }

  onSendButtonClick(): void {
    console.log('Send button clicked - sending message directly');
    this.sendMessage();
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