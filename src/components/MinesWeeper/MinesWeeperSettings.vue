<script setup>
import { computed } from "vue";

const props = defineProps({
  pHeight: {
    type: Number,
    default: 4,
  },
  pWidth: {
    type: Number,
    default: 4,
  },
  pMinesPercent: {
    type: Number,
    default: 0.5,
  },
  pTileSizes: {
    type: Number,
    default: 30,
  },
});

const defaultHeight = 4;
const defaultWidth = 4;
const defaultMinesPercent = 0.2;

const emits = defineEmits([
  "update:pHeight",
  "update:pWidth",
  "update:pMinesPercent",
  "update:pTileSizes",
  "close",
  "change",
  "reset",
]);

const width = computed({
  get: () => props.pWidth,
  set: (value) => {
    if(value < 1 || value > 100) {
      emits("update:pWidth", defaultWidth);
      return;
    }
    emits("update:pWidth", value);
  },
});

const height = computed({
  get: () => props.pHeight,
  set: (value) => {
    if(value < 1 || value > 100) {
      emits("update:pHeight", defaultHeight);
      return;
    }
    emits("update:pHeight", value);
  },
});

const minesPercent = computed({
  get: () => props.pMinesPercent * 100,
  set: (value) => {
    if(value < 0 || value > 100) {
      emits("update:pMinesPercent", defaultMinesPercent);
      return;
    }
    emits("update:pMinesPercent", value / 100);
  },
});

const tileSizes = computed({
  get: () => props.pTileSizes,
  set: (value) => emits("update:pTileSizes", value),
});

function reset() {
  emits("reset");
  close();
}

function close() {
  emits("close");
}

function submit() {
  emits("change");
  close();
}
</script>

<template>
  <div class="background"></div>
  <div class="MinesWeeperSettingsModal">
    <h2>Settings</h2>
    <div>
      <label for="width">Width</label>
      <input type="number" id="width" v-model="width" />
    </div>
    <span class="close" @click="close">X</span>
    <div>
      <label for="height">Height</label>
      <input type="number" id="height" v-model="height" />
    </div>

    <div>
      <label for="minesPercent">💣 Mines %</label>
      <input type="number" id="minesPercent" v-model="minesPercent" />
    </div>

    <div>
      <label for="tileSizes">Tile sizes</label>
      <input type="number" id="tileSizes" v-model="tileSizes" />
    </div>

    <div>
      <button id="cancel" @click="close">Cancel</button>
      <button id="submit" @click="submit">Submit</button>
      <button id="reset" @click="reset">Reset</button>
    </div>
  </div>
</template>

<style scoped>
.MinesWeeperSettingsModal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: fit-content;
  height: fit-content;
  background: #fff;
  color: #1a1a1a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px 40px;
  border-radius: 12px;

  span.close {
    position: absolute;
    background: red;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 10px;
    right: 10px;
    font-weight: bold;
    color: #ffffff;
    cursor: pointer;
  }

  & > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin: 5px 0;

    label {
      width: 100px;
    }

    input {
      width: 150px;
      background: transparent;
      color: #1a1a1a;
      border: none;
      border-bottom: 3px solid #3ce8f1;
      padding: 2px 5px;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
    }

    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type="number"] {
      -moz-appearance: textfield;
    }

    button {
      border: none;
      border-radius: 12px;
      padding: 8px 16px;
      margin-right: 10px;
      cursor: pointer;

      &#cancel {
        background: #006fff;
        color: #ffffff;
      }

      &#submit {
        background: #00ff04;
        color: #1a1a1a;
      }

      &#reset {
        background: #fa2e2e;
        color: #ffffff;
      }
    }
  }
}

.background {
  position: absolute;
  background: #1a1a1a;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  opacity: 0.5;
}
</style>
