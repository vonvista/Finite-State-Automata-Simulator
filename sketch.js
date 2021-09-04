var controlsHeight = document.getElementById("controlMain").offsetHeight 
p5.disableFriendlyErrors = true; // disables FES

var animSpeed = 10
const easing = 0.05 * animSpeed

var clickMode = "none"
var inp, inpButton, inpValue, inpTarget
var tempTransition
var stringValue = ""
var keyPress
var editingMode = false

//COLORS
const YELLOW = [255, 242, 0]
const WHITE = [255,255,255]
const BASE_DARKBLUE = [28,42,53]

const VISITED_COLOR = [32,98,149]
const TRAVERSAL_OUTLINE = [255,157,0]

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve,ms));
}

var AUs = ""

class Graph {
  // defining vertex array and
  // adjacent list
  constructor(noOfVertices)
  {
    this.noOfVertices = noOfVertices
    this.AdjList = new Map()
  }

  addVertex(v)
  {
    // this.AdjList.set(v, []);
    this.AdjList.set(v, new Set());
  }

  addEdge(v, w)
  {
    if(v == w){
      this.AdjList.get(v).add(w);
      return
    }
    // get the list for vertex v and put the
    // vertex w denoting edge between v and w
    this.AdjList.get(v).add(w);
  
    // Since graph is undirected,
    // add an edge from w to v also
    //this.AdjList.get(w).add(v);
  }

  removeEdge(v, w){

    if(edges.has(w.value + "," + v.value)){
      edges.get(w.value + "," + v.value).edgeType = "straight"
    }

    this.AdjList.get(v).delete(w);
  }

  removeNode(v){
    
    for (const [key, value] of this.AdjList.entries()) {
      if(value.has(v)){
        value.delete(v)
      }
    }

    this.AdjList.delete(v);
  }

  async bfs(startingNode) {

    disableButtonControls()

    // create a visited object
    var visited = {};
  
    // Create an object for queue
    var q = []
  
    // add the starting node to the queue
    visited[startingNode.value] = true;
    q.push(startingNode);
    await startingNode.changeFill(32,98,149)
    //startingNode.outlineColor = [255,157,0]
    await startingNode.changeOutline(255,157,0)

    statusText = "Running: Breadth-First Search(" + startingNode.value + ")"
  
    // loop until queue is element
    while (q.length != 0) {
      // get the element from the queue
     
      var getQueueElement = q.shift();

      // passing the current vertex to callback funtion
      console.log(getQueueElement.value);
      await getQueueElement.changeFill(32,98,149)

      // get the adjacent list for current vertex
      var get_List = this.AdjList.get(getQueueElement);

      // loop through the list and add the element to the
      // queue if it is not processed yet
      for (var i of get_List) {
        
        //console.log(i)
        console.log(visited)
        
        var neigh = i;

        //FOR VISUALIZER
        if(edges.has(getQueueElement.value + "," + neigh.value)){
          //edges.get(getQueueElement.value + "," + neigh.value).color = [255,157,0]
          await edges.get(getQueueElement.value + "," + neigh.value).changeFill(255,157,0)
        }
        else {
          //edges.get(neigh.value + "," + getQueueElement.value).color = [255,157,0]
          await edges.get(neigh.value + "," + getQueueElement.value).changeFill(255,157,0)
        }
        //await sleep(200)

        if (!visited[neigh.value]) {
          visited[neigh.value] = true;
          
          //neigh.outlineColor = [255,157,0]
          await neigh.changeOutline(255,157,0)
          //await sleep(200)
          
          q.push(neigh);
        }
        //console.log(q.length)
      }

      console.log(q)
    }
    statusText = "Breadth-First Search: Click on starting node to start"

    enableButtonControls()
  }

