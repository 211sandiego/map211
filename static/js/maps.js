/**
 * Created by jcasseda on 7/15/14.
 */
var geocoder;
var map;
var incident1;
var incident2;

function initialize() {
    geocoder = new google.maps.Geocoder();
    var sandiegocounty = new google.maps.LatLng(32.93, -116.77 );
    var mapOptions = {
        zoom: 10,
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

function toggleIncidentOff() {
    incident1.setMap(null);
}

function toggleIncidentOn() {
    incident1.setMap(map);
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
