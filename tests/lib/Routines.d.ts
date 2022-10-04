import Routine from '../../Routine';
export declare class RoutineTrue extends Routine {
  attempt(): boolean;
}
export declare class RoutineFalse extends Routine {
  attempt(): boolean;
}
export declare class RoutineA extends RoutineTrue {}
export declare class RoutineB extends RoutineTrue {}
