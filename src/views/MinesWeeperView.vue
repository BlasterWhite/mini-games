<script setup>
import MinesWeeper from "@/components/MinesWeeper/MinesField.vue";
import MinesWeeperSettings from "@/components/MinesWeeper/MinesWeeperSettings.vue";
import { ref, watch } from "vue";

// TODO: add a function to reset the game
// TODO: color the number of mines around the cell
// TODO: add a timer
// TODO: add local storage to save the best time
// TODO: add Animation
// TODO: add settings
// TODO: add Confetti when win

// FIXME: unSet a flag when a cell is revealed remove the number of mine around the cell
// FIXME: Number of flag can not be more than the number of mines
// FIXME: Spam click restart the game cause lag

const width = ref(10);
const height = ref(10);
const minesPercent = ref(0.1);
const tileSizes = ref(35);

const modalSettingsWidth = ref(width.value);
const modalSettingsHeight = ref(height.value);
const modalSettingsMinesPercent = ref(minesPercent.value);
const modalSettingsTileSizes = ref(tileSizes.value);

const isModalSettingsOpen = ref(false);

function reset() {
  width.value = 4;
  height.value = 4;
  minesPercent.value = 0.5;
  tileSizes.value = 30;
}

function change() {
  console.log("change");
  width.value = modalSettingsWidth.value;
  height.value = modalSettingsHeight.value;
  minesPercent.value = modalSettingsMinesPercent.value;
  tileSizes.value = modalSettingsTileSizes.value;
}

const restartTheGame = ref(false);
function restart() {
  console.log("restart");
  restartTheGame.value = true;
}

watch(modalSettingsWidth, (value) => {
  console.log(value);
});
</script>

<template>
  {{ width }}
  {{ height }}
  {{ minesPercent }}
  {{ tileSizes }}<br>
  {{ modalSettingsWidth }}
  {{ modalSettingsHeight }}
  {{ modalSettingsMinesPercent }}
  {{ modalSettingsTileSizes }}
  <h1>MinesWeeper</h1>
  <button @click="isModalSettingsOpen = true">Settings</button>
  <button @click="restart">Restart</button>
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
  />
</template>

<style scoped></style>
