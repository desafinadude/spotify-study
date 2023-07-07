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

	.marker {
		padding: 5px;
		border-radius: 5px;
	}

	.marker_title {
		color: #fff;
		font-weight: bold;
	}

	.marker_play, .marker_delete {
		display: inline-block;
		width: 36px;
	}

	.marker_playing {
		background-color: #1A1A1A;
	}

	.marker_layout {  display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		gap: 0px 0px;
		grid-auto-flow: row;
		grid-template-areas:
		  "marker_name marker_name marker_name marker_name buttons buttons"
		  "start_time start_time start_time end_time end_time end_time";
	  }
	  
	  .marker_name {
		align-self: center; 
		grid-area: marker_name; 
	  }
	  .buttons {
		justify-self: end; 
		align-self: center; 
		grid-area: buttons; 
		width: 80px; 
	  }
	  
	  .start_time { grid-area: start_time; }
	  
	  .end_time { grid-area: end_time; }

	  .icon {
		cursor: pointer;
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

		const playIcon = '<svg class="icon play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36"><path fill="#fff" d="M10,16.5V7.5L16,12M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>';
		const pauseIcon = '<svg class="icon pause-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36"><path fill="#fff" d="M15,16H13V8H15M11,16H9V8H11M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>';
		const deleteIcon = '<svg class="icon delete-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36"><path fill="#fff" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M17,7H14.5L13.5,6H10.5L9.5,7H7V9H17V7M9,18H15A1,1 0 0,0 16,17V10H8V17A1,1 0 0,0 9,18Z" /></svg>';
		

		/* add Celerity to the page */
		var celerity = document.createElement('div');
		celerity.id = 'celerity';
		celerity.classList.add('celerity');
		celerity.innerHTML = '<header>Spotify Study</header>';

		/* add speed indicator */
		var currentSpd = document.createElement('div');
		currentSpd.id = 'current_speed';
		currentSpd.classList.add('current_speed');
		currentSpd.innerHTML = lastSpeed + 'x';

		/* add markers list */
		var markersList = document.createElement('ul');
		markersList.id = 'markers_list';
		markersList.classList.add('markers_list');

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

			markersList.innerHTML = '';
			for(var i = 0; i < currentMarkers.length; i++){
				var marker = currentMarkers[i];
				var markerElement = document.createElement('li');
				markerElement.classList.add('marker');
				markerElement.innerHTML = '<div class="marker_layout"><div class="marker_name"><div class="marker_title">' + marker.name + '</div></div><div class="buttons"><div class="marker_play">' + playIcon + '</div><div class="marker_delete">' + deleteIcon + '</div></div><div class="start_time"><div class="marker_start">' + calculateTime(parseInt(marker.start)) + '</div></div><div class="end_time"><div class="marker_end">' + calculateTime(parseInt(marker.end)) + '</div></div></div>';
				markerElement.setAttribute('data-start', marker.start);
				markerElement.setAttribute('data-end', marker.end);
				markerElement.setAttribute('data-id', marker.id);
				markersList.appendChild(markerElement);
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
					var parent = this.parentNode.parentNode.parentNode;

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
					var parent = this.parentNode.parentNode.parentNode;
					var id = parent.getAttribute('data-id');
					deleteMarker(id);
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
					document.querySelector('#celerity').appendChild(currentSpd);
					document.querySelector('#celerity').appendChild(markersList);
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