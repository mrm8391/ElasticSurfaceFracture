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

    //For the purposes of this implementation of a DCEL, for Delaunay Triangulation,
    //sites are simply in the form [x,y] and do not contain any other data or metadata
    allSites:  [],

    //list of sites left in the triangulation (most cocircular sites are removed)
    delaunaySites: [],

    //the list of all the triangles. This is a map because the triangles are 
    //frequently added and removed
    allBuckets: [],

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

        let boundBucket = new DelaunayBucket(
            DelTriangulation.boundingTriangle[0], 
            DelTriangulation.boundingTriangle[1], 
            DelTriangulation.boundingTriangle[2],
            0);

        //v should be in the form [x, y]
        for(let v of sites){
            DelTriangulation.allSites.set(v);
            boundBucket.addPoint(v);
        }
        DelTriangulation.subTriangulate(boundBucket);

        /*for (let v = 0; v < allSites.length; v++){
            DelTriangulation.insertVert(v);
        }/**/
    },

    //Insert
    subTriangulate(triang){
        
    }
}