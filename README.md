# core-strategy

A framework for building modular AI. The idea being that `Strategy`s are built of many `Routine`s for specific 
`PlayerAction`s and it should be easy enough to register new `Strategy`s to handle newly added `Unit`s.

Another aim for this set of classes is to be able to automate simple tasks (explore, improve terrain, go-to, etc.), this
might necessitate another entity of some sort to be picked up by the `HumanPlayer` object...

Lastly, there's the possibility for primitive Barbarian behaviour, without having a "ghost" player (like Civ1).