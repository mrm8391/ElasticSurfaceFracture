var DelTriangulation = {
    //DCEL? yes
    //dcel = new DCEL(),

    //Uses the incremental construction algorithm
    
    //Start with a sufficiently large triangle that contains all the points in the set.
    //In this case, that is the 
    boundingTriangle: 
            //these points are not within the main plane bounds, 
            //so they should not be added to the list of sites.
            [[-CONF.planeWidth/2, -CONF.planeWidth/2],
            [CONF.planeWidth * 1.5, -CONF.planeWidth/2],
            [-CONF.planeWidth/2, CONF.planeWidth * 1.5]],

    boundBucket: new DelaunayBucket(boundingTriangle[0], 
                                    boundingTriangle[1], 
                                    boundingTriangle[2]),
    

    //For the purposes of this implementation of a DCEL, for Delaunay Triangulation,
    //sites are simply in the form [x,y] and do not contain any other data or metadata
    allSites:  [],

    //the list of all the triangles. This is a map because the triangles are 
    //frequently added and removed
    allTriangles: [],

    //Note that whenever a new edge is introduced, the only time an old edge is removed is when
    //edge flipping is performed. This is an edge list instead of a halfedge list because 
    //the keys are determined by cantor hashing the indices. While this gives a unique number
    //for a pair of numbers, order is not considered with cantor hash.
    //This is in the format 
    //      key (cantor hash of vertex indices), 
    //      value ([DelaunayHedge0, DelaunayHedge1])
    allEdges: new Map(),

    //createDT removes cocircular points, returns the internal DCEL
    //map the DT to the open source functions and their returns
    triangulate(sites){


        //v should be in the form [x, y]
        for(let v of sites){
            
            DelTriangulation.allSites.push(v);

        }


        for (let v = 0; v < allSites.length; v++){
            DelTriangulation.insertVert(v);
        }
    },

    //Insert
    insertVert(v){

    }
}