  async dfs(startingNode) {

    disableButtonControls()

    // create a visited object
    var visited = {};
  
    // Create an object for queue
    var q = []
  
    // add the starting node to the queue
    visited[startingNode.value] = true;
    q.push(startingNode);
    await startingNode.changeFill(32,98,149)
    //startingNode.outlineColor = [255,157,0]
    await startingNode.changeOutline(255,157,0)

    //console.log(visited)
    //console.log(q)
    statusText = "Running: Depth-First Search(" + startingNode.value + ")"
  
    // loop until queue is element
    while (q.length != 0) {
      // get the element from the queue
      //console.log(q)
     
      var getQueueElement = q.pop();

      // passing the current vertex to callback funtion
      console.log(getQueueElement.value);
      await getQueueElement.changeFill(32,98,149)

      // get the adjacent list for current vertex
      var get_List = this.AdjList.get(getQueueElement);

      // loop through the list and add the element to the
      // queue if it is not processed yet
      for (var i of get_List) {
        
        //console.log(i)
        console.log(visited)
        
        var neigh = i;

        //FOR VISUALIZER
        if(edges.has(getQueueElement.value + "," + neigh.value)){
          //edges.get(getQueueElement.value + "," + neigh.value).color = [255,157,0]
          await edges.get(getQueueElement.value + "," + neigh.value).changeFill(255,157,0)
        }
        else {
          //edges.get(neigh.value + "," + getQueueElement.value).color = [255,157,0]
          await edges.get(neigh.value + "," + getQueueElement.value).changeFill(255,157,0)
        }
        //await sleep(200)

        if (!visited[neigh.value]) {
          visited[neigh.value] = true;
          
          //neigh.outlineColor = [255,157,0]
          await neigh.changeOutline(255,157,0)
          //await sleep(200)
          q.push(neigh);
        }
        //console.log(q.length)
      }

      console.log(q)
    }
    statusText = "Depth-First Search: Click on starting node to start"

    enableButtonControls()
  }

  async testString() {
    let curNode = null;
    let stringValue = document.getElementById("testString").value

    statusText = "Testing string: " + stringValue
    statusText2 = "In Progress"
    //epsilonCheck = true;
    for(let node of nodes){
      if(node.isInitial){
        curNode = node
        break
      }
    }

    if(curNode == null){
      return
    }

    if(await this.testStringHelper(stringValue, curNode, 0)){
      statusText2 = "STRING ACCEPTED"
      bgColor = [48, 116, 21]
    }
    else{
      statusText2 = "STRING REJECTED"
      bgColor = [102, 23, 23]
    }
  }

  async testStringHelper(string, curNode, index) {

    await curNode.changeFill(32,98,149)
    curNode.changeFill(28, 42, 53)

    if(curNode.isFinal && index == string.length){
      return true
    }

    for(let node of this.AdjList.get(curNode)){

      let curEdge = getEdge(curNode, node)
      
      if(await curEdge.value.has(string[index])){
        
        await curEdge.changeFill(255,157,0)
        curEdge.changeFill(255,255,255)

        if(await this.testStringHelper(string, node, index + 1) == true){
          return true
        }

      }

      if(curEdge.value.has("ε")){
        await curEdge.changeFill(255,157,0)
        curEdge.changeFill(255,255,255)

        if(await this.testStringHelper(string, node, index) == true){
          return true
        }
      }

    }
    bgColor = [102, 23, 23]
    return false
  }

  draw() {

  }
}


