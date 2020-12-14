<!--suppress HtmlUnknownTarget -->
<template>
  <div>
    <!--Opening gift transitions-->
    <transition v-on:enter="enterBigGift" v-bind:css="false">
      <img v-if="showBigGift" class="big-gift" v-bind:src="require('../assets/gift_' + justOpenedGift.color + '.png')" alt="big gift">
    </transition>
    <transition v-on:enter="enterBigGiftVideo" v-bind:css="false">
      <img v-if="showBigGift" class="big-gift-video" v-bind:src="require('../assets/titleBlack.png')" alt="big gift">
    </transition>
    <transition v-on:enter="enterAfterGiftButton" v-bind:css="false">
      <b-button v-if="showBigGift" @click="onContinueAfterGift" id="continue-after-gift-button" size="lg" variant="primary">Continue -></b-button>
    </transition>
    <transition v-on:enter="enterAfterGiftButton" v-bind:css="false">
      <b-button v-if="showBigGift" @click="copyUrl" id="copy-url-button" size="sm" variant="primary">Copy URL</b-button>
    </transition>
    <transition v-on:enter="enterAfterGiftVideo" v-bind:css="false">
      <video v-if="showBigGift" id="gift-video" ref="giftVideo">
        <source v-bind:src="require('../assets/giftvideos/' + justOpenedGift.videoName + '.mp4')" type="video/mp4">
      </video>
    </transition>

    <!--Stealing stuff transitions-->
    <transition v-on:enter="enterStealBorder" v-bind:css="false">
      <img v-if="showStealEventText" class="big-gift" v-bind:src="require('../assets/stealBorder.png')" alt="big gift">
    </transition>
    <transition v-on:enter="enterStealOtherStuff" v-bind:css="false">
      <h1 id="steal-event-text" v-if="showStealEventText">{{stealEventText}}</h1>
    </transition>
    <transition v-on:enter="enterStealOtherStuff" v-bind:css="false">
      <b-button v-if="showStealEventText" @click="onContinueAfterSteal" id="steal-event-continue-button" variant="error">Continue -></b-button>
    </transition>

    <div style="position: fixed; left: -1000px;">
      <label for="justOpenedGiftUrlInput"></label>
      <input ref="justOpenedGiftUrlRef" type="text" v-model="justOpenedGift.url" id="justOpenedGiftUrlInput">
    </div>

    <div v-if="!finished">
      <b-card bg-variant="light" class="shadow p-3 mb-5 rounded current-player-area">
        <h2>{{justStoleSomething ? currentPlayer.name + " got robbed! So now it's " + currentPlayer.name + "'s turn." : "It is " + currentPlayer.name + "'s turn!" }}</h2>
      </b-card>

      <b-container fluid style="margin: 30px 0 0 0; padding: 0 200px 0 200px;">
        <b-row>
          <b-col>
            <b-list-group>
              <b-list-group-item class="player-list-item" v-for="player in playersColumn1" @click="()=>{stealFromPlayer(player)}" :key="player.id" button :active="player.selected">
                #{{player.order}} {{player.name}}
                <span style="float: right">{{player.giftDesc}}</span>
              </b-list-group-item>
            </b-list-group>
          </b-col>
          <b-col>
            <b-list-group>
              <b-list-group-item class="player-list-item" v-for="player in playersColumn2" @click="()=>{stealFromPlayer(player)}" :key="player.id" button :active="player.selected">
                #{{player.order}} {{player.name}}
                <span style="float: right">{{player.giftDesc}}</span>
              </b-list-group-item>
            </b-list-group>
          </b-col>
          <b-col>
            <b-list-group>
              <b-list-group-item class="player-list-item" v-for="player in playersColumn3" @click="()=>{stealFromPlayer(player)}" :key="player.id" button :active="player.selected">
                #{{player.order}} {{player.name}}
                <span style="float: right">{{player.giftDesc}}</span>
              </b-list-group-item>
            </b-list-group>
          </b-col>
        </b-row>
      </b-container>

      <b-container fluid style="margin: 100px 0 0 0; padding: 0 100px 0 100px;">
        <b-row>
          <b-col v-for="gift in gifts" :key="gift.id" :style="{visibility: gift.opened ? 'hidden' : 'visible'}">
            <div class="gift-area" @click="()=>{onOpenGift(gift)}">
              <img v-if="gift.color !== ''" class="gift-image" v-bind:src="require('../assets/gift_' + gift.color + '.png')" alt="gift">
              <div class="gift-number">
                <p>{{gift.number}}</p>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>

    <div v-if="finished">
      <b-card bg-variant="light" class="shadow p-3 mb-5 rounded current-player-area">
        <h2>Game Over!</h2>
      </b-card>
      <b-container style="position: fixed; overflow: scroll; max-height: 1300px; width: 800px; margin-left: -400px; left: 50%; background: white">
        <h2 class="report-header">Distribution Report</h2>
        <b-table striped hover :items="gifts" :fields="distributionFields" sort-by="giver" sort-desc=false></b-table>
        <h2 class="report-header">Most Popular Gifts</h2>
        <b-table striped hover :items="gifts" :fields="favoriteGiftsFields" sort-by="stolenCount" sort-desc=true></b-table>
        <h2 class="report-header">Biggest Stealers</h2>
        <b-table striped hover :items="players" :fields="biggestStealersFields" sort-by="stealInitiatorCount" sort-desc=true></b-table>
        <h2 class="report-header">Most Picked On</h2>
        <b-table striped hover :items="players" :fields="mostPickedOnFields" sort-by="stolenFromCount" sort-desc=true></b-table>
        <h2 class="report-header">Slow Pokes</h2>
        <b-table striped hover :items="players" :fields="slowPokesFields" sort-by="timeSpentMilliseconds" sort-desc=true></b-table>
      </b-container>
    </div>
  </div>
