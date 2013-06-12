// Set the default tool
var hh = $(window).height(),
	ww = $(window).width(),
	tool = "none", // currently selected tool
	d_R = 20, //dot radius
	ndnew = {}, // new node data object
	nd = [], // the node data
	lk = [], // the link data
	lcurso = {x:0,y:0,active:false,nm:-1}, // used for creating links (link cursor origin)
	idselect = -1; // the origin of the line cursor
	
/*///////// The data
var nd = [{id: 0, nm: 'p1', xpos: 150, ypos: 150, rr: 20},
	{id: 1, nm: 'p2', xpos: 200, ypos: 200, rr: 30}];
var lk = [{id: 1, id1: 1, id2: 2, xp1: 0, xp2: 10, yp1: 0, yp2: 10}];
*/
	
// Bind events and what not
$(document).ready( function() {
	
		// clicking on a tool button
		$(".toolIcon").bind('click', function() {
				var el = this;
				tool = "none";
				if ( !$(el).hasClass("active") ) {
					//$(".toolIcon").removeClass("toolSelected");
					//$(el).addClass("toolSelected");
					setTool(el);
				} else {
					//$(el).removeClass("toolSelected");
					//$('.toolIcon.active').removeClass('active')
					tool = "none";
				}
		});
	
		// submit the form
		$("#nodeDataFormSubmit").click( function() {
			$("#nodeDataForm").submit();
			closeNodeDataForm();
		});
		
		// cancel the data entry
		$("#nodeDataFormCancel").click( function() {
			closeNodeDataForm();
		});
		
		// what to do when we submit data (names, etc)
		$("#nodeDataForm").submit( function() {
			if(tool === "addNode") {
				ndnew.nm = $("#t_nodename").val();
				addNode(ndnew);
			} else if (tool === "editText") {
				editText(idselect);
				closeNodeDataForm();
				return false;
			}
			closeNodeDataForm();
			return false;
		});

		// hit escape to exit the form
		$("#nodeDataForm").keyup(function(e) {
		  if (e.keyCode == 27) {
			  closeNodeDataForm();
		  }
		});
		
		$('body').keyup(function(e) {
			if (e.keyCode == 27 && lcurso.active == true) {
				lcurso.active = false;
				lcurs.style('display','none');
			}
		});
		
		// so that buttons can be toggled off
		$('body').on('click', '.btn.active', function(e){
			e.stopImmediatePropagation();
			$(this).removeClass('active');
		})
	
	});
	
// Close the node data form
function closeNodeDataForm() {
	$("#t_nodename").val("");
	$("#nodeDataEntry").css("display","none");
}

// Open the node data form in a specified location
function openNodeDataForm(x,y) {
	d3.select("#nodeDataEntry")
		.style("display","block")
		.style("top",y+"px")
		.style("left",x+"px");
	$("#t_nodename").focus();
}


// build the svg workspace
// when a user clicks on the svg space, call a tool action

var svg = d3.select('#netspace').append('svg:svg')
	.attr('height',hh)
	.attr('width',ww)
	.on('touchstart',toolact)
	.on('click',toolact)
	.on('mousemove',linemove);
	
// Add the line cursor

var lcurs = svg.append('line')
	.attr('x1',0)
	.attr('y1',0)
	.attr('x2',0)
	.attr('y2',0)
	.style('stroke','#F00')
	.style('display','none');

// When the user selects a tool, set the global tool variable

function setTool(el) {
	if($(el).hasClass("addNode"))
		tool = "addNode";
	if($(el).hasClass("removeElement"))
		tool = "removeElement";
	if($(el).hasClass("editText"))
		tool = "editText";
	if($(el).hasClass("addLink"))
		tool = "addLink";
}
	
// Tool actions

function toolact() {
	var ts = d3.mouse(this);
	var coord = {top:ts[1],left:ts[0]};
	if ( tool === "addNode" ) {
		createNode(coord);
	}
}

// Moving the line about
function linemove() {
	var ts = d3.mouse(this);
	lcurs.attr('x1',lcurso.x)
		.attr('y1',lcurso.y)
		.attr('x2',ts[0])
		.attr('y2',ts[1]);
}

// Create a node
function createNode(coord) {
	openNodeDataForm(coord.left, coord.top);
	
	ndnew = {id: getMaxNodeID() + 1,
		nm: "",
		xpos: coord.left,
		ypos: coord.top,
		rr: d_R};
}



function addNode(ndnew) {
	//test if something exists with that name already
	console.log(ndnew);
	if (getNameIndex(ndnew.nm) === false) {
		nd.push(ndnew);
		update();
	} else {
		console.log('node name already exists');
	}
}

function editText(id) {
	var nnm = $("#t_nodename").val();
	if( getNameIndex(nnm) === false) {
		console.log('edit text');
		nd[getNodeIndex(id)].nm = nnm;
		update();
	} else {
		console.log('node name already exists');
	}
}

// Turn on dragging. While dragging update the position data.
var drag = d3.behavior.drag()
	.on('drag',dragmove);

