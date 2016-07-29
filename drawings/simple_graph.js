/**
  @author David Piegza

  Implements a simple graph drawing with force-directed placement in 2D and 3D.

  It uses the force-directed-layout implemented in:
  https://github.com/davidpiegza/Graph-Visualization/blob/master/layouts/force-directed-layout.js

  Drawing is done with Three.js: http://github.com/mrdoob/three.js

  To use this drawing, include the graph-min.js file and create a SimpleGraph object:

  <!DOCTYPE html>
  <html>
    <head>
      <title>Graph Visualization</title>
      <script type="text/javascript" src="path/to/graph-min.js"></script>
    </head>
    <body onload="new Drawing.SimpleGraph({layout: '3d', showStats: true, showInfo: true})">
    </bod>
  </html>

  Parameters:
  options = {
    layout: "2d" or "3d"

    showStats: <bool>, displays FPS box
    showInfo: <bool>, displays some info on the graph and layout
              The info box is created as <div id="graph-info">, it must be
              styled and positioned with CSS.


    selection: <bool>, enables selection of nodes on mouse over (it displays some info
               when the showInfo flag is set)


    limit: <int>, maximum number of nodes

    numNodes: <int> - sets the number of nodes to create.
    numEdges: <int> - sets the maximum number of edges for a node. A node will have
              1 to numEdges edges, this is set randomly.
  }


  Feel free to contribute a new drawing!

 */

var Drawing = Drawing || {};