class GraphNode {
  constructor(x, y){
    this.value = ""
    this.x = x
    this.y = y
    this.size = 50
    this.outlineColor = [255,255,255]
    this.fillColor = [28,42,53]
    this.label = ""
    this.isInitial = false
    this.isFinal = false
    
  }
  draw(){
    fill(this.fillColor[0], this.fillColor[1], this.fillColor[2]);
    stroke(this.outlineColor[0], this.outlineColor[1], this.outlineColor[2])
    strokeWeight(1)


    // if(this.color[0] < 255){
    //   this.color[0] += 3
    // }
    // if(this.color[1] < 255){
    //   this.color[1] += 3
    // }
    // if(this.color[2] < 255){
    //   this.color[2] += 3
    // }


    ellipse(this.x, this.y, this.size, this.size)

    if(this.isFinal){
      ellipse(this.x, this.y, this.size - 10, this.size - 10)
    }
    fill(255,255,255);
    if(this.isInitial){
      triangle(this.x - 50, this.y + 25, this.x - 50, this.y - 25, this.x - 25, this.y)
    }

    if(this.value != ""){
      noStroke()
      fill(255, 255, 255);
      textSize(12)
      text(this.value, this.x, this.y)
    }

    if(this.label != ""){
      strokeWeight(4)
      stroke(28, 42, 53)
      fill(255, 255, 255);
      textSize(12)
      text(this.label, this.x, this.y - 35)
    }

  }
  clicked(){
    if(!editingMode){
      if(mouseX > this.x - this.size/2 && mouseX < this.x + this.size/2 && mouseY > this.y - this.size/2 && mouseY < this.y + this.size/2){
        console.log("clicked")
        return this
      }
    }
  }
  async changeFill(r, g, b) {
    // console.log("OLD X: " + this.x + ",Y: " + this.y)
    // console.log("X: " + newX + ",Y: " + newY)
    for(let i = 0; i <= (500 / animSpeed); i++){
      this.fillColor[0] = this.fillColor[0] + (r - this.fillColor[0]) * easing
      this.fillColor[1] = this.fillColor[1] + (g - this.fillColor[1]) * easing
      this.fillColor[2] = this.fillColor[2] + (b - this.fillColor[2]) * easing
      await sleep(2)
    }
    
    this.fillColor[0] = r
    this.fillColor[1] = g
    this.fillColor[2] = b
  }
  async changeOutline(r, g, b) {
    // console.log("OLD X: " + this.x + ",Y: " + this.y)
    // console.log("X: " + newX + ",Y: " + newY)
    for(let i = 0; i <= (500 / animSpeed); i++){
      this.outlineColor[0] = this.outlineColor[0] + (r - this.outlineColor[0]) * easing
      this.outlineColor[1] = this.outlineColor[1] + (g - this.outlineColor[1]) * easing
      this.outlineColor[2] = this.outlineColor[2] + (b - this.outlineColor[2]) * easing
      await sleep(2)
    }
    
    this.outlineColor[0] = r
    this.outlineColor[1] = g
    this.outlineColor[2] = b
  }
}

