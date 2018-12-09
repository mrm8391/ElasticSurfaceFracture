/**
 * This bucket acts as a typical face in a DCEL, but also has a list of points
 * that the triangle contains.
 */
class DelaunayBucket{

    /** 
     * Constructor of a delaunay bucket
     * 
     * @param a this is the new point that is being introduced to the triangulation
     * @param b one of the points already in the DT
     * @param c one of the points already in the DT
     */
    constructor(a, b, c, index){
        if (Utils.determinant(a,b,c) <= 0){
            throw "DelTriangulation should have taken care of this! This is not in counterclockwise order.";
        }
        
        this.containedPoints = [];
        this.a = a;
        this.b = b;
        this.c = c;
        this.id = index;

        
    }

    addPoint(p){
        this.containedPoints.push(p);
    }

    assignHalfEdges(){
        //Create the halfedges for this face
        this.firstHedge = new DelaunayHedge(a, b);
        this.firstHedge.setTwins();

        let hashBC = Utils.cantorHash(b,c);
        let hashCA = Utils.cantorHash(c,a);

        let bc = -9999;
        let ca = -9999;

        if(!DelTriangulation.allEdges.has(hashBC)){
        bc = new DelaunayHedge(b, c);
        bc.setTwins();
        bc.setIncidentFace(this.id);
        }
        else{
            let bcEdge = DelTriangulation.allEdges.get(hashBC);
            if (bcEdge[0] === b){
                bc = bcEdge[0];
            }
            else{
                bc = bcEdge[1];
            }
        }

        if(!DelTriangulation.allEdges.has(hashCA)){
            ca = new DelaunayHedge(c, a);
            ca.setTwins();
            ca.setIncidentFace(this.id);
            }
            else{
                caEdge = DelTriangulation.allEdges.get(hashCA);
                if (caEdge[0] === b){
                    ca = caEdge[0];
                }
                else{
                    ca = caEdge[1];
                }
            }


        this.firstHedge.setNext(bc);
        bc.setNext(ca);
        ca.setNext(this.firstHedge);
    }
}