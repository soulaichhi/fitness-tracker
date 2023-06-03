import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrainingService } from '../services/training.service';
import { Exercise } from '../models/exercise.model';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises!: Exercise[];
  exercisesSubscription!: Subscription;

  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
    this.exercisesSubscription =
      this.trainingService.exercisesChanged.subscribe(
        (exercises) => (this.exercises = exercises)
      );
    this.trainingService.fetchAvailableExercises();
  }

  ngOnDestroy() {
    this.exercisesSubscription.unsubscribe();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
