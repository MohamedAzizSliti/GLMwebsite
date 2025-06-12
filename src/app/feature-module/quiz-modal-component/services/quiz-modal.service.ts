import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Exam } from '../models/exam.model';

@Injectable({
  providedIn: 'root'
})
export class QuizModalService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  private currentExamSubject = new BehaviorSubject<Exam | null>(null);

  isOpen$ = this.isOpenSubject.asObservable();
  currentExam$ = this.currentExamSubject.asObservable();

  constructor() { }

  /**
   * Ouvre la modale avec l'examen spécifié
   * @param exam L'examen à afficher dans la modale
   */
  openModal(exam: Exam): void {

    this.currentExamSubject.next(exam);
    this.isOpenSubject.next(true);
  }

  /**
   * Ferme la modale et réinitialise l'examen courant
   */
  closeModal(): void {
    this.isOpenSubject.next(false);
    this.currentExamSubject.next(null);
  }

  /**
   * Récupère l'état actuel d'ouverture de la modale
   */
  getIsOpen(): boolean {
    return this.isOpenSubject.getValue();
  }

  /**
   * Récupère l'examen actuellement affiché
   */
  getCurrentExam(): Exam | null {
    return this.currentExamSubject.getValue();
  }
}
