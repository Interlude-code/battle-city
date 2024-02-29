import { Rectangle } from '../../entities/rectangle.entity.ts';

export class Quadtree {

    boundary: Rectangle;
    capacity: number;
    points: any[];
    divided: boolean;
    northeast: Quadtree;
    northwest: Quadtree;
    southeast: Quadtree;
    southwest: Quadtree;


    constructor(boundary, capacity) {
        this.boundary = boundary; // Límites del quadtree
        this.capacity = capacity; // Capacidad máxima de objetos antes de subdividir
        this.points = []; // Objetos contenidos en este nodo
        this.divided = false; // Indica si el nodo ha sido subdividido
    }

    // Inserta un objeto en el quadtree
    insert(point, itemNumber) {
        if (!this.boundary.containsArea(point)) {
            return; // Si el punto no está dentro de los límites, no lo insertamos
        }

        if (this.points.length < this.capacity) {
            this.points.push({point, itemNumber}); // Si hay espacio, insertamos el punto
        } else {
            if (!this.divided) {
                this.subdivide(); // Si alcanzamos la capacidad, subdividimos si no está subdividido
            }

            this.northeast.insert(point, itemNumber);
            this.northwest.insert(point, itemNumber);
            this.southeast.insert(point, itemNumber);
            this.southwest.insert(point, itemNumber);
        }
    }

    // Subdivide el nodo en cuatro subnodos
    subdivide() {
        const x = this.boundary.x;
        const y = this.boundary.y;
        const w = this.boundary.w / 2;
        const h = this.boundary.h / 2;

        const neBoundary = new Rectangle(x + w, y, w, h);
        this.northeast = new Quadtree(neBoundary, this.capacity);

        const nwBoundary = new Rectangle(x, y, w, h);
        this.northwest = new Quadtree(nwBoundary, this.capacity);

        const seBoundary = new Rectangle(x + w, y + h, w, h);
        this.southeast = new Quadtree(seBoundary, this.capacity);

        const swBoundary = new Rectangle(x, y + h, w, h);
        this.southwest = new Quadtree(swBoundary, this.capacity);

        this.divided = true;
    }

    // Realiza una búsqueda en el quadtree y devuelve los puntos cercanos a un objeto dado
    query(range, found = []) {
        if (!this.boundary.intersects(range)) {
            return found; // Si no hay intersección, no se encuentran puntos
        }

        for (const point of this.points) {
            if (range.containsArea(point.point)) {
                found.push(point); // Agregamos puntos dentro del rango
            }
        }

        if (this.divided) {
            this.northeast.query(range, found);
            this.northwest.query(range, found);
            this.southeast.query(range, found);
            this.southwest.query(range, found);
        }

        return found;
    }

    clear() {
        this.points = [];

        if (this.divided) {
            this.northeast.clear();
            this.northwest.clear();
            this.southeast.clear();
            this.southwest.clear();
            this.divided = false; // Indicar que ya no está dividido después de la limpieza
        }
    }

}