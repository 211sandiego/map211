/**
 * Created by jcasseda on 7/15/14.
 */
var geocoder;
var map;
var incident1;
var incident2;

function initialize() {
    geocoder = new google.maps.Geocoder();
    var sandiegocounty = new google.maps.LatLng(32.83, -117.18 );
    var mapOptions = {
        zoom: 11,
        center: sandiegocounty
    }

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    incident1 = new google.maps.KmlLayer({
        url: 'http://map211.herokuapp.com/ggeoxml/incident1.kml', preserveViewport: true
    });
    incident1.setMap(map);


    incident2 = new google.maps.KmlLayer({
        url: 'http://map211.herokuapp.com/ggeoxml/incident2.kml', preserveViewport: true
    });
    incident2.setMap(map);
}

var incident1shown = "true";
var incident2shown = "true";

function toggleIncident1() {
    if ( incident1shown == "true" ) {
        incident1.setMap(null);
        incident1shown = "false";
    }
    else {
        incident1.setMap(map);
        incident1shown = "true";
    }
}

function toggleIncident2() {
    if ( incident2shown == "true" ) {
        incident2.setMap(null);
        incident2shown = "false";
    }
    else {
        incident2.setMap(map);
        incident2shown = "true";
    }
}

function codeAddress() {
    var address = document.getElementById('address').value;
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

google.maps.event.addDomListener(window, 'load', initialize);

function startCall() {
    $('.right-rail').slideDown();
    $('.start-new').replaceWith('<button class="btn btn-primary btn-lg pull-right close-call" onclick="endCall()">End Call</button>');
}

function endCall() {
    $('.right-rail').slideUp();
    $('.close-call').replaceWith('<button class="btn btn-primary btn-lg pull-right start-new" onclick="startCall()">Start New Call</button>');
}

$(document).ready(function() {
  $('.right-rail').hide();
});
