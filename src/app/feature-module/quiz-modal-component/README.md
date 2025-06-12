# Guide d'intégration de la modale Quiz pour LMS Angular

Ce document explique comment intégrer la fonctionnalité de modale quiz dans votre projet LMS Angular.

## Structure des fichiers

Le composant est organisé comme suit :
```
quiz-modal-component/
├── components/
│   ├── quiz-modal/
│   │   ├── quiz-modal.component.ts
│   │   ├── quiz-modal.component.html
│   │   └── quiz-modal.component.scss
│   ├── question/
│   │   ├── question.component.ts
│   │   ├── question.component.html
│   │   └── question.component.scss
│   ├── timer/
│   │   ├── timer.component.ts
│   │   ├── timer.component.html
│   │   └── timer.component.scss
│   └── quiz-result/
│       ├── quiz-result.component.ts
│       ├── quiz-result.component.html
│       └── quiz-result.component.scss
├── models/
│   └── exam.model.ts
├── services/
│   ├── quiz-modal.service.ts
│   ├── timer.service.ts
│   └── quiz.service.ts
├── tests/
│   ├── timer-test.js
│   └── quiz-service-test.js
└── quiz-modal.module.ts
```

## Étapes d'intégration

### 1. Copier les fichiers

Copiez le dossier `quiz-modal-component` dans votre projet Angular, idéalement dans le répertoire `src/app/`.

### 2. Importer le module

Dans votre module principal (généralement `app.module.ts`), importez le module `QuizModalModule` :

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { QuizModalModule } from './quiz-modal-component/quiz-modal.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    QuizModalModule // Ajoutez cette ligne
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 3. Utiliser le composant dans votre template

Dans le composant où vous souhaitez utiliser la modale quiz, ajoutez le sélecteur `app-quiz-modal` :

```html
<!-- Votre template HTML -->
<div>
  <!-- Autres éléments de votre page -->
  
  <!-- Ajoutez le composant de modale quiz -->
  <app-quiz-modal></app-quiz-modal>
  
  <!-- Bouton pour ouvrir la modale -->
  <button (click)="openQuizModal()">Démarrer le quiz</button>
</div>
```

### 4. Injecter et utiliser le service dans votre composant

Dans votre composant TypeScript, injectez le service `QuizModalService` et utilisez-le pour ouvrir la modale :

```typescript
import { Component } from '@angular/core';
import { QuizModalService } from './quiz-modal-component/services/quiz-modal.service';
import { Exam } from './quiz-modal-component/models/exam.model';

@Component({
  selector: 'app-your-component',
  templateUrl: './your-component.component.html',
  styleUrls: ['./your-component.component.scss']
})
export class YourComponent {
  
  constructor(private quizModalService: QuizModalService) { }
  
  // Fonction appelée lors du clic sur le bouton
  openQuizModal() {
    // Remplacez cet exemple par votre propre logique pour récupérer l'examen
    const examData: Exam = {
      id: 19,
      title: "Titre de l'examen",
      duration: 5,
      mark_per_question: 5,
      pass_marks: 11,
      course_id: 16,
      created_at: "2025-05-16T21:07:49.000000Z",
      updated_at: "2025-05-16T21:07:49.000000Z",
      nbr_question: 2,
      questions: [
        // ... vos questions ici
      ]
    };
    
    // Ouvrir la modale avec l'examen
    this.quizModalService.openModal(examData);
  }
}
```

## Personnalisation

### Styles

Vous pouvez personnaliser l'apparence de la modale en modifiant les fichiers SCSS dans le dossier `components`.

### Traduction

Pour changer les textes affichés, modifiez directement les chaînes de caractères dans les fichiers HTML des composants.

## Fonctionnalités

La modale quiz offre les fonctionnalités suivantes :

1. Affichage des questions et options de réponse
2. Navigation entre les questions
3. Minuteur pour la durée de l'examen
4. Calcul automatique du score
5. Affichage du résultat final

## Exemple d'utilisation avec API

Si vous récupérez les données d'examen depuis une API, voici un exemple d'utilisation :

```typescript
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuizModalService } from './quiz-modal-component/services/quiz-modal.service';
import { Exam } from './quiz-modal-component/models/exam.model';

@Component({
  selector: 'app-your-component',
  templateUrl: './your-component.component.html',
  styleUrls: ['./your-component.component.scss']
})
export class YourComponent {
  
  constructor(
    private quizModalService: QuizModalService,
    private http: HttpClient
  ) { }
  
  openQuizModal(examId: number) {
    // Récupérer les données d'examen depuis l'API
    this.http.get<Exam>(`/api/exams/${examId}`).subscribe(
      (examData) => {
        // Ouvrir la modale avec les données récupérées
        this.quizModalService.openModal(examData);
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'examen', error);
      }
    );
  }
}
```

## Support

Pour toute question ou problème d'intégration, n'hésitez pas à me contacter.
