# Dot Dot Dot
## Background and Overview
* DDD will be a variation of the game Two Dots, where players have to connect a certain number of like-colored dots in a set number of moves. When the dots are connected they disappear and random new dots drop from the top of the canvas. If the player connects dots in the shape of a box, all like-colored dots disappear from the board. 
## Functionality and MVP Features
* Users are presented with a random grid of colored dots and will use the mouse to connect them
* If no move is available, all dots are shuffled with a higher probability of a box appearing.
* If win requirements are met in the set number of moves, a score is calculated based on number of remaining moves the player has and the next level begins
## Architecture and Technologies
* Javascript, Canvas
## Implementation Timeline
* Set up canvas grid, initial randomization logic and dot class - 1 day
* Work on mouse and dot animations, user interaction with the board, connection and removal of dots - 1 day
* Finish logic for win/loss scenarios, point system - 1 day 

## Bonus features
* Add 'bomb' dots: if a player makes a box 3x3 or larger, the inner dots become 'bombs' that destroy all dots within one square of their position.
* Add 'anchor' dots: anchor dots are immutable dots that need to be 'sunk' to the bottom of the screen. The goal then becomes to sink a certain number of anchors rather than eliminate a certain number of dots