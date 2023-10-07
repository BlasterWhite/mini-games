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

const emits = defineEmits(["update:restartTheGame", "win", "lose", "start"]);

const tileCss = computed(() => {
  return `${props.tileSizes}px`;
});

/*
 * first array is the row
 * second array is the column
 * third array is the cell
 *    - first is the dev value
 *    - second is the display value
 */
const playGround = ref(
  Array(props.height)
    .fill()
    .map(() => Array(props.width)
        .fill().map(() => {
          return {
            status: 0,
            value: 0,
            label: "",
          };
        })),
);
const numberOfMines = ref(0);

/**
 * Generate mines
 */
function generateMines() {
  numberOfMines.value = 0;
  const mines = Math.round(props.width * props.height * props.minesPercent);

  for (let i = 0; numberOfMines.value < mines; i++) {
    let x = Math.floor(Math.random() * props.width);
    let y = Math.floor(Math.random() * props.height);

    if (playGround.value[y][x].value === -1) {
      i--;
      continue;
    }

    playGround.value[y][x].value = -1;
    playGround.value[y][x].label = '💣';
    numberOfMines.value++;
  }
}

/**
 * Calculate the number of mines around a cell
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
      if (playGround.value[y + i][x + j].value === -1) {
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
      if (playGround.value[y][x].value === -1) {
        // if it's a mine, skip
        continue;
      }
      playGround.value[y][x].label = calculMineAround(x, y).toString();
    }
  }
}

const hasStarted = ref(false);
/**
 * Reveal a cell
 * @param {number} x
 * @param {number} y
 * @param {Event} event
 */
function reveal(x, y, event) {
  if (!hasStarted.value) {
    hasStarted.value = true;
    emits("start")
  }
  if (playGround.value[y][x].status === -2 || playGround.value[y][x].status === -3) {
    return;
  }
  let colored = (y + x) % 2 ? "revealedDark" : "revealed";
  event.target.classList.add(colored);
  event.target.innerText = playGround.value[y][x].label;
  if (playGround.value[y][x].value === -1) {
    // if it's a mine
    event.target.style.backgroundColor = "#ff0000";
    emits("lose");
    return;
  }
  playGround.value[y][x].status = -2;
  calculVictory();
}

/**
 * Declare a mine
 * @param {number} x
 * @param {number} y
 * @param {Event} event
 */
function putFlag(x, y, event) {
  event.preventDefault();
  if(playGround.value[y][x].status === -2 || numberOfMines.value <= 0) return;

  if (playGround.value[y][x].status === -3) { // if it's a flag
    playGround.value[y][x].status = 0; // reset the dev value
    playGround.value[y][x].label = calculMineAround(x, y).toString(); // reset the display value
    event.target.innerText = "";
    event.target.style.backgroundColor = "";
    numberOfMines.value++;
    return;
  }

  playGround.value[y][x].status = -3;
  playGround.value[y][x].label = "🚩";
  event.target.innerText = playGround.value[y][x].label;
  event.target.style.backgroundColor = "#d2bc41";
  numberOfMines.value--;
  calculVictory();
}

function calculVictory() {
  let victory = true;
  for (let y = 0; y < props.height; y++) {
    for (let x = 0; x < props.width; x++) {
      if (playGround.value[y][x].value === -1) {
        // if it's a mine, skip
        continue;
      }
      if (playGround.value[y][x].status !== -2) {
        victory = false;
      }
    }
  }
  if (victory) {
    emits("win");
  }
}

watch(
  () => props.restartTheGame,
  () => {
    if (!props.restartTheGame) return;
    restart();
    emits("update:restartTheGame", false);
  },
);

function restart() {
  hasStarted.value = false;
  playGround.value = Array(props.height)
    .fill()
    .map(() => Array(props.width)
        .fill().map(() => {
          return {
            status: 0,
            value: 0,
            label: "",
          };
        }));
  generateMines();
  calculAllMinesAround();
}

generateMines();
calculAllMinesAround();
</script>

<template>
  Mines: {{ numberOfMines }} 💣<br />
  <div class="minesweeper" v-if="!restartTheGame">
    <div v-for="(row, indexRow) in playGround" class="row">
      <div
        class="cell"
        :class="(indexRow + indexCell) % 2 ? 'darkgreen' : 'green'"
        v-for="(cell, indexCell) in row"
        @click="reveal(indexCell, indexRow, $event)"
        @contextmenu="putFlag(indexCell, indexRow, $event)"
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

div.cell:not(.revealed):not(.revealedDark):hover {
  background-color: #53cc28;
}
</style>
<style>
.minesweeper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 4px 4px 8px 0px rgba(0, 0, 0, 0.5);
}

.row {
  display: flex;
  flex-direction: row;
}
</style>
