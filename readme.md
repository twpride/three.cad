<h1 align="center">three.cad</h1>
<div align="center" >
<a href="https://twpride.github.io/three.cad/">
Live Site
</a>
</div>
 
<p align="center">
 <img style="width:min(600px,100%)"  src="https://raw.githubusercontent.com/twpride/three.cad/master/dist/site_preview.gif"></img>
</p>
 
# About
Three.cad is a 3D modelling web app built using [three.js](https://threejs.org/), [React](https://reactjs.org/), and [Web Assembly](https://webassembly.org/). It features parametric sketching and constructive solid geometry (CSG) capabilities.
 
# Highlights
 
## 2D Sketching
 
<p align="center">
 <img style="width:min(600px,100%)"  src="https://raw.githubusercontent.com/twpride/three.cad/master/dist/sketch.gif"></img>
</p>
 
Made possible by the raycasting and matrix transformation features provided by three.js, the user can sketch on any arbitrary 2D plane in 3D space. With the provided the line and the arc tools, the user can sketch almost all the geometry commonly found in engineering applications.
 
### Geometric Constraint Solver
 
At the heart of three.cad is its parametric sketching environment. Initially, after a line is drawn, the user can  drag the vertex endpoints and freely alter their positions. If however a constraint (such as an angle or distance) is added to a sketched line, the program will enforce these constraints whenever modifications are made to the vertex positions. With constraints like coincidence, distance, angle, and tangency, the user is empowered to draw sketches that are entirely controlled by geometric relationships.
 
In the backend, the parametric sketching capability is powered by a third-party C++ [library](https://github.com/solvespace/solvespace) compiled into a Web Assembly binary. Provided the initial vertex positions and constraints, the library calculates the final vertex positions that satisfy all the constraints. This calculation is done whenever a modification is made to the sketch which potentially can be as often as 60 times per second (dragging of a vertex). 
 
## Solid Modelling
 
### Finding a loop
 
When the user decides to extrude a 2D sketch to 3D, the program employs a loop finding algorithm to search for a closed loop in the sketch. Once a loop is found, it is extruded using the [ExtrudeGeometry](https://threejs.org/docs/#api/en/geometries/ExtrudeGeometry) method.
 
### Constructive Solid Geometry
 
Once a multiple solids are formed via extrusion of 2D sketches, the user can perform boolean operations such as union, subtract, and intersect between them to form new composite solids. The capability, called constructive solid geometry, is powered by a third-party [library](https://github.com/manthrax/THREE-CSGMesh) (which itself is based on another [libary](https://github.com/evanw/csg.js/).
 
### Design Tree
 
The ability to combine existing solids to form new ones, enables the formation of complex design trees in which a solid is created from two parent solids which themselves are descendents of other solids. Managing this design tree requires keeping track of the parent/child relationship between the solids and utilizing a depth first search to update all descendents whenever a node(solid or sketch) is changed.
 
 
## Local File System
 
three.cad takes advantage of the [FileSystem API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) available in Chromium based browers. The user can open, edit, and save solid models directly from the local disk.
