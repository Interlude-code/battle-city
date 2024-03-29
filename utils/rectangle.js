export class Rectangle {
    constructor(x, y, w, h) {
        this.x = x; // Coordenada x del vértice superior izquierdo
        this.y = y; // Coordenada y del vértice superior izquierdo
        this.w = w; // Ancho del rectángulo
        this.h = h; // Altura del rectángulo
    }

    // Verifica si este rectángulo contiene un punto (x, y)
    contains(point) {
        return (
            point.x >= this.x &&
            point.x <= this.x + this.w &&
            point.y >= this.y &&
            point.y <= this.y + this.h
        );
    }

    // Verifica si este rectángulo intersecta con otro rectángulo
    intersects(other) {
        return !(
            other.x > this.x + this.w ||
            other.x + other.w < this.x ||
            other.y > this.y + this.h ||
            other.y + other.h < this.y
        );
    }
}