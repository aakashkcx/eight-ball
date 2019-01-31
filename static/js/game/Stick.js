const MAX_POWER = 50;

const Stick = function (position) {

    this.position = position;
    this.rotation = 0;
    this.power = 0;

    this.width = 20;
    this.height = 750;

};

Stick.prototype.draw = function () {

    let opposite = canvas.mouse.position.y - this.position.y;
    let adjacent = canvas.mouse.position.x - this.position.x;
    this.rotation = Math.atan2(opposite, adjacent);

    if (canvas.mouse.down) {
        if (this.power < MAX_POWER) this.power+= 0.5;
    } else if (this.power > 0) {
        shoot(this.power, this.rotation);
        this.power = 0;
    }

    let offset = new Vector(-this.width / 2, this.power + 50);
    canvas.drawRect(offset, Vector.add(this.position, TABLE), new Vector(this.width, this.height), 'bisque', this.rotation + Math.PI / 2);

};