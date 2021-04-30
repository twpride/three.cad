







Draw a two outline using lines and arcs

Extrude the ouline into a 3d solid

combine multiple solids to form the part you desire

uplaod your design to a 3d printer

navigation tips



General Workflow for part creation

Specify a sketch plane

Draw a closed loop shape 

Extrude 2D sketch






the program consists of 4 major areas labelled below




Dialog Box
Normally hidden. This box appears when the user is adding or editting a sketch or extrusion

input area: This specifies the extrusion amount
flip icon: This flips the extrusion direction
green check: When clicked the program will proceed with adding or editting a sketch/extrusion
red x: allows the user to bail out of adding or editting a sketch/extrusion


Toolbar

sketch: Initiates a new sketch, before clicking this button, the user must first select a plane, or three points on existing extrusions to define a sketch plane.
extrude: Intiates new extrusion dialog. before clickin gthis button. The user must firs select a sketch to extrude from

boolean add: Creates a new solid that is a boolean union or two selected solids. 
boolean subtract: Creates a new solid that is a boolean subtraction of the second selected solid from the first selected solid.  
boolean add: Creates a new solid that is a boolean intersection or two selected solids. 

new document: Wipes the current workspace and starts a fresh document
save: saves current document. on the inital save the user can specify save location and file name
open: loads an existing document from the local disk.
STL: Exports selected solid to 3d print friendly stl format




extrude: creates a new extrusion from the current sketch. 


line: initiates line sketch mode. Subsequent clicks on the canvas define the vertices of the line segment chain.
arc: initiates arc sketch mode. Subsequently, a three click sequence on the canvas spefies the arc shape. The first sets the start point, the seconds the endpoint, and the third the radius.


dimension: allows hte user to add distance or angle constraints to the sketch. When 2 points, or 1 point and 1 line are selected, a distance contraint is added. When two lines are selected, an angle constraint is added
coincident: Adds a coincident contraint between two points, or a line and a point
vertical: adds a vertical constraint the the selected line, or two selected points
horizontal: adds a horizontal constraint the the selected line, or two selected points
tangent: adds a tangent constraint between selected two arcs, or a line and a arc. The selected entities must first between connected by a coicident contraint on their endpoints

User can click this again or escape to exit this mode






Design Tree