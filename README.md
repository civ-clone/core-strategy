# core-strategy

A framework for building modular AI. The idea being that `Strategy`s are built of many `Routine`s for specific
`PlayerAction`s and it should be easy enough to register new `Strategy`s to handle newly added `PlayerAction`s.

The consumer `AIClient`, `SimpleAIStrategyClient`, is available at
[civ-clone/simple-ai-strategy-client](https://github.com/civ-clone/simple-ai-strategy-client).

Another aim for this set of classes is to be able to automate simple tasks (explore, improve terrain, go-to, etc.).

Lastly, there's the possibility for primitive Barbarian behaviour, without having a "ghost" player (like Civ1).

## Current state

```ts
import Strategy from '@civ-clone/core-strategy/Strategy';

// Export your base `Strategy`:
export class MyStrategy extends Strategy {
  constructor(
    dependencyForRoutine: SpecificThing = defaultInstanceOfSpecificThing
  ) {
    super(
      new MyRoutine(dependencyForRoutine),
      new AnotherRoutine(dependencyForRoutine)
    );
  }
}

import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Routine from '@civ-clone/core-strategy/Strategy';
import { instance as strategyNoteInstance } from '@civ-clone/core-strategy/StrategyNoteRegistry';

// which is comprised of `Routine`s like the following:
export class MyRoutine extends Routine {
  // Inject dependencies (e.g. `Registry`s) into the `constructor` as usual

  async attempt(action: PlayerAction<SpecificItemClass>): Promise<boolean> {
    // Check if your `Routine` can handle this type of action first, fail early as lots of routines will be even
    // more expensive to check otherwise.
    if (!(action instanceof MyHandleableAction)) {
      return false;
    }

    // In here you can use any existing code, for example you could trigger existing `Action`s for `Unit`s...

    // If you need to share data across many `Strategy`s or `Routine`s you can use the `StrategyNoteRegistry` (with
    // an optional custom `generateKey` method to ensure you always use the expected key).
    const existingNote = strategyNoteRegistryInstance.getByKey(
      myCustomKeyGenerator(action.value())
    );

    if (!existingNote) {
      return false;
    }

    const data = existingNote.value(),
      newAction = new DoSomething(data.x(), data.y(), data.thing());

    newAction.perform(action);

    // When you have handled the action, ensure you return `true` to prevent any more actions from triggering.
    return true;
  }
}

// The core `generateKey` method exists in `StrategyNote`, but having a more specific function associated to your
// `Strategy` can help ensure you are passing the expected entities and get consistent keys.
import { generateKey } from '@civ-clone/core-strategy/StrategyNote';

export const myCustomKeyGenerator = (item: SpecificItemClass) =>
  generateKey(item, MyRoutine.name);

// To control the priority of your `Routine`s you need to use `Priority` `Rule`s and you can even take the `Leader`s
// `Trait`s into consideration if you wish:
import { High, Normal } from '@civ-clone/core-rule/Priorities';
import {
  TraitRegistry,
  instance as traitRegistryInstance,
} from '@civ-clone/core-civilization/TraitRegistry';
import Expansionist from '@civ-clone/base-leader-trait-development/Development/Expansionist';
import Player from '@civ-clone/core-player/Player';
import Priority from '@civ-clone/core-strategy/Rules/Priority';
import Routine from '@civ-clone/core-strategy/Strategy';
import Trait from '@civ-clone/core-civilization/Trait';

export const getRules = (
  traitRegistry: TraitRegistry = traitRegistryInstance
): Priority[] => [
  new Priority(
    new Criterion(
      (player: Player, routine: Routine) => routine instanceof MyRoutine
    ),
    new Effect((player: Player) => {
      const civilization = player.civilization(),
        leader = civilization.leader();

      if (
        leader &&
        traitRegistry.some(
          (trait: Trait) =>
            leader instanceof trait.leader() && trait instanceof Expansionist
        )
      ) {
        // Could be any arbitrary `Priority` (from `core-rule`) to give more fine-grained control.
        return new High();
      }

      return new Normal();
    })
  ),
];

// In the main entrypoint make sure you register the `Rule`s and the `Strategy`:
import { instance as ruleRegistryInstance } from '@civ-clone/core-rule/RuleRegistry';
import { instance as strategyRegistryInstance } from '@civ-clone/core-strategy/StrategyRegistry';

ruleRegistryInstance.register(...getRules());
strategyRegistryInstance.register(new MyStrategy());

// `StrategyNote`s can be written from anywhere, for example when first making contact with another `Player` or when a
// `Tile` is discovered, which can then be acted upon.
```
