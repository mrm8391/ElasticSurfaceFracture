/* This contains maps for key-value pairs:
    

    particle: vertIndex

    ///You must delete the spring force dependency from each particle
    spring: particles
    
    spring: faceIndices

    */
var FractureMaintenance = {
    //part_vertIndices = new Map(),
    spring_particles = new Map(),
    spring_faceIndices = new Map(),

    addParticles(springInd, particle1, particle2){
        if(!this.spring_particles.has(springInd)){
            this.spring_particles[springInd] = [particle1, particle2];
        }
    },

    addFaces(springInd, faceInd){
        if(!this.spring_faceIndices.has(springInd)){
            this.spring_faceIndices[springInd] = [faceInd, -1];
        }
        else if(this.spring_faceIndices[springInd][1] = -1){
            
        }
    }
}