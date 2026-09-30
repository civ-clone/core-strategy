# core-strategy

A framework for building modular AI. A `Strategy` handles one or more kinds of `PlayerAction`, so a plugin that adds a
new `PlayerAction`, or a specific `Unit` and its actions (`Caravan`, `Diplomat`, etc.), can ship the `Strategy`s that
handle it, and computer players use them straight away.

The consumer `AIClient`, `StrategyAIClient`, is available at
[civ-clone/core-strategy-ai-client](https://github.com/civ-clone/core-strategy-ai-client).

The same `Strategy`s can also automate tasks for a human player (explore, improve terrain, choose production, etc.), and
could drive primitive Barbarian behaviour without a "ghost" player (like Civ1).

## The contract

- **`Strategy`s are game-wide.** They're registered once, into the game's `StrategyRegistry`, and shared by every
  player, so a `Strategy` must be **stateless**: don't keep anything about a player, unit or city on the instance.
- **The player comes from the action**: `action.player()`. Nothing may assume the player is a computer player.
- **Memory lives in `StrategyNote`s**, in the `StrategyNoteRegistry`. Notes are `DataObject`s, so they are saved with
  the game. Build keys with `generateKey`, and include whatever the note is about (the player, unit or city) so that
  different players' notes can't collide. A note's key never changes; use `replace` to swap in a new note.
- **`handles(action)`** is a cheap, side-effect-free filter (e.g. `action instanceof MyAction`). The registry skips a
  `Strategy` that returns `false` without evaluating its `Priority` rules or calling `attempt`. It defaults to `true`.
- **`attempt(action)`** returns `true` if it handled the action and `false` otherwise, and may be `async`
  (`boolean | Promise<boolean>`).
- **A `Strategy` can be run directly**, `await strategy.attempt(action)`, for a single unit or city, for example to
  automate one of a human player's units.

## The registry

`StrategyRegistry` takes the `Strategy`s that `handle` the action, computes each one's `Priority` once, and orders them
by `Priority` value, lowest (highest priority) first. Ties, including `Strategy`s with no `Priority` rule at all
(`Infinity`), go to registration order. Nothing about the order is random.

- `await registry.attempt(action)` tries them one at a time, awaiting each, and stops at the first that returns `true`.
  It resolves `true` if one did.
- `await registry.attemptAll(action)` runs every one of them, one at a time, whatever each returns, and resolves `true`
  if any returned `true`. It is for actions that several plugins each contribute to, such as a per-turn hook.

## Example

```ts
import {
  StrategyNoteRegistry,
  instance as strategyNoteRegistryInstance,
} from '@civ-clone/core-strategy/StrategyNoteRegistry';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '@civ-clone/core-strategy/Strategy';
import StrategyNote, { generateKey } from '@civ-clone/core-strategy/StrategyNote';

// A key helper keeps the parts of the key consistent wherever the note is read or written.
export const lastSeenKey = (player: Player, unit: Unit): string =>
  generateKey('my-plugin:last-seen', player, unit);

export class MyStrategy extends Strategy {
  private _strategyNoteRegistry: StrategyNoteRegistry;

  // Inject dependencies (e.g. `Registry`s) into the `constructor` as usual.
  constructor(
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    strategyNoteRegistry: StrategyNoteRegistry = strategyNoteRegistryInstance
  ) {
    super(ruleRegistry);

    this._strategyNoteRegistry = strategyNoteRegistry;
  }

  handles(action: PlayerAction): boolean {
    return action instanceof MyAction;
  }

  async attempt(action: MyAction): Promise<boolean> {
    const player = action.player(),
      unit = action.value(),
      note = this._strategyNoteRegistry.getByKey<Tile>(
        lastSeenKey(player, unit)
      );

    if (!note) {
      return false;
    }

    // Use any existing code here, for example perform one of the unit's `Action`s. It's fine to `await` (e.g. a
    // negotiation); nothing else is attempted until this resolves.
    await doSomethingWith(unit, note.value());

    this._strategyNoteRegistry.replace(
      new StrategyNote(lastSeenKey(player, unit), unit.tile())
    );

    // Returning `true` stops any other `Strategy` being tried for this action.
    return true;
  }
}

// To control the order of `Strategy`s, use `Priority` `Rule`s. They can take the `Leader`'s `Trait`s into account.
import { High, Normal } from '@civ-clone/core-rule/Priorities';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Priority from '@civ-clone/core-strategy/Rules/Priority';

export const getRules = (
  traitRegistry: TraitRegistry = traitRegistryInstance
): Priority[] => [
  new Priority(
    new Criterion(
      (action: PlayerAction, strategy: Strategy): boolean =>
        strategy instanceof MyStrategy
    ),
    new Effect((action: PlayerAction) => {
      const leader = action.player().civilization().leader();

      if (
        leader &&
        traitRegistry
          .getByLeader(leader.sourceClass() as typeof Leader)
          .some((trait: Trait): boolean => trait instanceof MyTrait)
      ) {
        // Any `Priority` value (from `core-rule`) can be used for finer control.
        return new High();
      }

      return new Normal();
    })
  ),
];

// Register the `Rule`s and the `Strategy` from your plugin's entry point (into the game's registries, `game.rules` and
// `game.strategies`, where your plugin is given a `Game`):
ruleRegistryInstance.register(...getRules());
strategyRegistryInstance.register(new MyStrategy());

// A client offers actions to the registry...
await strategyRegistryInstance.attempt(action);

// ...and automation can run one `Strategy` for one unit or city directly:
await new MyStrategy().attempt(new MyAction(humanPlayer, unit));
```