function dragmove(d) {
	d3.select(this)
		.attr('transform', 'translate('+ (d.xpos = d3.event.x) + ',' + (d.ypos = d3.event.y) + ')');
	lcurso.x = d.xpos;
	lcurso.y = d.ypos;
	
	// update the links data
	for(i = 0; i < lk.length; i++) {
		if(lk[i].id1 == d.id) {
			lk[i].xp1 = d.xpos;
			lk[i].yp1 = d.ypos;
		}
		if(lk[i].id2 == d.id) {
			lk[i].xp2 = d.xpos;
			lk[i].yp2 = d.ypos;
		}
	}
	
	update();
}


// ID and Indexing
function getMaxNodeID() {
	var max = 0;
	for(var i = 0; i < nd.length; i++) {
		if (nd[i].id > max)
			max = nd[i].id;
	}
	return max;
}
function getNodeIndex(idf) {
	for(var i = 0; i < nd.length; i++) {
		if (nd[i].id === idf)
			return i;
	}
	return false;
}
function getNameIndex(nmf) {
	for(var i = 0; i < nd.length; i++) {
		if (nd[i].nm === nmf)
			return i;
	}
	return false;
}
function getMaxEdgeID() {
	var max = 0;
	for(var i = 0; i < lk.length; i++) {
		if (lk[i].id > max)
			max = lk[i].id;
	}
	return max;
}
function getEdgeIndex(idf) {
	for(var i = 0; i < lk.length; i++) {
		if (lk[i].id === idf)
			return i;
	}
	return false;
}

// this function will display a warning message
// tt - text to display
// dl - the delay
function showWarning(tt,dl) {
	
}

		
function update() {

	//console.log('updating...');
	////////////// The nodes ///////////////////
	var ns = svg.selectAll('g.ns')
		.data(nd, function(d) { return d.id; });
	var nsEnter = ns.enter().insert('g')
		.attr('class','ns')
		.attr('transform', function(d) { return('translate('+ d.xpos + ',' + d.ypos + ')');})
		.call(drag);
	
	ns.on('click',function(d) {
		// remove the node
		if(tool === "removeElement") {
			// remove the node
			var ix = getNodeIndex(d.id);
			nd.splice(ix,1);
			// remove edges attached to the node
			lk1 = [];
			for(var i = 0; i < lk.length; i++) {
				if(lk[i].id1 != d.id && lk[i].id2 != d.id) {
					lk1.push(lk[i]);
				}
			}
			lk = lk1;
			update();
		} else if (tool === "editText") {
			$("#t_nodename").val(d.nm);
			idselect = d.id;
			$("#nodeDataEntry").css("display","block");
			$("#nodeDataEntry").css("top",d.ypos + "px");
			$("#nodeDataEntry").css("left",d.xpos + "px");
		} else if (tool === "addLink") {
			if(lcurso.active == false) {
				// starting a new link
				lcurso.active = true;
				lcurso.x = d.xpos;
				lcurso.y = d.ypos;
				lcurso.id = d.id;
				lcurs.style('display','block');
			} else if (lcurso.id === d.id) {
				// they clicked the origin node, cancelling the link
				lcurso.active = false;
				lcurso.id = -1;
				lcurs.style('display','none');
			} else if (lcurso.active === true && lcurso.id !== d.id) {
				// active and they clicked a different node, add a new link
				lk.push({id: getMaxEdgeID() + 1,
					id1: lcurso.id,
					id2: d.id,
					xp1: lcurso.x,
					yp1: lcurso.y,
					xp2: d.xpos,
					yp2: d.ypos
					});
				lcurso.active = false;
				lcurso.id = -1;
				lcurs.style('display','none');
				update();
			}
		}
	});
	
	nsEnter.append('circle')
		.attr('class','circ')
		.attr('r',function(d) { return (d.rr); });
	
	nsEnter.append('text')
		.attr('class','ndnm')
		.attr('text-anchor','middle')
		.text(function(d) { return(d.nm); });
	
	ns.exit().remove();
	
	// make sure to update the text
	svg.selectAll('g.ns .ndnm').data(nd)
		.text(function(d) { return d.nm; });
	
	////////////// The edges ///////////////////
	
	var links = svg.selectAll('line.link')
		.data(lk, function(d) { return d.id; });
	var lkEnter = links.enter().insert('line','g.ns')
		.attr('class','link')
		.attr('x1', function(d) { return d.xp1; })
		.attr('x2', function(d) { return d.xp2; })
		.attr('y1', function(d) { return d.yp1; })
		.attr('y2', function(d) { return d.yp2; });
	links.on('click',function(d) {
		// remove the link
		if(tool === "removeElement") {
			// remove the edge
			var ix = getEdgeIndex(d.id);
			lk.splice(ix,1);
			update();
		}
	});
	links.exit().remove();
	
	// update the positio of the edges
	svg.selectAll(".link")
		.attr('x1',function(d) { return(d.xp1);})
		.attr('x2',function(d) { return(d.xp2);})
		.attr('y1',function(d) { return(d.yp1);})
		.attr('y2',function(d) { return(d.yp2);});
	
}
update();
