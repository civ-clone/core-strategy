import Leader from '@civ-clone/core-civilization/Leader';
import Trait from '@civ-clone/core-civilization/Trait';
export declare class TraitType extends Trait {}
export declare class TraitFull extends TraitType {
  constructor(leader: typeof Leader);
}
export declare class TraitHalf extends TraitType {
  constructor(leader: typeof Leader);
}
export declare class TraitNone extends TraitType {
  constructor(leader: typeof Leader);
}