class Edge {
  constructor(start, end, edgeType){
    this.start = start
    this.end = end
    this.value = new Set()
    this.edgeType = edgeType
    this.color = [255,255,255]
  }
  draw(){
    var center = 25

    var midX = (this.start.x + this.end.x)/2
    var midY = (this.start.y + this.end.y)/2

    let curveDistance = 25
    let distance = sqrt(pow(this.start.y - this.end.y,2) + pow(this.end.x - this.start.x,2))
    distance = curveDistance/distance

    let edgeTransition = ""

    for (let val of this.value) {
      edgeTransition += val + ","
    }

    edgeTransition = edgeTransition.substring(0, edgeTransition.length - 1)

    
    //Control line shape
    strokeWeight(2)
    stroke(this.color[0], this.color[1], this.color[2])

    // if(this.color[0] < 255){
    //   this.color[0] += 3
    // }
    // if(this.color[1] < 255){
    //   this.color[1] += 3
    // }
    // if(this.color[2] < 255){
    //   this.color[2] += 3
    // }

    if(this.edgeType == "straight"){
      line(this.start.x, this.start.y, this.end.x, this.end.y)
    }
    else if(this.edgeType == "curve"){
      
      noFill()
      beginShape()
      curveVertex(this.start.x,this.start.y)
      curveVertex(this.start.x,this.start.y)
      curveVertex(midX + distance * (this.start.y-this.end.y), midY + distance * (this.end.x-this.start.x))
      curveVertex(this.end.x,this.end.y)
      curveVertex(this.end.x,this.end.y)
      endShape()
      
    }
    else if(this.edgeType == "loop"){

      let loopOffset = 20
      curveDistance = 60

      let distance = sqrt(pow(this.start.y - this.end.y,2) + pow((this.end.x - loopOffset) - (this.start.x + loopOffset),2))
      distance = curveDistance/distance

      noFill()
      beginShape()
      curveVertex(this.start.x + loopOffset,this.start.y)
      curveVertex(this.start.x + loopOffset,this.start.y)
      curveVertex(midX + distance * (this.start.y-this.end.y), midY + distance * ((this.end.x - loopOffset) - (this.start.x + loopOffset)))
      curveVertex(this.end.x - loopOffset,this.end.y)
      curveVertex(this.end.x - loopOffset,this.end.y)
      endShape()
    }

    fill(this.color[0], this.color[1], this.color[2])
    noStroke()
    
    //Control arrow point
    var offset = 8
    push() //start new drawing state
    var angle = atan2(this.start.y - this.end.y, this.start.x - this.end.x); //gets the angle of the line

    if(this.edgeType == "straight"){
      translate(midX, midY); //translates to the destination vertex
    }
    else if(this.edgeType == "curve"){
      translate(midX + distance * (this.start.y-this.end.y), midY + distance * (this.end.x-this.start.x))
    }
    else if(this.edgeType == "loop"){
      angle = -90
      translate(this.start.x + 14, this.start.y - 25)
    }

    rotate(angle-HALF_PI); //rotates the arrow point
    triangle(-offset*0.5, offset, offset*0.5, offset, 0, -offset/2); //draws the arrow point as a triangle
    pop();

    fill(this.color[0], this.color[1], this.color[2])
    stroke(bgColor[0], bgColor[1], bgColor[2])
    strokeWeight(4)

    textSize(12)

    //control transition labels
    
    if(this.edgeType == "straight"){
      text(edgeTransition, (this.start.x + this.end.x)/2, (this.start.y + this.end.y)/2 - 20)
    }
    else if(this.edgeType == "curve"){
      text(edgeTransition, midX + distance * (this.start.y-this.end.y), midY + distance * (this.end.x-this.start.x)- 20)
    }
    else if(this.edgeType == "loop"){
      text(edgeTransition, this.start.x, this.start.y - curveDistance - 10)
    }
    
  }

  clicked(){
    let clickArea = 15

    var midX = (this.start.x + this.end.x)/2
    var midY = (this.start.y + this.end.y)/2

    let curveDistance = 25
    let distance = sqrt(pow(this.start.y - this.end.y,2) + pow(this.end.x - this.start.x,2))
    distance = curveDistance/distance

    if(this.edgeType == "straight" && dist((this.start.x + this.end.x)/2, (this.start.y + this.end.y)/2, mouseX, mouseY) < clickArea){
      console.log("EDGE CLICK")
      return this
    }
    
    else if(this.edgeType == "curve" && dist(midX + distance * (this.start.y-this.end.y), midY + distance * (this.end.x-this.start.x), mouseX, mouseY) < clickArea){
      console.log("EDGE CLICK")
      return this
    }
    if(this.edgeType == "loop" && dist(this.start.x, this.start.y - 60, mouseX, mouseY) < clickArea){
      console.log("EDGE CLICK")
      return this
    }
  }

  async changeFill(r, g, b) {
    // console.log("OLD X: " + this.x + ",Y: " + this.y)
    // console.log("X: " + newX + ",Y: " + newY)
    for(let i = 0; i <= (1000 / animSpeed); i++){
      this.color[0] = this.color[0] + (r - this.color[0]) * easing
      this.color[1] = this.color[1] + (g - this.color[1]) * easing
      this.color[2] = this.color[2] + (b - this.color[2]) * easing
      await sleep(2)
    }
    
    this.color[0] = r
    this.color[1] = g
    this.color[2] = b
  }

}

// FUNCTIONS FOR CONTROL BUTTONS

function handleAddNode() {
  clickMode = "addNode"
  statusText = "Add Node"
  resetColors()
}

