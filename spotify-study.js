/* ======== Start of style string literal ======== */
var style = `
	.current_speed {
		color: #fff;
		font-size: 2em;
	}
	#main > div > div:nth-child(2) {
		grid-template-columns: auto 3fr 1fr;
	}
	#main > div > div:nth-child(2) > div:nth-child(4) {
		grid-area: main-view/main-view/main-view/main-view;
	}
	.celerity {
		grid-area: right-sidebar;
		background-color: var(--background-base);
    	border-radius: 8px;
    	cursor: default;
		padding: 8px 16px;
	}
	.celerity header {
		font-weight: bold;
	}

	.markers_list {
		list-style: none;
	}

	.marker {
		padding: 5px;
		border-radius: 5px;
	}

	.marker_title {
		color: #fff;
		font-weight: bold;
	}

	

	.inc, .dec {
		background: #666;
		color: #000;
		font-weight: bold;
		text-align: center;
		border: 1px solid #666;
		cursor: pointer;
	}

	.dec {
		border-radius: 5px 0 0 5px;
	}

	.inc {
		border-radius: 0 5px 5px 0;
	}

	.inc:hover, .dec:hover {
		background: #1FDF64;
		border: 1px solid #1FDF64;
	}

	.marker_playing {
		background-color: #1A1A1A;
	}

	.controls {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr;
		gap: 0px 0px;
		grid-auto-flow: row;
		grid-template-areas: "speed add_marker";
		margin-bottom: 10px;
	}

	.speed {
		grid-area: speed;
		align-self: center;
	}

	.add_marker {
		grid-area: add_marker;
		align-self: center;
		justify-self: end;
		cursor: pointer;
	}

	.marker_layout {  display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		gap: 5px 5px;
		grid-auto-flow: row;
		grid-template-areas:
		  "marker_play marker_name marker_name marker_name marker_name marker_delete"
		  "start_time start_time start_time end_time end_time end_time";
	  }
	  
	.marker_name {
		align-self: center; 
		grid-area: marker_name; 
	}

	.marker_play {
		align-self: center;
		grid-area: marker_play;
	}

	.marker_delete {
		align-self: center;
		grid-area: marker_delete;
		justify-self: end; 
	}

	
	  
	.start_time { 
		grid-area: start_time; 
	}
	
	.end_time { 
		grid-area: end_time; 
	}

	.icon {
		cursor: pointer;
	}

	.icon:hover path {
		fill: #1FDF64;
	}

	.marker_time_container {  
		display: grid;
		grid-template-columns: 1fr 2fr 1fr;
		grid-template-rows: 1fr;
		gap: 0px 0px;
		grid-auto-flow: row;
		grid-template-areas: "dec time inc";
	}

	.dec { 
		grid-area: dec;
		align-self: center;  
	}

	.time { 
		grid-area: time; 
		align-self: center; 
		text-align: center;
		border: 1px solid #666;
	}

	.inc { 
		grid-area: inc;
		align-self: center;  
	}

	  

`;


