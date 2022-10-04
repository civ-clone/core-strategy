import Routine from '../../Routine';

export class RoutineTrue extends Routine {
  public attempt(): boolean {
    return true;
  }
}

export class RoutineFalse extends Routine {
  public attempt(): boolean {
    return false;
  }
}

export class RoutineA extends RoutineTrue {}

export class RoutineB extends RoutineTrue {}
