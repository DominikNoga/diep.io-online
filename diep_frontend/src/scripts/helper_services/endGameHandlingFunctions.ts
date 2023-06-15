export const createEndGameScreen = (playerScore: number, playerName: string) => {
    return `<section class="end-game-screen">
    <h1 class="message">Game Over!</h1>
    <p class="final-message">
        Congratulations! <span id="player-name">${playerName}</span> You have finishe with the score of <span id="final-score">${playerScore}</span>
    </p>
    <button class="rejoin-button">Join again</button>
</section>`
}

export const setEndGameScreen = (playerScore: number, playerName: string) => { 
    document.body.innerHTML = ``
    document.body.innerHTML = createEndGameScreen(playerScore, playerName);
}