function handleRemoveNode() {
  clickMode = "removeNode"
  statusText = "Remove Node"
  resetColors()
}

function handleRemoveEdge() {
  clickMode = "removeEdge"
  statusText = "Remove Edge"
  resetColors()
}

function handleAddEdge() {
  clickMode = "addEdge"
  statusText = "Add Edge"
  resetColors()
}

function handleMouse() {
  clickMode = "none"
  statusText = "Move Node"
  resetColors()
}

function handleBFS() {
  clickMode = "bfs"
  statusText = "Breadth-First Search: Click on starting node to start"
  resetColors()
}

function handleDFS() {
  clickMode = "dfs"
  statusText = "Depth-First Search: Click on starting node to start"
  resetColors()
}

function handleSetInitialState() {
  clickMode = "setInitialState"
  statusText = "Set Initial State: Click a node"
  resetColors()
}

function handleSetFinalState() {
  clickMode = "setFinalState"
  statusText = "Set Final State: Click a node"
  resetColors()
}

function handleRemoveNodeState() {
  clickMode = "removeNodeState"
  statusText = "Remove Node State: Click a node"
  resetColors()
}

async function handleTestString() {
  await graph.testString()
}


//FUNCTION FOR ANIMATION SLIDER

var buttonControls = document.getElementsByClassName("controlButton");

function disableButtonControls() {
  for(button of buttonControls){
    button.disabled = true
  }
}

function enableButtonControls() {
  for(button of buttonControls){
    button.disabled = false
  }
  //statusText = "Standby"
}

document.getElementById("animSlider").innerHTML = document.getElementById("myRange").value
animSpeed = document.getElementById("myRange").value

function handleSliderAnimChange() {
  output = document.getElementById("myRange").value
  //document.getElementById("animSlider").innerHTML = output * 50
  document.getElementById("animSlider").innerHTML = output
  animSpeed = output
  //var output = 
  //output.innerHTML = slider.value; // Display the default slider value
}


//GENERAL FUNCTIONS

function moveInputField(x, y) {
  inp.position(x ,y)
  inpButton.position(x + 80,y)
}

function nodeValueSet() {
  console.log(inpValue)

  //WE CANNOT USE HAS BECAUSE WE NEED TO READ THE VALUE OF THE NODE
  for(node of nodes){
    if(node.value == inpValue){
      alert("Duplicate value")
      return
    }

  }

  editingMode = false;
  handleMouse()
  inpTarget.value = inpValue
  moveInputField(-500,-500)
}

function edgeValueSet() {
  console.log(inpValue)



  editingMode = false;
  handleMouse()

  if(inpValue == "" || inpValue == undefined){
    inpTarget.value.add("ε")
  }
  else {
    inpTarget.value.add(inpValue)
  }

  console.log(inpTarget.value)
  moveInputField(-500,-500)
}

function resetColors() {
  for (const [nodes, edge] of edges.entries()) {
    edge.color = [255,255,255]
  }

  for(node of nodes){
    node.fillColor = [28,42,53]
    node.outlineColor = [255,255,255]
    node.label = ""
  }

  statusText2 = ""
  statusText3 = ""
}

function getEdge(u,v) {
  return(edges.get(u.value + "," + v.value))
}

function addNodeManual(value, x, y){
  let newNode = new GraphNode(x, y)
  nodes.add(newNode)
  newNode.value = value
  graph.addVertex(newNode)
  return newNode
}

function addEdgeManual(weight, u, v){

  if(edges.has(u.value + "," + v.value)){
    edges.get(u.value + "," + v.value).value.add(weight)
  }
  else {

  let lineType = "straight"

  if(u == v){
    lineType = "loop"
  }

  var newEdge = new Edge(u, v, lineType)
  edges.set(u.value + "," + v.value, newEdge)
  graph.addEdge(u, v)

  newEdge.value.add(weight)
  }
}

