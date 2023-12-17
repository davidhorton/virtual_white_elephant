# White Elephant Game

Okay, so there's the idea behind this app: built with vue, it is intended to be setup
and run locally and then you can share the screen over Zoom or something to do a virtual
game of the white elephant gift giving game.

Here's how you set it up:
- Put in some mp4 videos into the src/assets/giftvideos directory that describe each gift. Get one video for each gift.
- Copy the gameDefinition-example.js file into the same location but rename it to gameDefinition.js.
- Fill out the gameDefinition.js file - you need to put in the name of who's playing and details about the gift.
    - It should all be pretty clear in that file, but to clarify a couple things: the videoName field of the gift is
    the name of the video file in src/assets/giftvideos (without the extension). And the url field of the gift is what
    gets copied to your clipboard when you click the "Copy URL" button after opening a new gift in the game (handy
    if you want to paste the details of the gift into a group chat as the game progresses).
    - There are two other config options you'll see in there that aren't gifts or people: firstPlayerEndSwap and firstPlayerEndSwapStrict.
    For firstPlayerEndSwap, that means at the end of the game if the 1st player hasn't been stolen from they will have a
    chance to swap. For firstPlayerEndSwapStrict, that means the 1st player will have a chance to steal regardless of
    whether they've been stolen from or not.
    - Another recently added config option is randomizeGiftPlacement. If this is true then the gift number is ignored and reset
    randomly, if it is false then the gifts are not randomized and they are placed based on the gift number.
- Create a video called welcome.mp4 and place it in to src/assets. This is the video that plays on a loop before the game starts.
- Run `npm install` and then `npm run dev` in the root of the project (you'll need npm installed).
- Play the game! At the end it will give some reports that you can just copy from the browser and send to everyone.