/* ======== Start of code string literal ======== */
var code = `
	var base = document.createElement; /* A backup reference to the browser's original document.createElement */
	var spotifyElements = []; /* Array of video/audio elements made by spotify's scripts */
	
	/* Replacing the DOM's original reference to the browser's createElement function */
	document.createElement = function(message) {
		/* base.apply is calling the backup reference of createElement with the arguments sent to our function and assigning it to our variable named element */
		var element = base.apply(this, arguments); 
		
		/* we check the first argument sent to us Examp. document.createElement('video') would have message = 'video' */
		/* ignores the many document.createElement('div'), document.createElement('nav'), ect... */
		if(message == 'video' || message == 'audio'){ /* Checking if spotify scripts are making a video or audio element */
			spotifyElements.push(element);
			

		}
		return element /* return the element and complete the loop so the page is allowed to be made */
	};
	
	
	window.onload = function() {
		
		const speeds = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
		var celerityData = JSON.parse(localStorage.getItem('celerity'));
		var lastSpeed = celerityData ? celerityData.lastSpeed : 1.0;
		var currentSection = null;
		var currentSectionStart = null;
		var currentSectionEnd = null;
		
		const addMarkerIcon = '<svg class="add_marker" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30"><title>plus</title><path fill="#eee" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>';

		const playIcon = '<svg class="icon play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><title>play</title><path fill="#eee" d="M8,5.14V19.14L19,12.14L8,5.14Z" /></svg>';
		
		const pauseIcon = '<svg class="icon pause-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><title>pause</title><path fill="#eee" d="M14,19H18V5H14M6,19H10V5H6V19Z" /></svg>';

		const deleteIcon = '<svg class="icon delete-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><title>delete</title><path fill="#eee" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>';

		/* add Celerity to the page */
		var celerity = document.createElement('div');
		celerity.id = 'celerity';
		celerity.classList.add('celerity');
		celerity.innerHTML = '\
			<header>Spotify Study</header> \
			<div class="controls"> \
				<div id="current_speed" class="current_speed">' + lastSpeed + 'x</div> \
				<div class="add_marker">' + addMarkerIcon + '</div> \
			</div> \
			<div id="markers_list" class="markers_list"></div>\
		';


		function calculateTime(seconds) {
			var minutes = Math.floor(seconds / 60);
			var seconds = Math.floor(seconds % 60);
			if(seconds < 10) {
				seconds = '0' + seconds;
			}
			return minutes + ':' + seconds;
		}
		
		function validateAndChangePosition(value){
			if(!isNaN(input2.value)){ 
				changePosition(input2.value);
			}
		}

		
		function validateAndChangeSpeed(value){ 
			var val = parseFloat( value );
			if(!isNaN(val)){
				changeSpeed(val);
			}
		}
		
		function changeSpeed(val) {
			for(var i = 0; i < spotifyElements.length; i++){ 
				spotifyElements[i].playbackRate = val; 
				if(val != lastSpeed){ 
					lastSpeed = val;
					currentSpd.innerHTML = val + 'x';
					setStoredSpeed(val);
				}
			}
		}

		function changePosition(val) {
			for(var i = 0; i < spotifyElements.length; i++){ 
				spotifyElements[i].currentTime = val; 
			}
		}

		
		function songPlaying() {
			const checkCurrentTime = setInterval(function() {
				if(currentSection) {
					for(var i = 0; i < spotifyElements.length; i++){
						if (spotifyElements[i].currentTime >= currentSectionEnd) {
							spotifyElements[i].currentTime = currentSectionStart;
						}
					}
				}
			}, 500); 
		}

		// MARKERS

		function listMarkers() {
			// list markers from localstorage
			var markers = celerityData.markers;

			// Get only the markers for the current src
			var currentMarkers = [];
			for(var i = 0; i < markers.length; i++){
				var marker = markers[i];
				if(marker.track == document.querySelector('[data-testid="now-playing-widget"]').getAttribute('aria-label').replace('Now playing: ', '')) {
					currentMarkers.push(marker);
				}
			}

			document.querySelector('.markers_list').innerHTML = '';
			for(var i = 0; i < currentMarkers.length; i++){
				var marker = currentMarkers[i];
				var markerElement = document.createElement('li');
				markerElement.classList.add('marker');
				markerElement.innerHTML = ' \
				<div class="marker_layout"> \
					<div class="marker_play">' + playIcon + '</div> \
					<div class="marker_name"><div class="marker_title">' + marker.name + '</div></div> \
					<div class="marker_delete">' + deleteIcon + '</div> \
					<div class="marker_time_container start_time"> \
						<div class="dec">-</div> \
						<div class="time"><div class="marker_start">' + calculateTime(parseInt(marker.start)) + '</div></div> \
						<div class="inc">+</div> \
					</div> \
					<div class="marker_time_container end_time"> \
						<div class="dec">-</div> \
						<div class="time"><div class="marker_end">' + calculateTime(parseInt(marker.end)) + '</div></div> \
						<div class="inc">+</div> \
					</div>';
				markerElement.setAttribute('data-start', marker.start);
				markerElement.setAttribute('data-end', marker.end);
				markerElement.setAttribute('data-id', marker.id);
				document.querySelector('.markers_list').appendChild(markerElement);
			}

			addMarkerEventListeners();
		}

		function randomIdGenerator() {
			return Math.random().toString(36).substr(2, 9);
		}


		function addMarkerEventListeners() {
			// add event listeners to markers
			document.querySelectorAll('.marker_play').forEach(function(el) {
				el.addEventListener('click', function(e) {

					document.querySelectorAll('.marker').forEach(function(el){
						el.classList.remove('marker_playing');
					});
					
					// parent of this
					var parent = this.parentNode.parentNode;

					if(currentSection != parent.getAttribute('data-id')) {
						for(var i = 0; i < spotifyElements.length; i++){
							spotifyElements[i].play();
						}
						parent.classList.add('marker_playing');
						var start = parent.getAttribute('data-start');
						var end = parent.getAttribute('data-end');
						var id = parent.getAttribute('data-id');
						el.innerHTML = pauseIcon;
						currentSection = id;
						currentSectionStart = start;
						currentSectionEnd = end;
						changePosition(start);

					} else {
						this.classList.remove('marker_playing');
						el.innerHTML = playIcon;
						for(var i = 0; i < spotifyElements.length; i++){
							spotifyElements[i].pause();
							currentSection = null;
							currentSectionStart = null;
							currentSectionEnd = null;
						}
					}
				})
			})

			document.querySelectorAll('.marker_delete').forEach(function(el) {
				el.addEventListener('click', function(e) {
					var parent = this.parentNode.parentNode;
					var id = parent.getAttribute('data-id');
					deleteMarker(id);
				})
			})

			document.querySelectorAll('.dec').forEach(function(el) {

				el.addEventListener('click', function(e) {

					var parent = this.parentNode.parentNode.parentNode;

					var id = parent.getAttribute('data-id');

					var markers = celerityData.markers;

					if(this.parentNode.classList.contains('start_time')) {
						var start = parseInt(parent.getAttribute('data-start'));
						var newStart = start - 1;
						if(newStart < 0) {
							newStart = 0;
						}
						var markers = celerityData.markers;
						for(var i = 0; i < markers.length; i++){
							var marker = markers[i];
							if(marker.id == id) {
								marker.start = newStart;
							}
							if(currentSection == id) {
								currentSectionStart = newStart;
								changePosition(newStart);
							}
						}

					} else {
						var end = parseInt(parent.getAttribute('data-end'));
						var newEnd = end - 1;
						if(newEnd < 0) {
							newEnd = 0;
						}
						var markers = celerityData.markers;
						for(var i = 0; i < markers.length; i++){
							var marker = markers[i];
							if(marker.id == id) {
								marker.end = newEnd;
							}
							if(currentSection == id) {
								currentSectionEnd = newEnd;
								changePosition(newEnd - 1);
							}
						}
						
					}
					celerityData.markers = markers;
					localStorage.setItem('celerity', JSON.stringify(celerityData));
					listMarkers();
					

				})
			})

			document.querySelectorAll('.inc').forEach(function(el) {
				el.addEventListener('click', function(e) {
					var parent = this.parentNode.parentNode.parentNode;

					var id = parent.getAttribute('data-id');

					var markers = celerityData.markers;

					if(this.parentNode.classList.contains('start_time')) {
						var start = parseInt(parent.getAttribute('data-start'));
						var newStart = start + 1;
						
						var markers = celerityData.markers;
						for(var i = 0; i < markers.length; i++){
							var marker = markers[i];
							if(marker.id == id) {
								marker.start = newStart;
							}
							if(currentSection == id) {
								currentSectionStart = newStart;
								changePosition(newStart);
							}
						}
						celerityData.markers = markers;
						localStorage.setItem('celerity', JSON.stringify(celerityData));


					} else {
						var end = parseInt(parent.getAttribute('data-end'));
						var newEnd = end + 1;
						
						var markers = celerityData.markers;
						for(var i = 0; i < markers.length; i++){
							var marker = markers[i];
							if(marker.id == id) {
								marker.end = newEnd;
							}
							if(currentSection == id) {
								currentSectionEnd = newEnd;
								changePosition(newEnd - 1);
							}
						}
						celerityData.markers = markers;
						localStorage.setItem('celerity', JSON.stringify(celerityData));
					}
					listMarkers();
				})
			})

		}

		function addMarker() {
			// add a marker to localstorage
			var marker = {
				'track': document.querySelector('[data-testid="now-playing-widget"]').getAttribute('aria-label').replace('Now playing: ', ''),
				'duration': spotifyElements[0].duration,
				'id': randomIdGenerator(),
				'name': 'Marker',
				'start': spotifyElements[0].currentTime,
				'end': spotifyElements[0].currentTime + 5,
			};
			if(celerityData){
				celerityData.markers.push(marker);
			} else {
				celerityData = {
					'markers': [marker],
					'lastSpeed': 1.0,
				};
			}
			localStorage.setItem('celerity', JSON.stringify(celerityData));
			listMarkers();
			
		}

		function deleteMarker(id) {
			// delete a marker from localstorage
			var markers = celerityData.markers;
			for(var i = 0; i < markers.length; i++){
				var marker = markers[i];
				if(marker.id == id){
					markers.splice(i, 1);
				}
			}
			celerityData.markers = markers;
			localStorage.setItem('celerity', JSON.stringify(celerityData));
			currentSection = null;
			currentSectionStart = null;
			currentSectionEnd = null;
			listMarkers();
		}

		function adjustMarker(id, startend, direction) {
			// adjust a marker from localstorage
			var markers = celerityData.markers;
			for(var i = 0; i < markers.length; i++){
				var marker = markers[i];
				if(marker.id == id){

					if(startend == 'start'){
						if(direction == 'up'){
							marker.start = marker.start + 1;
						} else {
							marker.start = marker.start - 1;
						}
						currentSectionStart = marker.start;
					} else {
						if(direction == 'up'){
							marker.end = marker.end + 1;
						} else {
							marker.end = marker.end - 1;
						}
						currentSectionEnd = marker.end;
					}


				
				}
			}
			celerityData.markers = markers;
			localStorage.setItem('celerity', JSON.stringify(celerityData));
			listMarkers();
		}

		function updateMarkerName() {
			
			// update a marker name from localstorage
			var markers = celerityData.markers;
			for(var i = 0; i < markers.length; i++){
				var marker = markers[i];
				if(marker.id == currentSection){
					marker.name = document.querySelector('.marker_playing .marker_title').innerHTML;
				}
			}
			celerityData.markers = markers;
			localStorage.setItem('celerity', JSON.stringify(celerityData));
			listMarkers();
		}



		document.addEventListener('keydown', function(event) {
			switch (event.key) {
			case '-':
				var speedPosition = speeds.indexOf(lastSpeed);
				if(speedPosition > 0){
					validateAndChangeSpeed(speeds[speedPosition - 1]);
				}
				break;
			case '+':
				var speedPosition = speeds.indexOf(lastSpeed);
				if(speedPosition < speeds.length - 1){
					validateAndChangeSpeed(speeds[speedPosition + 1]);
				}
				break;
			case '*':
				validateAndChangeSpeed(1.0);
				break;
			case '0':
				addMarker();
				break;
			case 'Delete':
				deleteMarker(currentSection);
				break;
			case 'ArrowLeft':
				adjustMarker(currentSection, 'start', 'down');
				break;
			case 'ArrowRight':
				adjustMarker(currentSection, 'start', 'up');
				break;
			case 'ArrowUp':
				adjustMarker(currentSection, 'end', 'up');
				break;
			case 'ArrowDown':
				adjustMarker(currentSection, 'end', 'down');
				break;
			}
		});

		

		
		function timeout() { /* This function is called by itself over and over */
			if(document.getElementById('celerity') == null) 
			{
				try {
					document.querySelector('#main > div > div:nth-child(2)').appendChild(celerity);
					document.querySelector('.add_marker').addEventListener('click', addMarker);
					listMarkers();
					if(spotifyElements.length > 0){ 
						spotifyElements[0].addEventListener('playing', songPlaying(spotifyElements[0]));
					}
				} catch {
					setTimeout(timeout, 100);
				}
			}
			setTimeout(function () { 
				try {
					validateAndChangeSpeed(lastSpeed); 
					songPlaying();
				} catch {
					
				}
				timeout(); 
			}, 500); 
		}
		
		timeout(); 
	};`; 
/* ======== End of code string literal ======== */
var script = document.createElement('script');
script.textContent = code; 
document.body.appendChild(script); 
var styles = document.createElement('style'); 
styles.textContent = style; 
document.head.appendChild(styles);
(document.head||document.documentElement).appendChild(script); 
(document.head||document.documentElement).appendChild(styles); 
script.remove(); 