function loadExample3() {
  graph.AdjList = new Map()
  nodes.clear()
  edges.clear()

  node1 = addNodeManual("1", 100, 300)
  node2 = addNodeManual("2", 300, 100)
  node3 = addNodeManual("3", 500, 100)
  node4 = addNodeManual("4", 700, 100)
  node5 = addNodeManual("5", 900, 300)
  node6 = addNodeManual("6", 700, 500)
  node7 = addNodeManual("7", 500, 500)
  node8 = addNodeManual("8", 300, 500)
  node9 = addNodeManual("9", 500, 300)

  node1.isInitial = true
  node5.isFinal = true

  addEdgeManual("4", node1, node2)
  addEdgeManual("8", node1, node8)
  addEdgeManual("8", node2, node3)
  addEdgeManual("7", node3, node4)
  addEdgeManual("9", node4, node5)
  addEdgeManual("10", node5, node6)
  addEdgeManual("14", node4, node6)
  addEdgeManual("4", node3, node6)
  addEdgeManual("2", node6, node7)
  addEdgeManual("6", node7, node9)
  addEdgeManual("1", node7, node8)
  addEdgeManual("7", node8, node9)
  addEdgeManual("11", node2, node8)
  addEdgeManual("2", node3, node9)

}

function loadExample2() {
  graph.AdjList = new Map()
  nodes.clear()
  edges.clear()

  node1 = addNodeManual("1", 100, 300)
  node2 = addNodeManual("2", 300, 300)
  node3 = addNodeManual("3", 500, 300)
  node4 = addNodeManual("4", 700, 300)
  node5 = addNodeManual("5", 900, 300)

  node1.isInitial = true
  node5.isFinal = true
  node1.isFinal = true

  addEdgeManual("ε", node1, node2)
  addEdgeManual("x", node2, node3)
  addEdgeManual("ε", node3, node4)
  addEdgeManual("y", node4, node5)
  addEdgeManual("x", node3, node3)
  addEdgeManual("y", node3, node3)



}

function loadExample() {
  graph.AdjList = new Map()
  nodes.clear()
  edges.clear()

  node1 = addNodeManual("1", 100, 300)
  node2 = addNodeManual("2", 300, 100)
  node3 = addNodeManual("3", 500, 100)
  node4 = addNodeManual("4", 700, 300)
  node5 = addNodeManual("5", 500, 500)
  node6 = addNodeManual("6", 300, 500)

  node1.isInitial = true
  node4.isFinal = true
  node1.isFinal = true

  addEdgeManual("ε", node1, node2)
  addEdgeManual("ε", node1, node6)
  addEdgeManual("ε", node4, node1)
  addEdgeManual("b", node2, node2)
  addEdgeManual("a", node2, node3)
  addEdgeManual("c", node3, node4)
  addEdgeManual("c", node6, node6)
  addEdgeManual("a", node6, node5)
  addEdgeManual("b", node5, node4)



}




let nodes = new Set()
let edges = new Map()


let selectedNode
let startx = 0, starty = 0, endx = 0, endy = 0
let startnode = undefined, endnode = undefined

var startNode
var graph = new Graph()

var bgColor = [28, 42, 53]

var statusText = "Standby"
var statusText2 = ""
var statusText3 = ""

function setup() {
  //createCanvas(400, 400);
  let cnv = createCanvas(windowWidth, windowHeight - controlsHeight);
  cnv.parent("sketchHolder");
  console.log(cnv)

  inp = createInput("")
  inp.parent("sketchHolder")
  inp.size(70)
  inp.position(-500,-500)
  inp.input(function myInputEvent() {
    inpValue = this.value()
  })

  inpButton = createButton("Set")
  inpButton.parent("sketchHolder")
  inpButton.position(-500,-500)
  inpButton.mousePressed(nodeValueSet);

  rectMode(CENTER)
  textAlign(CENTER, CENTER)

  pixelDensity(1)
}

