<script setup>
import { computed, ref } from "vue";

// TODO: add a function to reset the game
// TODO: color the number of mines around the cell
// TODO: add a timer
// TODO: add local storage to save the best time
// TODO: add Animation
// TODO: add settings
// TODO: add Confetti when win

const props = defineProps({
  height: {
    type: Number,
    default: 4,
  },
  width: {
    type: Number,
    default: 4,
  },
  minesPercent: {
    type: Number,
    default: 0.5,
  },
  tileSizes: {
    type: Number,
    default: 30,
  },
});

const widthCss = computed(() => {
  return {
    width: `repeat(${props.width}, 1fr)`,
  };
});

const heightCss = computed(() => {
  return {
    height: `repeat(${props.height}, 1fr)`,
  };
});

const tileCss = computed(() => {
  return `${props.tileSizes}px`;
});

const playGround = computed(() => {
  return Array(props.height)
    .fill()
    .map(() => Array(props.width).fill(0));
});

const numberOfMines = ref(0);
function generateMines() {
  numberOfMines.value = 0;
  const mines = Math.round(props.width * props.height * props.minesPercent);
  console.log(mines);
  for (let i = 0; i < mines; i++) {
    const x = Math.floor(Math.random() * props.width);
    const y = Math.floor(Math.random() * props.height);
    if (playGround.value[y][x] === -1) {
      i--;
      continue;
    }
    numberOfMines.value++;
    playGround.value[y][x] = -1;
  }
}

function calculMineAround(x, y) {
  let mines = 0;
  for (let i = -1; i <= 1; i++) {
    // loop around the cell row
    if (y + i < 0 || y + i >= props.height) {
      // out of bound
      continue;
    }
    for (let j = -1; j <= 1; j++) {
      // loop around the cell column
      if (x + j < 0 || x + j >= props.width) {
        // out of bound
        continue;
      }
      if (playGround.value[y + i][x + j] === -1) {
        mines++;
      }
    }
  }
  return mines;
}

function calculAllMinesAround() {
  for (let y = 0; y < props.height; y++) {
    for (let x = 0; x < props.width; x++) {
      if (playGround.value[y][x] === -1) {
        // if it's a mine, skip
        continue;
      }
      playGround.value[y][x] = calculMineAround(x, y);
    }
  }
}

generateMines();
calculAllMinesAround();

/**
 * Reveal a cell
 * @param {number} x
 * @param {number} y
 * @param {Event} event
 */
function reveal(x, y, event) {
  console.log(x, y, event);
  if (playGround.value[y][x] === -2 || event.target.innerText === "💣") {
    return;
  }
  let colored = (y + x) % 2 ? "revealedDark" : "revealed";
  event.target.classList.add(colored);
  event.target.innerText = playGround.value[y][x];
  if (playGround.value[y][x] === -1) {
    alert("You lose");
    return;
  }
  playGround.value[y][x] = -2;
  calculVictory();
}

/**
 * Declare a mine
 * @param {number} x
 * @param {number} y
 * @param {Event} event
 */
function declareMine(x, y, event) {
  event.preventDefault();
  if (event.target.innerText === "💣") {
    event.target.innerText = "";
    event.target.style.backgroundColor = "";
    numberOfMines.value++;
    return;
  }
  event.target.innerText = "💣";
  event.target.style.backgroundColor = "#ff0000";
  numberOfMines.value--;
  calculVictory();
}

function calculVictory() {
  let victory = true;
  for (let y = 0; y < props.height; y++) {
    for (let x = 0; x < props.width; x++) {
      if (playGround.value[y][x] === -1) {
        // if it's a mine, skip
        continue;
      }
      if (playGround.value[y][x] !== -2) {
        victory = false;
      }
    }
  }
  if (victory) {
    alert("You win");
  }
}
</script>

<template>
  Mines: {{ numberOfMines }} 💣<br />
  <div class="minesweeper">
    <div v-for="(row, indexRow) in playGround" class="row">
      <div
        class="cell"
        :class="(indexRow + indexCell) % 2 ? 'darkgreen' : 'green'"
        v-for="(cell, indexCell) in row"
        @click="reveal(indexCell, indexRow, $event)"
        @contextmenu="declareMine(indexCell, indexRow, $event)"
      ></div>
    </div>
  </div>
</template>

<style>
div.cell {
  background-color: #5ea125;
  width: v-bind(tileCss);
  height: v-bind(tileCss);
  user-select: none;
  transition: 0.5s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
}

div.cell.green {
  background-color: #5ea125;
}

div.cell.darkgreen {
  background-color: #286e08;
}

div.cell.revealed {
  background-color: #eee0c5;
}

div.cell.revealedDark {
  background-color: #e8d9ae;
}

div.cell:not(.revealed):hover {
  background-color: #53cc28;
}
</style>
<style>
.minesweeper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.row {
  display: flex;
  flex-direction: row;
}
</style>