</template>

<script>
  import Velocity from 'velocity-animate'
  import { config } from "../gameDefinition.js";

  export default {
    name: "GameBoard",
    data() {
      return {
        finished: false,
        doingEndSwap: false,
        firstPlayerEndSwap: config.firstPlayerEndSwap,
        firstPlayerEndSwapStrict: config.firstPlayerEndSwapStrict,
        firstPlayerWasStolenFrom: false,
        showGiftVideo: false,
        showBigGift: false,
        justOpenedGift: {},
        justStoleSomething: false,
        justStolenGiftID: 0,
        showStealEventText: false,
        stealEventText: '',
        currentPlayer: {},
        lastTurnStartTime: 0,
        players: config.players,
        gifts: config.gifts,
        playersColumn1: [],
        playersColumn2: [],
        playersColumn3: [],
        distributionFields: [],
        favoriteGiftsFields: [],
        biggestStealersFields: [],
        mostPickedOnFields: [],
        slowPokesFields: [],
      };
    },
    methods: {
      findPlayerByOrder(order) {
        for (let i = 0; i < this.players.length; i++) {
          const player = this.players[i];
          if (player.order === order) {
            return player;
          }
        }
      },
      registerPlayerTime() {
        this.currentPlayer.timeSpentMilliseconds += (new Date().getTime() - this.lastTurnStartTime);
      },
      restartTurnTime() {
        this.lastTurnStartTime = new Date().getTime();
      },
      onOpenGift(gift) {
        this.registerPlayerTime();
        this.justOpenedGift = gift;
        this.showBigGift = true;
        gift.opened = true;
        this.currentPlayer.selected = true;
        setTimeout(() => {
          const audio = new Audio(require('../assets/openGiftSound.mp3'));
          audio.play();
        }, 300);
      },
      stealFromPlayer(playerGettingRobbed) {
        if (!this.doingEndSwap && (playerGettingRobbed.giftID <= 0 || this.justStolenGiftID === playerGettingRobbed.giftID)) {
          return;
        }

        this.registerPlayerTime();

        if (playerGettingRobbed.order === 1) {
          this.firstPlayerWasStolenFrom = true;
        }

        this.stealEventText = this.currentPlayer.name + " stole the \"" + playerGettingRobbed.giftDesc + "\" from " + playerGettingRobbed.name + "!";
        this.justStoleSomething = true;
        this.justStolenGiftID = playerGettingRobbed.giftID;
        this.currentPlayer.selected = true;
        const oldCurrentPlayerGiftID = this.currentPlayer.giftID;
        const oldCurrentPlayerGiftDesc = this.currentPlayer.giftDesc;
        this.currentPlayer.giftID = playerGettingRobbed.giftID;
        this.currentPlayer.giftDesc = playerGettingRobbed.giftDesc;
        this.currentPlayer.stealInitiatorCount++;
        const gift = this.findGiftByID(playerGettingRobbed.giftID);
        if (gift) {
          gift.stolenCount++;
        }

        if (this.doingEndSwap) {
          playerGettingRobbed.stolenFromCount++;
          playerGettingRobbed.giftID = oldCurrentPlayerGiftID;
          playerGettingRobbed.giftDesc = oldCurrentPlayerGiftDesc;
        }
        else {
          playerGettingRobbed.stolenFromCount++;
          playerGettingRobbed.giftID = 0;
          playerGettingRobbed.giftDesc = '';
        }
        this.currentPlayer = playerGettingRobbed;
        this.showStealEventText = true;
        setTimeout(() => {
          const audio = new Audio(require('../assets/stealSound.mp3'));
          audio.play();
        }, 300);
      },
      findGiftByID(giftID) {
        for (let i = 0; i < this.gifts.length; i++) {
          const gift = this.gifts[i];
          if (gift.id === giftID) {
            return gift;
          }
        }
      },
      onContinueAfterGift() {
        const cleanUp = () => {
          this.showBigGift = false;
          this.justStoleSomething = false;
          this.justStolenGiftID = 0;
          searching = false;
        };

        this.currentPlayer.giftID = this.justOpenedGift.id;
        this.currentPlayer.giftDesc = this.justOpenedGift.description;
        this.restartTurnTime();

        //Find the next player who doesn't have a gift because now it's their turn
        let searching = true;
        let counter = 0;
        while (searching) {
          counter++;
          const nextPlayerOrder = this.currentPlayer.order + counter;
          console.log("next player order: " + nextPlayerOrder);
          if (nextPlayerOrder <= this.players.length) {
            const player = this.findPlayerByOrder(nextPlayerOrder);
            if (player.giftID <= 0) {
              console.log("next player: " + player.name);
              this.currentPlayer = player;
              cleanUp();
            }
          }
          else {
            console.log("game finished!");
            cleanUp();

            if (this.firstPlayerEndSwap && (this.firstPlayerEndSwapStrict || !this.firstPlayerWasStolenFrom)) {
              this.$bvModal.msgBoxConfirm("Does " + this.players[0].name + " want to swap?")
                .then(value => {
                  this.doingEndSwap = value;
                  if (this.doingEndSwap) {
                    this.currentPlayer = this.players[0];
                  }
                  else {
                    this.finishGame();
                  }
                })
                .catch(err => {
                  console.log("failed for some reason: " + err);
                })
            }
            else {
              this.finishGame();
            }
          }
        }
      },
      onContinueAfterSteal() {
        this.restartTurnTime();
        this.showStealEventText = false;
        if (this.doingEndSwap) {
          this.finishGame();
        }
      },
      finishGame() {
        const audio = new Audio(require('../assets/thatsTheGame.mp3'));
        audio.play();

        function convertTimeToString(ms, delim = " : ") {
          const showWith0 = value => (value < 10 ? `0${value}` : value);
          const hours = showWith0(Math.floor((ms / (1000 * 60 * 60)) % 60));
          const minutes = showWith0(Math.floor((ms / (1000 * 60)) % 60));
          const seconds = showWith0(Math.floor((ms / 1000) % 60));
          return `${parseInt(hours) ? `${hours}${delim}` : ""}${minutes}${delim}${seconds}`;
        }

        for (let i = 0; i < this.players.length; i++) {
          const player = this.players[i];
          player.timeSpentFormatted = convertTimeToString(player.timeSpentMilliseconds);
          const gift = this.findGiftByID(player.giftID);
          if (gift) {
            gift.recipient = player.name;
          }
        }

        this.distributionFields = [
          { key: 'description', label: 'Gift', sortable: false },
          { key: 'giver', label: 'From', sortable: true },
          { key: 'recipient', label: 'To', sortable: false },
        ];
        this.favoriteGiftsFields = [
          { key: 'description', label: 'Gift', sortable: false },
          { key: 'stolenCount', label: 'Steal Count', sortable: true },
        ];
        this.biggestStealersFields = [
          { key: 'name', label: 'Name', sortable: false },
          { key: 'stealInitiatorCount', label: 'Steals', sortable: true },
        ];
        this.mostPickedOnFields = [
          { key: 'name', label: 'Name', sortable: false },
          { key: 'stolenFromCount', label: 'Times Stolen From', sortable: true },
        ];
        this.slowPokesFields = [
          { key: 'name', label: 'Name', sortable: false },
          { key: 'timeSpentMilliseconds', label: 'Total Turn Time (ms)', sortable: true },
          { key: 'timeSpentFormatted', label: 'Total Turn Time', sortable: true },
        ];
        this.finished = true;
      },
      copyUrl() {
        this.$refs.justOpenedGiftUrlRef.select();
        document.execCommand("copy");
      },
      enterStealBorder(el) {
        Velocity(el, { opacity: 1, width: '1400px', height: '720px', 'margin-left': '-700px', top: '300px' }, { duration: 1000 });
      },
      enterStealOtherStuff(el) {
        Velocity(el, { opacity: 0 }, { duration: 999});
        Velocity(el, { opacity: 1 }, { duration: 1});
      },
      enterBigGift(el) {
        Velocity(el, { opacity: 1, width: '900px', height: '720px', 'margin-left': '-450px', top: '150px' }, { duration: 1000 });
        Velocity(el, { width: '900px' }, { duration: 600});
        Velocity(el, { rotateY: '90deg' }, { duration: 300});
      },
      enterBigGiftVideo(el) {
        Velocity(el, { opacity: 0 }, { duration: 1599});
        Velocity(el, { opacity: 1 }, { duration: 1});
        Velocity(el, { rotateY: '90deg' }, { duration: 300, loop: 1});
        Velocity(el, { width: '1800px', height: '1200px', 'margin-left': '-900px', top: '50px' }, { duration: 2000 });
      },
      enterAfterGiftButton(el) {
        Velocity(el, { opacity: 0 }, { duration: 4499});
        Velocity(el, { opacity: 1 }, { duration: 100});
      },
      enterAfterGiftVideo(el) {
        Velocity(el, { opacity: 0 }, { duration: 4499});
        Velocity(el, { opacity: 1 }, { duration: 500});
        setTimeout(()=> this.$refs.giftVideo.play(), 5100);
      },
    },
    mounted() {
      //Assign random gift colors
      this.gifts = shuffle(this.gifts);
      const possibleGiftColors = ["blue", "green", "orange", "pink", "red", "yellow"]
      for (let i = 0; i < this.gifts.length; i++) {
        const gift = this.gifts[i];
        gift.number = i + 1
        gift.color = possibleGiftColors[Math.floor(Math.random() * possibleGiftColors.length)];
      }

      //Shuffle the order of the players
      function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      }
      this.players = shuffle(this.players);

      //Split the players into 3 groups
      let listCounter = 1;
      for (let i = 0; i < this.players.length; i++) {
        const player = this.players[i];
        if (listCounter === 1) {
          this.playersColumn1.push(player);
        }
        if (listCounter === 2) {
          this.playersColumn2.push(player);
        }
        if (listCounter === 3) {
          this.playersColumn3.push(player);
        }

        listCounter++;
        if (listCounter === 4) {
          listCounter = 1;
        }
      }

      //Assign the orders so it goes down each list
      let playerCounter = 1;
      for (let i = 0; i < this.playersColumn1.length; i++) {
        this.playersColumn1[i].order = playerCounter;
        playerCounter++;
      }
      for (let i = 0; i < this.playersColumn2.length; i++) {
        this.playersColumn2[i].order = playerCounter;
        playerCounter++;
      }
      for (let i = 0; i < this.playersColumn3.length; i++) {
        this.playersColumn3[i].order = playerCounter;
        playerCounter++;
      }

      this.currentPlayer = this.findPlayerByOrder(1);
      this.restartTurnTime();
    },
  }
