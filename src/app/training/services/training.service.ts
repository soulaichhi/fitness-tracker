import { Exercise } from '../models/exercise.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable()
export class TrainingService {
  exerciseChanged: Subject<Exercise> = new Subject<Exercise>();
  exercisesChanged: Subject<Exercise[]> = new Subject<Exercise[]>();
  finishedExercisesChanged: Subject<Exercise[]> = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise | undefined;

  constructor(private db: AngularFirestore) {}

  fetchAvailableExercises() {
    this.db
      .collection<Exercise>('availableExercises')
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc) => {
            return {
              id: doc.payload.doc.id,
              name: doc.payload.doc.data().name,
              duration: doc.payload.doc.data().duration,
              calories: doc.payload.doc.data().calories,
            };
          });
        })
      )
      .subscribe((exercises: Exercise[]) => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      });
  }

  startExercise(selectedId: string) {
    //select a single document and update it
    // this.db
    //   .doc('availableExercises/' + selectedId)
    //   .update({ lastSelected: new Date() });
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise! });
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise!,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null!;
    this.exerciseChanged.next(null!);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise!,
      duration: this.runningExercise?.duration! * (progress / 100),
      calories: this.runningExercise?.calories! * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });
    this.runningExercise = null!;
    this.exerciseChanged.next(null!);
  }

  fetchCompletedOrCancelledExercise() {
    this.db
      .collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: any) => {
        this.finishedExercisesChanged.next(exercises);
      });
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
