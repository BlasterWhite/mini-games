<script setup>
import { computed, ref, watch } from "vue";

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
  restartTheGame: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update:restartTheGame"]);

const tileCss = computed(() => {
  return `${props.tileSizes}px`;
});

const playGround = computed(() => {
  return Array(props.height)
    .fill()
    .map(() => Array(props.width).fill(0));
});

const numberOfMines = ref(0);

/**
 * Generate mines
 */
function generateMines() {
  numberOfMines.value = 0;
  const mines = Math.round(props.width * props.height * props.minesPercent);
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

/**
 *
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
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

/**
 * Calculate the number of mines around each cell
 */
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

/**
 * Reveal a cell
 * @param {number} x
 * @param {number} y
 * @param {Event} event
 */
function reveal(x, y, event) {
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

watch(
  () => props.height,
  () => {
    generateMines();
    calculAllMinesAround();
  },
);

watch(
  () => props.width,
  () => {
    generateMines();
    calculAllMinesAround();
  },
);

watch(
  () => props.minesPercent,
  () => {
    generateMines();
    calculAllMinesAround();
  },
);

watch(
  () => props.restartTheGame,
  () => {
    restart();
    emits("update:restartTheGame", false);
  },
);

function restart() {
  console.log("restart !!")
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.classList.remove("revealed");
    cell.classList.remove("revealedDark");
    cell.innerText = "";
    cell.style.backgroundColor = "";
  });
  generateMines();
  calculAllMinesAround();
}

generateMines();
calculAllMinesAround();
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