Drawing.SimpleGraph = function(options) {
  var options = options || {};

  this.layout = options.layout || "2d";
  this.layout_options = options.graphLayout || {};
  this.show_stats = options.showStats || false;
  this.show_info = options.showInfo || false;
  this.show_labels = options.showLabels || false;
  this.selection = options.selection || false;
  this.limit = options.limit || 10;
  this.nodes_count = options.numNodes || 20;
  this.edges_count = options.numEdges || 10;

  var camera, controls, scene, renderer, interaction, geometry, object_selection;
  var stats;
  var info_text = {};
  var graph = new Graph({limit: options.limit});

  var geometries = [];

  var that=this;

  init();
  createGraph();
  animate();

  function init() {
    // Three.js initialization
    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize( window.innerWidth, window.innerHeight );

    camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 1, 1000000);
    camera.position.z = 5000;

    controls = new THREE.TrackballControls(camera);

    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 5.2;
    controls.panSpeed = 1;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [ 65, 83, 68 ];

    controls.addEventListener('change', render);

    scene = new THREE.Scene();

    // Node geometry
    if(that.layout === "3d") {
      geometry = new THREE.CubeGeometry( 25, 25, 25 );
    } else {
      geometry = new THREE.CubeGeometry( 50, 50, 0 );
    }

    // Create node selection, if set
    if(that.selection) {
      object_selection = new THREE.ObjectSelection({
        domElement: renderer.domElement,
        selected: function(obj) {
          // display info
          if(obj != null) {
            info_text.select = "Object " + obj.id;
          } else {
            delete info_text.select;
          }
        },
        clicked: function(obj) {
        }
      });
    }

    document.body.appendChild( renderer.domElement );

    // Stats.js
    if(that.show_stats) {
      stats = new Stats();
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.top = '0px';
      document.body.appendChild( stats.domElement );
    }

    // Create info box
    if(that.show_info) {
      var info = document.createElement("div");
      var id_attr = document.createAttribute("id");
      id_attr.nodeValue = "graph-info";
      info.setAttributeNode(id_attr);
      document.body.appendChild( info );
    }
  }

  function addTCNode(id, name) {
	var node = new Node(id);
	graph.addNode(node);
	drawNode(node);
	node.data.title = name;
  }
  function addTCEdge(id1, id2) {
	graph.addEdge(graph.getNode(id1), graph.getNode(id2));
	drawEdge(graph.getNode(id1), graph.getNode(id2));
  }

  /**
   *  Creates a graph with random nodes and edges.
   *  Number of nodes and edges can be set with
   *  numNodes and numEdges.
   */
  function createGraph() {
	  
	addTCNode(0, "Aer");
	addTCNode(1, "Alienis");
	addTCNode(2, "Aqua");
	addTCNode(3, "Arbor");
	addTCNode(4, "Auram");
	addTCNode(5, "Bestia");
	addTCNode(6, "Cognito");
	addTCNode(7, "Corpus");
	addTCNode(8, "Exanimis");
	addTCNode(9, "Fabrico");
	addTCNode(10, "Fames");
	addTCNode(11, "Gelum");
	addTCNode(12, "Herba");
	addTCNode(13, "Humanus");
	addTCNode(14, "Ignis");
	addTCNode(15, "Instrumentum ");
	addTCNode(16, "Iter");
	addTCNode(17, "Limus");
	addTCNode(18, "Lucrum");
	addTCNode(19, "Lux");
	addTCNode(20, "Machina");
	addTCNode(21, "Messis");
	addTCNode(22, "Metallum");
	addTCNode(23, "Meto");
	addTCNode(24, "Mortuus");
	addTCNode(25, "Motus");
	addTCNode(26, "Ordo");
	addTCNode(27, "Pannus");
	addTCNode(28, "Perditio");
	addTCNode(29, "Perfodio");
	addTCNode(30, "Permutatio");
	addTCNode(31, "Potentia");
	addTCNode(32, "Praecantatio");
	addTCNode(33, "Sano");
	addTCNode(34, "Sensus");
	addTCNode(35, "Spiritus");
	addTCNode(36, "Telum");
	addTCNode(37, "Tempestas");
	addTCNode(38, "Tenebrae");
	addTCNode(39, "Terra");
	addTCNode(40, "Tutamen");
	addTCNode(41, "Vacuos");
	addTCNode(42, "Venenum");
	addTCNode(43, "Victus");
	addTCNode(44, "Vinculum");
	addTCNode(45, "Vitium");
	addTCNode(46, "Vitreus");
	addTCNode(47, "Volatus");
	
	addTCEdge(38, 1);	addTCEdge(41, 1);
	
	addTCEdge(0, 3);	addTCEdge(12, 3);
	addTCEdge(0, 4);	addTCEdge(32, 4);
	addTCEdge(25, 5);	addTCEdge(43, 5);
	addTCEdge(14, 6);	addTCEdge(35, 6);
	addTCEdge(5, 7);	addTCEdge(24, 7);
	addTCEdge(25, 8);	addTCEdge(24, 8);
	addTCEdge(13, 9);	addTCEdge(15, 9);
	addTCEdge(41, 10);	addTCEdge(43, 10);
	addTCEdge(14, 11);	addTCEdge(28, 11);
	addTCEdge(39, 12);	addTCEdge(43, 12);
	addTCEdge(5, 13);	
		
	addTCEdge(13, 15);	addTCEdge(26, 15);
	addTCEdge(25, 16);	addTCEdge(39, 16);
	addTCEdge(2, 17);	addTCEdge(43, 17);
	addTCEdge(10, 18);	addTCEdge(13, 18);
	addTCEdge(0, 19);	addTCEdge(14, 19);
	addTCEdge(15, 20);	addTCEdge(25, 20);
	addTCEdge(12, 21);	addTCEdge(13, 21);
	addTCEdge(39, 22);	addTCEdge(46, 22);
	addTCEdge(15, 23);	addTCEdge(21, 23);
	addTCEdge(28, 24);	addTCEdge(43, 24);
	addTCEdge(0, 25);	addTCEdge(26, 25);
		
	addTCEdge(5, 27);	addTCEdge(15, 27);
		
	addTCEdge(13, 29);	addTCEdge(39, 29);
	addTCEdge(26, 30);	addTCEdge(28, 30);
	addTCEdge(14, 31);	addTCEdge(26, 31);
	addTCEdge(31, 32);	addTCEdge(41, 32);
	addTCEdge(26, 33);	addTCEdge(43, 33);
	addTCEdge(0, 34);	addTCEdge(35, 34);
	addTCEdge(24, 35);	addTCEdge(43, 35);
	addTCEdge(14, 36);	addTCEdge(15, 36);
	addTCEdge(0, 37);	addTCEdge(2, 37);
	addTCEdge(19, 38);	addTCEdge(41, 38);
		
	addTCEdge(15, 40);	addTCEdge(39, 40);
	addTCEdge(0, 41);	addTCEdge(28, 41);
	addTCEdge(2, 42);	addTCEdge(28, 42);
	addTCEdge(2, 43);	addTCEdge(39, 43);
	addTCEdge(25, 44);	addTCEdge(28, 44);
	addTCEdge(28, 45);	addTCEdge(32, 45);
	addTCEdge(26, 46);	addTCEdge(39, 46);
	addTCEdge(0, 47);	addTCEdge(25, 47);




    /* var node = new Node(0);
    node.data.title = "This is node " + node.id;
    graph.addNode(node);
    drawNode(node);

    var nodes = [];
    nodes.push(node);

    var steps = 1;
    while(nodes.length != 0 && steps < that.nodes_count) {
      var node = nodes.shift();

      var numEdges = randomFromTo(1, that.edges_count);
      for(var i=1; i <= numEdges; i++) {
        var target_node = new Node(i*steps);
        if(graph.addNode(target_node)) {
          target_node.data.title = "This is node " + target_node.id;

          drawNode(target_node);
          nodes.push(target_node);
          if(graph.addEdge(node, target_node)) {
            drawEdge(node, target_node);
          }
        }
      }
      steps++;
    } */

    that.layout_options.width = that.layout_options.width || 2000;
    that.layout_options.height = that.layout_options.height || 2000;
    that.layout_options.iterations = that.layout_options.iterations || 100000;
    that.layout_options.layout = that.layout_options.layout || that.layout;
    that.layout_options.attraction = that.layout_options.attraction || 1.0;
    that.layout_options.repulsion = that.layout_options.repulsion || 2.0;
    graph.layout = new Layout.ForceDirected(graph, that.layout_options);
    graph.layout.init();
    info_text.nodes = "Nodes " + graph.nodes.length;
    info_text.edges = "Edges " + graph.edges.length;
  }


  /**
   *  Create a node object and add it to the scene.
   */
  function drawNode(node) {
    var draw_object = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {  color: Math.random() * 0xffffff, opacity: 0.5 } ) );

    if(that.show_labels) {
      if(node.data.title != undefined) {
        var label_object = new THREE.Label(node.data.title);
      } else {
        var label_object = new THREE.Label(node.id);
      }
      node.data.label_object = label_object;
      scene.add( node.data.label_object );
    }

    var area = 5000;
    draw_object.position.x = Math.floor(Math.random() * (area + area + 1) - area);
    draw_object.position.y = Math.floor(Math.random() * (area + area + 1) - area);

    if(that.layout === "3d") {
      draw_object.position.z = Math.floor(Math.random() * (area + area + 1) - area);
    }

    draw_object.id = node.id;
    node.data.draw_object = draw_object;
    node.position = draw_object.position;
    scene.add( node.data.draw_object );
  }


  /**
   *  Create an edge object (line) and add it to the scene.
   */
  function drawEdge(source, target) {
      material = new THREE.LineBasicMaterial({ color: 0xff0000, opacity: 1, linewidth: 0.5 });

      var tmp_geo = new THREE.Geometry();
      tmp_geo.vertices.push(source.data.draw_object.position);
      tmp_geo.vertices.push(target.data.draw_object.position);

      line = new THREE.Line( tmp_geo, material, THREE.LinePieces );
      line.scale.x = line.scale.y = line.scale.z = 1;
      line.originalScale = 1;

      geometries.push(tmp_geo);

      scene.add( line );
  }


  function animate() {
    requestAnimationFrame( animate );
    controls.update();
    render();
    if(that.show_info) {
      printInfo();
    }
  }


  function render() {
    // Generate layout if not finished
    if(!graph.layout.finished) {
      info_text.calc = "<span style='color: red'>Calculating layout...</span>";
      graph.layout.generate();
    } else {
      info_text.calc = "";
    }

    // Update position of lines (edges)
    for(var i=0; i<geometries.length; i++) {
      geometries[i].verticesNeedUpdate = true;
    }


    // Show labels if set
    // It creates the labels when this options is set during visualization
    if(that.show_labels) {
      var length = graph.nodes.length;
      for(var i=0; i<length; i++) {
        var node = graph.nodes[i];
        if(node.data.label_object != undefined) {
          node.data.label_object.position.x = node.data.draw_object.position.x;
          node.data.label_object.position.y = node.data.draw_object.position.y - 100;
          node.data.label_object.position.z = node.data.draw_object.position.z;
          node.data.label_object.lookAt(camera.position);
        } else {
          if(node.data.title != undefined) {
            var label_object = new THREE.Label(node.data.title, node.data.draw_object);
          } else {
            var label_object = new THREE.Label(node.id, node.data.draw_object);
          }
          node.data.label_object = label_object;
          scene.add( node.data.label_object );
        }
      }
    } else {
      var length = graph.nodes.length;
      for(var i=0; i<length; i++) {
        var node = graph.nodes[i];
        if(node.data.label_object != undefined) {
          scene.remove( node.data.label_object );
          node.data.label_object = undefined;
        }
      }
    }

    // render selection
    if(that.selection) {
      object_selection.render(scene, camera);
    }

    // update stats
    if(that.show_stats) {
      stats.update();
    }

    // render scene
    renderer.render( scene, camera );
  }

  /**
   *  Prints info from the attribute info_text.
   */
  function printInfo(text) {
    var str = '';
    for(var index in info_text) {
      if(str != '' && info_text[index] != '') {
        str += " - ";
      }
      str += info_text[index];
    }
    document.getElementById("graph-info").innerHTML = str;
  }

  // Generate random number
  function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }

  // Stop layout calculation
  this.stop_calculating = function() {
    graph.layout.stop_calculating();
  }
}
