game-of-life

This project is my implementation of Conway's game of life (https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life). You start by filling grid cells in your desired pattern (the seed), and then hit play to see how the simulation evolves. A cell can either die, stay alive, or become alive, based on the number of live neighbour cells.

I built this project using React, it simulates each cycle one tick in advance to allow for showing if a cell will live or die in the next tick (if enabled by the user). The grid and cells are drawn on an HTML canvas element, first the cells, then the grid lines, so that the grid lines always remain on top. I designed the grid of this project to "wrap around" so when cells would move off of the grid, they instead move to the opposite side of it (left->right, right->left, top->bottom, bottom->top). 

Project live at: https://db981.github.io/game-of-life/
