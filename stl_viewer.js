$(document).ready(function() {

	var mycanvas = document.getElementById('upload_canvas');
	var viewer = new JSC3D.Viewer(mycanvas)
	var theScene = new JSC3D.Scene;
	
	//Initialize viewer and load a specified .STL file
	var stlpath = "pump.stl"
	viewer.setParameter('SceneUrl', stlpath);
    viewer.setParameter('InitRotationX', 20);
	viewer.setParameter('InitRotationY', 20);
	viewer.setParameter('InitRotationZ', 0);
	viewer.setParameter('ModelColor', '#CCCCCC');
	viewer.setParameter('BackgroundColor1', '#99B5CC');
	viewer.setParameter('BackgroundColor2', '#00467F');
	viewer.setParameter('RenderMode', 'flat');
	//Detect mobile device and adjust Definition accordingly (also try if (navigator.userAgent.match(/Mobi/)))
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		viewer.setParameter('Definition', 'Standard');
	}
	else {
		viewer.setParameter('Definition', 'High');
	}
	viewer.init();
	viewer.update();
	
	var canvas_drop = document.getElementById('canvas-drop')
		canvas_drop.addEventListener('dragover', handleDragOver, false);
		canvas_drop.addEventListener('drop', handleFileSelect, false);

	var lowQualButton = document.getElementById('low_quality')
		lowQualButton.addEventListener('click', setDefinition('low'), false);

	var standardQualButton = document.getElementById('standard_quality')
    	standardQualButton.addEventListener('click', setDefinition('standard'), false);

    var highQualButton = document.getElementById('high_quality')
    	highQualButton.addEventListener('click', setDefinition('high'), false);

	//Drag and drop logic:
	function handleFileSelect(evt) {
	    evt.stopPropagation();
	    evt.preventDefault();
	    var files = evt.dataTransfer.files;
	    console.log(evt)
	    console.log(files)
	    preview_stl(files[0])
	  }

	  function handleDragOver(evt) {
	    evt.stopPropagation();
	    evt.preventDefault();
	    evt.dataTransfer.dropEffect = 'copy';
	  }

	//jsc3d logic
	var handle_file_select = function(e) {
		e.stopPropagation()
		e.preventDefault()
		var f = e.target.files[0]
		preview_stl(f)
	}

	function preview_stl(f) {
		var reader = new FileReader()
		var ext = f.name.split(".")[1]

		reader.onload = (function(file) {
			return function(e) {
				theScene = new JSC3D.Scene
		    	stl_loader = new JSC3D.StlLoader()
		    	stl_loader.parseStl(theScene, e.target.result)
		      	//Instead of viewer.init()
		      	viewer.replaceScene(theScene)
		      	viewer.update()
		      	console.log("file reader on load")
			}
		})(f)

		if (ext.toLowerCase() != "stl") {
			alert("That file does not appear to be an STL file.");
		} else {
			reader.readAsBinaryString(f)
		}
	}

	//Update renderer definition after button clicks
	function setDefinition(definition) {
		console.log("Clicked button");
		console.log(viewer.theScene);
		viewer.setDefinition(definition);
		viewer.update();
		/*
    	if(viewer.getScene()) {
    		viewer.setDefinition(definition);
    		viewer.update();
    	}*/
    }
})