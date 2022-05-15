import Routine from '../../Routine';
export declare class RoutineTrue extends Routine {
  attempt(): Promise<boolean>;
}
export declare class RoutineFalse extends Routine {
  attempt(): Promise<boolean>;
}