function draw() {
  background(bgColor[0], bgColor[1], bgColor[2]);
  if(Math.floor(bgColor[0]) != 28 && Math.floor(bgColor[1]) != 42 && Math.floor(bgColor[2]) != 53){
    bgColor[0] = bgColor[0] + (28 - bgColor[0]) * 0.05
    bgColor[1] = bgColor[1] + (42 - bgColor[1]) * 0.05
    bgColor[2] = bgColor[2] + (53 - bgColor[2]) * 0.05
  }
  else {
    bgColor[0] = 28
    bgColor[1] = 42
    bgColor[2] = 53
  }
  

  fill(WHITE)
  noStroke()
  textAlign(LEFT, TOP)
  text(statusText, 10, 10)
  text(statusText2, 10, 30)

  rectMode(CENTER)
  textAlign(CENTER, CENTER)

  for (const [nodes, edge] of edges.entries()) {
    edge.draw()
  }

  for(node of nodes){
    node.draw()
  }

  //tempLine
  strokeWeight(1)
  stroke(255)
  line(startx, starty, endx, endy)
}

function mousePressed() {
  if(mouseButton == LEFT && mouseY > 0){
    if(clickMode == "addNode" && editingMode == false){
      inpButton.mousePressed(nodeValueSet);
      moveInputField(mouseX,mouseY)
      var newNode = new GraphNode(mouseX, mouseY)
      nodes.add(newNode)
      editingMode = true
      graph.addVertex(newNode)
      inpTarget = newNode
    }

    else if(clickMode == "addEdge" && editingMode == false){
      inpButton.mousePressed(edgeValueSet);
      startx = mouseX
      starty = mouseY
      endx = mouseX
      endy = mouseY
      for(let node of nodes){
        startnode = node.clicked()
        if(startnode != undefined){
          break
        }
      }
    }
    else if(clickMode == "removeNode" && editingMode == false){
      let removeNode
      for (node of nodes) {
        removeNode = node.clicked()
        if(removeNode != undefined){

          for (const [nodes, edge] of edges.entries()) {
            if(edge.end == removeNode || edge.start == removeNode){
              edges.delete(edge.start.value + "," + edge.end.value)
              edges.delete(edge.end.value + "," + edge.start.value)
            }
          }
          graph.removeNode(removeNode)

          nodes.delete(removeNode)

          

          break
        }
      }
    }

    else if(clickMode == "removeEdge" && editingMode == false){
      let removeEdge
      for (const [nodes, edge] of edges.entries()) {
        removeEdge = edge.clicked()
        if(removeEdge != undefined){
          graph.removeEdge(edge.start, edge.end)

          edges.delete(edge.start.value + "," + edge.end.value)
          console.log("YES")
          break
        }
      }
    }

    else if(clickMode == "bfs" && editingMode == false){
      for(node of nodes){
        selectedNode = node.clicked()
        if(selectedNode != undefined){
          console.log("HERE")
          statustext = "BFS: Running"
          graph.bfs(selectedNode)
          break
        }
      }
    }

    else if(clickMode == "dfs" && editingMode == false){
      for(node of nodes){
        selectedNode = node.clicked()
        if(selectedNode != undefined){
          console.log("HERE")
          statustext = "DFS: Running"
          graph.dfs(selectedNode)
          break
        }
      }
    }

    else if(clickMode == "setInitialState"){
      for(let node of nodes){
        selectedNode = node.clicked()
        if(selectedNode != undefined){

          for(let node of nodes){
            node.isInitial = false
          }

          selectedNode.isInitial = true
          break
        }
      }
    }
    else if(clickMode == "setFinalState"){
      for(let node of nodes){
        selectedNode = node.clicked()
        if(selectedNode != undefined){
          selectedNode.isFinal = true
          break
        }
      }
    }
    else if(clickMode == "removeNodeState"){
      for(let node of nodes){
        selectedNode = node.clicked()
        if(selectedNode != undefined){
          selectedNode.isFinal = false
          selectedNode.isInitial = false
          break
        }
      }
    }

    else if(clickMode == "none" && editingMode == false){
      for(node of nodes){
        selectedNode = node.clicked()
        if(selectedNode != undefined){
          selectedNode.x = mouseX
          selectedNode.y = mouseY
          break
        }
      }
    }
  }
  else if(mouseButton == RIGHT && editingMode == false){
    console.log(graph.AdjList)
    console.log(edges)
  }
}

