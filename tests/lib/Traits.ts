import Leader from '@civ-clone/core-civilization/Leader';
import Trait from '@civ-clone/core-civilization/Trait';

export class TraitType extends Trait {}

export class TraitFull extends TraitType {
  constructor(leader: typeof Leader) {
    super(leader, 1);
  }
}

export class TraitHalf extends TraitType {
  constructor(leader: typeof Leader) {
    super(leader, 0.5);
  }
}

export class TraitNone extends TraitType {
  constructor(leader: typeof Leader) {
    super(leader, 0);
  }
}
