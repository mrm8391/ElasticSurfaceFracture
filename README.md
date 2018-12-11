ElasticSurfaceFracture

What is this: Webpage containing a Javascript simulation of elastic properties.

Where is this: Simulation files are contained in js/esf. Configuration constants for it are located in Config.js at the root directory.

To reach the main website, clone git repo and open index.html (better looking) or click on:
http://htmlpreview.github.io/?https://github.com/mrm8391/ElasticSurfaceFracture/blob/master/index.html

To run just the simulation, clone the git repo and open minimalSimulation.html or click on:
http://htmlpreview.github.io/?https://github.com/mrm8391/ElasticSurfaceFracture/blob/master/minimalSimulation.html

Usage: Scroll down to the simulation section, and click the initialize button. Runtime constants can be modified with the inputs to the right, but some constants can only be modified in Config.js. Uncheck the pause box to start the physics simulation; you can use the mouse to control a camera in the scene.

Other notes:
Admittedly, the website portion of this is in need of cleaning up. The Javascript and CSS libraries also need to be refactored
to use a package manager. Due to time constraints as college students, the libraries are bundled within the repository for now. However,
both me and my collaborator intend on touching this up once the semester comes to a close.
Our Delaunay Triangulation is partially done, and can be located in the delaunayTriangulation folder. To show results of the rest of the project however, we are using a borrowed Delaunator from Mapbox as a placeholder.

Library and resource credit:

Bootstrap Creative Theme
Designed by Blackrock Digital. Free for non-commercial use.
https://github.com/BlackrockDigital/startbootstrap-creative

Geometry cover image
Designed and owned by Freepik. Used in accordance with their free license.
http://www.freepik.com

ThreeJS Library
Free use
https://threejs.org/

Plane intersection function
Created by an anonymous user
https://stackoverflow.com/a/38437831

ThreeJS Memory Disposal
Created by multiple users in a collaborative effort
https://stackoverflow.com/questions/33152132/three-js-collada-whats-the-proper-way-to-dispose-and-release-memory-garbag/33199591#33199591

Delaunator: This is a placeholder for generating a Delaunay Triangulation until we can get our own implementation stable and working.
Created by a private company called Mapbox
https://github.com/mapbox/delaunator

Conceptual Resources:

(Class Notes)
Mount, David M., Pless, Robert. "Delaunay Triangulation." Computational Geometry. University of Maryland, College Park, MD. 2012.

(More on Delaunay Triangulation edge cases)
https://www.ti.inf.ethz.ch/ew/Lehre/CG13/lecture/Chapter%206.pdf

(4x4 determinants)
Weston, Harley. "4 by 4 determinants." Math Central: Quandries & Queries. University of Regina. http://mathcentral.uregina.ca/QQ/database/QQ.09.07/h/rav1.html

(3x3 determinants)
https://www.youtube.com/watch?v=mEeHxKH46O0

(For Doubly Connected Edge List information)
de Berg M., van Kreveld M., Overmars M., Schwarzkopf O.C. Computational Geometry: Algorithms and Applications, Ed. 2. Springer, Berlin, Heidelberg. http://www.cs.sfu.ca/~binay/813.2011/DCEL.pdf

