import Routine from '../../Routine';

export class RoutineTrue extends Routine {
  public attempt(): Promise<boolean> {
    return Promise.resolve(true);
  }
}

export class RoutineFalse extends Routine {
  public attempt(): Promise<boolean> {
    return Promise.resolve(false);
  }
}

export class RoutineA extends RoutineTrue {}

export class RoutineB extends RoutineTrue {}
