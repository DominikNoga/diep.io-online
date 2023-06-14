import Player from "../components/player";
import Obstacle from "../components/obstacle";

export const drawPlayerObject = (ctx: CanvasRenderingContext2D, player: Player): void =>{
    // draw the inside
    ctx.beginPath();
    ctx.arc(player.position.x, player.position.y, player.radius, 0, 2 * Math.PI);
    ctx.fillStyle = player.color.bg;
    ctx.fill();
    // draw the border
    ctx.beginPath();
    ctx.arc(player.position.x, player.position.y, player.radius + 2, 0, Math.PI*2);
    ctx.strokeStyle = player.color.border;
    ctx.lineWidth = 3;
    ctx.stroke();
};

export const drawBarrel = (ctx: CanvasRenderingContext2D, player: Player) =>{
    // border
    ctx.beginPath()
    ctx.strokeStyle = 'black';
    ctx.lineWidth = player.barrelParams.width + 6;
    ctx.moveTo(player.position.x, player.position.y);
    ctx.lineTo(player.barrelParams.position.x, player.barrelParams.position.y);
    ctx.stroke();
    ctx.closePath(); 
    
    // inside
    ctx.beginPath()
    ctx.lineWidth = player.barrelParams.width;
    ctx.strokeStyle = player.barrelParams.color;
    ctx.moveTo(player.position.x, player.position.y);
    ctx.lineTo(player.barrelParams.position.x, player.barrelParams.position.y);
    ctx.stroke();
    ctx.closePath(); 
};

export const drawNameBar = (ctx: CanvasRenderingContext2D, player: Player) =>{
    
    const rectHeight = player.radius*1.5;
    const fontSize = rectHeight/1.2;
    const rectWidth = (player.name.length - 2)*fontSize + player.radius;
    ctx.fillStyle = 'white';
    const rectX = player.position.x - rectWidth/2;
    const rectY = player.position.y + 1.5*player.radius;
    // Draw rectangle
    // ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

    // Set text color
    ctx.fillStyle = "black";

    // Set font properties
    
    ctx.font = fontSize + "px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    // Calculate text position
    const textX = rectX + rectWidth / 2;
    const textY = rectY + rectHeight / 2;

    // Render text on the rectangle
    ctx.fillText(player.name+" "+player.score, textX, textY);
}

export const drawLifeBar = (ctx: CanvasRenderingContext2D, player: Player) => {
    const borderWidth = 6;
    const maxLife = 100
    const innerWidth = player.radius * 4 * player.lifeLeft/maxLife;
    const outerWidth = player.radius * 4 + borderWidth;
    const rectHeight = player.radius*0.8;

    const rectX = player.position.x - outerWidth/2;
    const rectY = player.position.y - 3 * player.radius;
    ctx.strokeStyle = 'black';
    ctx.strokeRect(rectX, rectY, outerWidth, rectHeight + borderWidth);
    ctx.fillStyle = '#0db53a';
    ctx.fillRect(rectX + borderWidth/2, rectY + borderWidth/2, innerWidth, rectHeight);
}

export const drawObstacleLifeBar = (ctx: CanvasRenderingContext2D, obstacle: Obstacle) => {
    const borderWidth = 6;
    const innerWidth = obstacle.radius * 4 * obstacle.lifeLeft/obstacle.maxLife;
    const outerWidth = obstacle.radius * 4 + borderWidth;
    const rectHeight = obstacle.radius*0.8;

    const rectX = obstacle.position.x - outerWidth/2;
    const rectY = obstacle.position.y - 3 * obstacle.radius;
    ctx.strokeStyle = 'black';
    ctx.strokeRect(rectX, rectY, outerWidth, rectHeight + borderWidth);
    ctx.fillStyle = '#0db53a';
    ctx.fillRect(rectX + borderWidth/2, rectY + borderWidth/2, innerWidth, rectHeight);
}