</script>

<style scoped>
  .current-player-area {
    text-align: center;
    margin-top: 210px;
    width: 800px;
    margin-left: -400px;
    height: 115px;
    left: 50%;
  }
  .player-list-item {
    font-size: 22px;
  }
  .gift-area {
    cursor: pointer;
  }
  .gift-image {
    width: 150px;
    height: 120px;
    margin-bottom: 10px;
  }
  .gift-number {
    position: absolute;
    top: 55px;
    left: 35px;
    font-size: 30px;
    color: black;
  }
  .big-gift {
    position: fixed;
    z-index: 999999;
    left:50%;
    width: 0;
    height: 0;
    margin-left: 0;
    top: 99%;
  }
  .big-gift-video {
    position: fixed;
    opacity: 0;
    z-index: 9999;
    left: 50%;
    width: 850px;
    height: 510px;
    margin-left: -425px;
    top: 360px;
  }
  #continue-after-gift-button {
    opacity: 0;
    width: 380px;
    position: fixed;
    left: 50%;
    margin-left: -190px;
    top: 1120px;
    z-index: 999999999;
    height: 80px;
  }
  #copy-url-button {
    opacity: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 999999999;
  }
  #steal-event-text {
    opacity: 0;
    position: fixed;
    color: white;
    z-index: 99999999;
    width: 1400px;
    margin-left: -700px;
    top: 630px;
    left: 50%;
    text-align: center;
    font-size: 40px;
  }
  #steal-event-continue-button {
    opacity: 0;
    position: fixed;
    color: white;
    z-index: 99999999;
    width: 300px;
    margin-left: -150px;
    top: 800px;
    left: 50%;
    text-align: center;
    font-size: 40px;
  }
  #gift-video {
    position: fixed;
    opacity: 0;
    z-index: 99999999;
    width: 1450px;
    top: 240px;
    margin-left: -725px;
    left: 50%;
  }
  .report-header {
    margin-top: 30px;
  }
</style>
