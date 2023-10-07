<script setup>
import MinesWeeper from "@/components/MinesWeeper/MinesField.vue";
import MinesWeeperSettings from "@/components/MinesWeeper/MinesWeeperSettings.vue";
import { computed, ref, watch } from "vue";

// TODO: color the number of mines around the cell
// TODO: add a timer
// TODO: add local storage to save the best time
// TODO: add Animation
// TODO: add Confetti when win
// TODO: add logic where you can't lose on the first click

const width = ref(10);
const height = ref(10);
const minesPercent = ref(0.1);
const tileSizes = ref(35);

const modalSettingsWidth = ref(width.value);
const modalSettingsHeight = ref(height.value);
const modalSettingsMinesPercent = ref(minesPercent.value);
const modalSettingsTileSizes = ref(tileSizes.value);

const isModalSettingsOpen = ref(false);

/**
 * Function called when the settings are reset
 */
function reset() {
  width.value = 4;
  height.value = 4;
  minesPercent.value = 0.5;
  tileSizes.value = 30;
}

/**
 * Function called when the settings are changed
 */
function change() {
  width.value = modalSettingsWidth.value;
  height.value = modalSettingsHeight.value;
  minesPercent.value = modalSettingsMinesPercent.value;
  tileSizes.value = modalSettingsTileSizes.value;
}

const restartTheGame = ref(false);
function restart() {
  stopTimer();
  timer.value = 0;
  showModal.value = false;
  restartTheGame.value = true;
}

const showModal = ref(false);
const modalContent = ref({});

/**
 * Function called when the player lose
 */
function lose() {
  stopTimer();
  modalContent.value = {
    title: "You lose",
    message: "You lose, try again !",
  };
  showModal.value = true;
}

/**
 * Function called when the player win
 */
function win() {
  stopTimer();
  modalContent.value = {
    title: "You win",
    message: "You win, congratulations !",
  };
  showModal.value = true;
}

const timer = ref(0);
let interval;
function startTimer() {
  interval = setInterval(() => {
    timer.value += 1;
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
}

const timerFormatted = computed(() => {
  const minutes = Math.floor(timer.value / 60);
  const seconds = timer.value % 60;
  const hours = Math.floor(timer.value / 3600);
  return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${
    seconds < 10 ? `0${seconds}` : seconds
  }`;
});
</script>

<template>
  <h1>MinesWeeper</h1>
  <p class="timer">{{ timerFormatted }}</p>
  <MinesWeeperSettings
    v-if="isModalSettingsOpen"
    @close="isModalSettingsOpen = false"
    @reset="reset"
    @change="change"
    v-model:p-height="modalSettingsHeight"
    v-model:p-width="modalSettingsWidth"
    v-model:p-mines-percent="modalSettingsMinesPercent"
    v-model:p-tile-sizes="modalSettingsTileSizes"
  />
  <MinesWeeper
    :width="width"
    :height="height"
    :mines-percent="minesPercent"
    :tile-sizes="tileSizes"
    v-model:restart-the-game="restartTheGame"
    @win="win"
    @lose="lose"
    @start="startTimer"
  />
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span @click="showModal = false" class="close">&times;</span>
      <h2>{{ modalContent.title }}</h2>
      <p>{{ modalContent.message }}</p>
      <button @click="restart">Restart</button>
    </div>
  </div>
  <div class="actions">
    <button @click="isModalSettingsOpen = true">Settings</button>
    <button @click="restart">Restart</button>
  </div>
</template>

<style scoped>
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0, 0.4);

  & .modal-content {
    background-color: #fefefe;
    color: #1a1a1a;
    margin: auto;
    border-radius: 12px;
    width: 80%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    gap: 10px;

    & h2 {
      margin: 0;
    }

    & p {
      margin: 0;
    }

    & .close {
      margin: 0 4px;
      color: #aaaaaa;
      float: right;
      align-self: flex-end;
      font-size: 28px;
      font-weight: bold;
      cursor: pointer;
    }

    & .close:hover,
    & .close:focus {
      color: #000;
      text-decoration: none;
      cursor: pointer;
    }
  }
}

.actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;

  & > button {
    margin: 8px;
  }
}

.timer {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}
</style>
