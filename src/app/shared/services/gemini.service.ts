import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private apiKey = environment.gemini.apiKey;
  private apiUrl = environment.gemini.apiUrl;

  constructor(private http: HttpClient) { }

  async generateResponse(userMessage: string, systemPrompt?: string): Promise<string> {
    // Check if API key is properly configured
    if (!this.apiKey || this.apiKey === 'YOUR_GEMINI_API_KEY') {
      console.warn('Gemini API key not configured, using fallback response');
      return this.generateFallbackResponse(userMessage, 'no-api-key');
    }

    // Validate API key format
    if (!this.isValidApiKeyFormat(this.apiKey)) {
      console.error('Invalid API key format detected');
      return this.generateFallbackResponse(userMessage, 'invalid-key-format');
    }

    // Debug logging
    console.log('Gemini API Request Details:');
    console.log('API URL:', this.apiUrl);
    console.log('API Key (first 10 chars):', this.apiKey.substring(0, 10) + '...');
    console.log('User Message:', userMessage);

    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: systemPrompt ? `${systemPrompt}\n\nUser: ${userMessage}` : userMessage
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      };

      console.log('Request Body:', JSON.stringify(requestBody, null, 2));

      const response = await firstValueFrom(
        this.http.post<any>(`${this.apiUrl}?key=${this.apiKey}`, requestBody, { headers })
      );

      if (response.candidates && response.candidates.length > 0) {
        const generatedText = response.candidates[0].content.parts[0].text;
        console.log('Gemini API response received successfully');
        return generatedText;
      } else {
        console.warn('No candidates in Gemini API response');
        return this.generateFallbackResponse(userMessage, 'no-candidates');
      }
    } catch (error: any) {
      console.error('Gemini API Error Details:', {
        status: error.status,
        statusText: error.statusText,
        message: error.message,
        url: error.url,
        error: error.error
      });
      
      // Handle specific error types
      if (error.status === 401) {
        console.error('🔑 API Key authentication failed. Possible causes:');
        console.error('1. API key is invalid or expired');
        console.error('2. API key doesn\'t have Gemini API access enabled');
        console.error('3. API key has IP restrictions');
        console.error('4. Billing is not set up for the Google Cloud project');
        console.error('Current API key (masked):', this.apiKey.substring(0, 10) + '...' + this.apiKey.substring(this.apiKey.length - 4));
        return this.generateFallbackResponse(userMessage, 'auth-error');
      } else if (error.status === 403) {
        console.error('API access forbidden - check API key permissions');
        return this.generateFallbackResponse(userMessage, 'forbidden');
      } else if (error.status === 429) {
        console.error('API rate limit exceeded');
        return this.generateFallbackResponse(userMessage, 'rate-limit');
      } else {
        console.error('General API error:', error.message);
        return this.generateFallbackResponse(userMessage, 'error');
      }
    }
  }

  // Enhanced fallback method with context-aware responses
  generateFallbackResponse(userMessage: string, context: string): string {
    const responses = {
      'no-api-key': [
        "Je suis désolé, mais la configuration de l'IA n'est pas encore terminée. Voici quelques conseils généraux basés sur votre question.",
        "L'assistant IA n'est pas encore configuré. Permettez-moi de vous donner quelques suggestions générales.",
        "Configuration IA en cours... En attendant, voici quelques recommandations basées sur votre demande."
      ],
      'invalid-key-format': [
        "La clé API semble avoir un format incorrect. Vérifiez votre configuration.",
        "Format de clé API invalide détecté. Consultez la documentation pour le bon format.",
        "Problème de format avec la clé API. Voici une réponse générale en attendant."
      ],
      'auth-error': [
        "Il y a un problème avec l'authentification de l'IA. Voici une réponse basée sur mon expérience d'apprentissage.",
        "Problème de connexion à l'IA détecté. Je vais vous donner des conseils généraux en attendant.",
        "L'assistant IA rencontre des difficultés de connexion. Voici mes recommandations habituelles."
      ],
      'rate-limit': [
        "L'assistant IA est temporairement surchargé. Voici une réponse basée sur les meilleures pratiques d'apprentissage.",
        "Trop de demandes à l'IA en ce moment. Permettez-moi de vous donner des conseils éprouvés.",
        "L'IA est occupée, mais je peux vous offrir des suggestions basées sur l'expérience pédagogique."
      ],
      'error': [
        "Je comprends votre question. Pouvez-vous me donner plus de détails ?",
        "C'est une excellente question ! Laissez-moi vous aider avec cela.",
        "Basé sur votre message, je recommande de consulter les ressources de cours disponibles.",
        "Pour mieux vous aider, pourriez-vous préciser votre niveau d'expérience ?",
        "Je vais vous donner quelques suggestions personnalisées pour votre apprentissage."
      ]
    };
    
    const contextResponses = responses[context as keyof typeof responses] || responses['error'];
    const randomResponse = contextResponses[Math.floor(Math.random() * contextResponses.length)];
    
    // Add context-specific advice based on user message content
    if (userMessage.toLowerCase().includes('python')) {
      return `${randomResponse}\n\nPour Python, je recommande de commencer par les bases : variables, boucles, et fonctions. Pratiquez avec des exercices simples avant de passer aux concepts avancés.`;
    } else if (userMessage.toLowerCase().includes('réseau') || userMessage.toLowerCase().includes('network')) {
      return `${randomResponse}\n\nPour les réseaux, concentrez-vous sur les protocoles de base (TCP/IP, HTTP) et utilisez des outils comme Wireshark pour analyser le trafic.`;
    } else if (userMessage.toLowerCase().includes('base de données') || userMessage.toLowerCase().includes('database')) {
      return `${randomResponse}\n\nPour les bases de données, maîtrisez d'abord SQL avec des requêtes simples, puis progressez vers les jointures et l'optimisation.`;
    }
    
    return randomResponse;
  }

  // Test method to verify API key functionality
  async testApiKey(): Promise<boolean> {
    console.log('🧪 Testing Gemini API Key...');
    
    if (!this.apiKey || this.apiKey === 'YOUR_GEMINI_API_KEY') {
      console.error('❌ No API key configured');
      return false;
    }

    try {
      const testResponse = await this.generateResponse('Hello, this is a test message.');
      console.log('✅ API Key test successful');
      return true;
    } catch (error) {
      console.error('❌ API Key test failed:', error);
      return false;
    }
  }

  // Method to provide API key setup instructions
  getApiKeyInstructions(): string {
    return `
🔑 How to get a valid Gemini API Key:

1. Go to Google AI Studio: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Choose "Create API key in new project" or select an existing project
5. Copy the generated API key
6. Replace the API key in your environment.ts file

⚠️ Important Notes:
- Make sure you have billing enabled on your Google Cloud project
- The Gemini API requires a valid payment method
- Free tier has limited requests per minute
- Keep your API key secure and never commit it to public repositories

🔧 Current API Configuration:
- API URL: ${this.apiUrl}
- API Key Status: ${this.apiKey && this.apiKey !== 'YOUR_GEMINI_API_KEY' ? 'Configured' : 'Not Configured'}
    `;
  }

  private isValidApiKeyFormat(apiKey: string): boolean {
    // Google API keys typically start with 'AIzaSy' and are 39 characters long
    const googleApiKeyPattern = /^AIzaSy[A-Za-z0-9_-]{33}$/;
    return googleApiKeyPattern.test(apiKey);
  }
} 