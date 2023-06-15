export default class Bullet {
    constructor(position, angle, color, id) {
        this.color = color;
        this.radius = 8;
        this.position = position;
        this.speed = 5;
        this.angle = angle;
        this.id = id;
    }
    ;
    draw(ctx) {
        // draw the inside
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color.bg;
        ctx.fill();
        // draw the border
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius + 2, 0, Math.PI * 2);
        ctx.strokeStyle = this.color.border;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    ;
    update() {
        this.position.x += this.speed * Math.cos(this.angle);
        this.position.y += this.speed * Math.sin(this.angle);
    }
    ;
}
