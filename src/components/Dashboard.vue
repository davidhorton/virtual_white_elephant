<template>
  <div>
    <video autoplay muted loop id="background-video">
      <source src="../assets/background.mp4" type="video/mp4">
    </video>
    <img id="title" src="../assets/title23.png" alt="title">

    <div v-if="waitingToStart">
      <b-button @click="()=>{onStartGame()}" id="start-button" size="lg" variant="primary">LET THE GAME BEGIN!</b-button>
      <img id="welcome-video-border" src="../assets/titleBlack.png" alt="title">
      <video autoplay muted loop id="welcome-video">
        <source src="../assets/welcome.mov" type="video/mp4">
      </video>
    </div>

    <div v-if="!waitingToStart">
      <GameBoardLoading v-if="loading" />
      <GameBoard v-if="!loading" />
    </div>
  </div>
</template>

<script>
  import GameBoard from "./GameBoard";
  import GameBoardLoading from "./GameBoardLoading";
  export default {
    name: "Dashboard",
    components: {
      GameBoard, GameBoardLoading
    },
    data() {
      return {
        waitingToStart: true,
        loading: true,
      }
    },
    methods: {
      onStartGame() {
        const audio = new Audio(require('../assets/letsPlay.mp3'));
        audio.play();
        this.waitingToStart = false;
        setTimeout(() => this.loading = false,5000);
      }
    },
  };
</script>

<style scoped>
  #background-video {
    position: fixed;
    z-index:-99999;
    right: 0;
    bottom: 0;
    min-width: 100%;
    min-height: 100%;
  }
  #welcome-video {
    position: fixed;
    width: 1400px;
    top: 300px;
    margin-left: -700px;
    left: 50%;
  }
  #welcome-video-border {
    position: fixed;
    left: 50%;
    width: 1540px;
    margin-left: -770px;
    top: 210px;
    height: 1000px;
  }
  #title {
    position: fixed;
    left:50%;
    width: 700px;
    height: 170px;
    margin-left: -350px;
    top: 10px;
  }
  #start-button {
    width: 330px;
    position: fixed;
    left: 50%;
    margin-left: -165px;
    top: 1108px;
    z-index: 999999;
    height: 60px;
  }
</style>