function mouseDragged(){
  if(mouseButton == LEFT && mouseY > 0 && editingMode == false){
    if(clickMode == "addEdge"){
      endx = mouseX
      endy = mouseY
    }
    else if (clickMode == "none" && editingMode == false){
      if(selectedNode != undefined){
        selectedNode.x = mouseX
        selectedNode.y = mouseY
      }
      
    }
  }
}

function mouseReleased(){
  //console.log(startnode)
  startx = 0, starty = 0, endx = 0, endy = 0

  if(mouseButton == LEFT && mouseY > 0){
    if(selectedNode != undefined){
      selectedNode.color = [255, 255, 255];
    }

    if(clickMode == "addEdge" && editingMode == false){

      for(let node of nodes){
        endnode = node.clicked()
        if(endnode != undefined){
          break
        }
      }
      if(startnode != undefined && endnode != undefined){
        if(edges.has(startnode.value + "," + endnode.value)){
          let curEdge = getEdge(startnode, endnode)
          let curEdgeType = curEdge.edgeType
          inpTarget = curEdge

          console.log("TRIGGER")

          //GET EDGE WEIGHT
          var midX = (startnode.x + endnode.x)/2
          var midY = (startnode.y + endnode.y)/2

          var curveDistance = 25
          var distance = sqrt(pow(startnode.y - endnode.y,2) + pow(endnode.x - startnode.x,2))
          distance = curveDistance/distance

          //MOVE POSITION
          if(curEdgeType == "straight"){
            moveInputField((startnode.x + endnode.x)/2, (startnode.y + endnode.y)/2 - 20)
          }
          else if(curEdgeType == "curve"){
            moveInputField(midX + distance * (startnode.y-endnode.y), midY + distance * (endnode.x-startnode.x)- 20)
          }
          else if(curEdgeType == "loop"){
            moveInputField(startnode.x, startnode.y - curveDistance - 10)
          }

          editingMode = true

        }
        else {

          let lineType = "straight"

          if(startnode == endnode){
            lineType = "loop"
          }

          if(graph.AdjList.get(endnode).has(startnode)){
            console.log("CURVED")
            edges.get(endnode.value + "," + startnode.value).edgeType = "curve"
            // console.log(startnode.value + "," + endnode.value)
            // console.log(edges.get(endnode.value + "," + startnode.value))
            lineType = "curve"
          }

          //GET EDGE WEIGHT
          var midX = (startnode.x + endnode.x)/2
          var midY = (startnode.y + endnode.y)/2

          var curveDistance = 25
          var distance = sqrt(pow(startnode.y - endnode.y,2) + pow(endnode.x - startnode.x,2))
          distance = curveDistance/distance

          //MOVE POSITION
          if(lineType == "straight"){
            moveInputField((startnode.x + endnode.x)/2, (startnode.y + endnode.y)/2 - 20)
          }
          else if(lineType == "curve"){
            moveInputField(midX + distance * (startnode.y-endnode.y), midY + distance * (endnode.x-startnode.x)- 20)
          }
          else if(lineType == "loop"){
            moveInputField(startnode.x, startnode.y - curveDistance - 10)
          }

          editingMode = true
          
          var newEdge = new Edge(startnode, endnode, lineType)
          inpTarget = newEdge
          edges.set(startnode.value + "," + endnode.value, newEdge)
          graph.addEdge(startnode, endnode)
        }
      }
      
    }
  }
}

function windowResized() {
  controlsHeight = document.getElementById("controlMain").offsetHeight 
  resizeCanvas(windowWidth, windowHeight - controlsHeight)
}




