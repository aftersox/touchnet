<!DOCTYPE html>
<meta charset="utf-8">
<html>
	<head>
		<title>TouchNet: social network data collection</title>
		<script src="./js/d3.v3.min.js"></script>
		<script src="./js/jquery-2.0.2.min.js"></script>
		<script src="./js/bootstrap.min.js"></script>
		<!-- icon font: http://mfglabs.github.com/mfglabs-iconset/ -->
		<link rel="stylesheet" href="./css/bootstrap.min.css" />
		<link rel="stylesheet" href="./css/font-awesome.min.css" />
		<link rel="stylesheet" href="./css/touchnet.css" />
		<link href='http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,300italic,700' rel='stylesheet' type='text/css'>
	</head>
	<body>
		<div id='container'>
			<div id = 'netspace'>
				<div id = 'toolBox' class = 'btn-toolbar'>
					<div class = 'btn-group' data-toggle="buttons-radio">
						<button class = "btn toolIcon addNode" class-toggle = "btn-info" href="#">
							<i class="icon-circle icon-large"></i></button>
						<button class = "btn toolIcon removeElement" class-toggle = "btn-info" href="#">
							<i class="icon-trash icon-large"></i></button>
						<button class = "btn toolIcon editText" class-toggle = "btn-info" href="#">
							<i class="icon-font icon-large"></i></button>
						<button class = "btn toolIcon addLink" class-toggle = "btn-info" href="#">
							<i class="icon-resize-small icon-large"></i></button>
					</div>
				</div>
				<div id = 'nodeDataEntry' class = 'input-append'>
					<form id = 'nodeDataForm' class = 'form-inline'>
						<input class = 'span2' type = 'text' placeholder = 'Name' id = 't_nodename'/>
						<button class = 'btn iconSubmit' id = 'nodeDataFormSubmit' type = 'button'><i class="icon-ok icon-large"></i></button>
						<button class = 'btn iconCancel' id = 'nodeDataFormCancel' type = 'button'><i class="icon-remove icon-large"></i></button>
						<input type="hidden" name = "nodeid" id = "h_nodeid" />
					</form>
				</div>
			</div>
		</div>
			<!-- load the main script -->
			<script src="./js/touchnet.02.js"></script>				
	</body>
</html>
