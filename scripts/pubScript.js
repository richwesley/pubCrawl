// JavaScript Document

var infowindowContent, pub_id, service, pubid = [];


// Initialize the map to html div
function initMap() {
	var  mapstyle = new google.maps.StyledMapType (
		[
	  {
		"featureType": "road",
		"stylers": [{"color": "#96e6ed"}]
	  },
	  {
		"featureType": "water",
		"stylers": [{"color": "#febf00"}]
	  }
	  ],
	  {name: 'Beer Map'}
	);

	// set the inital map.  See css for styling
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37, lng: -98 },
        zoom: 3,
		mapTypeControlOptions: {
            mapTypeIds: ['brewStyle']
		}
    });

	map.mapTypes.set('brewStyle', mapstyle);
        map.setMapTypeId('brewStyle');


    // get the users selection from html input
	input = document.getElementById('chooseCrawlSpace');

	//use the autocomplete function which displays predictions as user types
    var autocomplete = new google.maps.places.Autocomplete( input, { placeIdOnly: true } );
		autocomplete.bindTo('bounds', map);


    var infowindow = new google.maps.InfoWindow();
    	infowindow.setContent(infowindowContent);


	//the geocoder section translates the user input to a map geolocation
    var geocoder = new google.maps.Geocoder();

	//if the user changes location make the changes
    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        var place = autocomplete.getPlace();

        if (!place.place_id) {
            return;
        }

		//check to make sure the user chooses a legit place and not Hogwarts
		geocoder.geocode({ 'placeId': place.place_id }, function(results, status) {

			if (status !== 'OK') {
				window.alert('Geocoder failed due to: ' + status);
				return;
            	}

			//set the new map
			map.setZoom(14);
			map.setCenter(results[0].geometry.location);


			service = new google.maps.places.PlacesService(map);

			// nerbySearch "locates" places within the users location choice
			//find pubs in users location choice within 500 (meters?)
			service.nearbySearch({
		  	location: results[0].geometry.location,
		  	radius: 500,
		  	name: 'pub'
		}, callback);

		// getDetails allows you to get more detailed info on the pubs

//		service.getDetails({
//			placeId: '6292d7c1931f4e53a29d3b4230048a2a30cc1111'
//		}, placeid);
			



		console.log(pubid);
		});	//placeid geocode
	});//"place-changed function
}//initMap


//Iterate through all the pubs and send to createMarker
function callback(results, status) {
     if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
               createMarker(results[i]);
		       placeid(results[i]);

			//	console.log(results[0].photos[0].getUrl({maxWidth: 400, maxHeight: 400}));
		}
    }
    console.log(pubid);
}

function placeid (place) {
	pub_id = place.id;
	pubid.push(place.id);

}

//console.log(place.id);
//create the markers for each pub
function createMarker(place) {
   var pubs = new google.maps.InfoWindow();
   var marker = place.location;
   var image = 'assets/beer.png';

   marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
		icon: image,
		animation: google.maps.Animation.DROP,
        title: place.name
    });

	 //if user put mouse on a marker, reval the pub name
	 google.maps.event.addListener(marker, 'mouseover', function() {
        pubs.setContent(place.id);
    });

	//send pub detail to cards when user clicks on a marker
	google.maps.event.addListener(marker, 'click', function() {
      service.getDetails({
        placeId: place.place_id
      }, function (placeDetail) {
        console.log(placeDetail);
        $('#pubCard').append(placeDetail.name + '<br>' + placeDetail.website + '<br>' + "Rating " + place.rating);
      });
		
	var requestURL = "https://maps.googleapis.com/maps/api/place/details/json?placeid="+place.id+"&key=AIzaSyCAiIYvxdCUPxPkkRqIMnGDQ1XligzDwo0";	
	 
			// jQuery cross domain ajax
		$.get(requestURL).done(function (data) {
			console.log(data);
		});

		// using XMLHttpRequest
		var xhr = new XMLHttpRequest();
		xhr.open("GET", requestURL, true);
		xhr.onload = function () {
			console.log(xhr.responseText);
		};
		xhr.send();
		
//		$(document).ready(function () {
//			
//        $.getJSON(requestURL, function (data) {
//
//            for (i = 0; i < data.results.length; i++) {
//                myAddress[i] = data.results[i].formatted_address;
//                document.getElementById("message").innerHTML += myAddress[i] + "<br>";
//                console.log(myAddress[i]);
//            }
//        });
//    });  
  });

}// createMarker

