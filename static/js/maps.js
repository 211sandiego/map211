/**
 * Created by jcasseda on 7/15/14.
 */
var geocoder;
var map;
var placeSearch, autocomplete, autocomplete2;
var markers = [];

function initialize () {

    // STANDARD MAP SETUP
    geocoder = new google.maps.Geocoder();
    var sandiegocounty = new google.maps.LatLng(32.93, -116.98);
    var mapOptions = {
        zoom : 10,
        center : sandiegocounty
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);


    // Get content for the left nav
    remoteContent.getContent().then(function (data) {
        incidents.setIncidents(data.incidents);
        mapLayers.setLayers(data.KML);
        incidents.renderList();
        mapLayers.renderList();
    });


    //  ADDRESS AUTOCOMPLETE

    // Create the autocomplete object, restricting the search
    // to geographical location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {HTMLInputElement} */(document.getElementById('address_autocomplete')),
        { types : ['geocode'] });
    autocomplete2 = new google.maps.places.Autocomplete(
        /** @type {HTMLInputElement} */(document.getElementById('address_autocomplete2')),
        { types : ['geocode'] });
    // When the user selects an address from the dropdown,
    // populate the address fields in the form.
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        addAddress();
    });
    google.maps.event.addListener(autocomplete2, 'place_changed', function () {
        addAddress();
    });
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = new google.maps.LatLng(
                position.coords.latitude, position.coords.longitude);
            autocomplete.setBounds(new google.maps.LatLngBounds(geolocation,
                geolocation));
        });
    }
}
function geolocate2 () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = new google.maps.LatLng(
                position.coords.latitude, position.coords.longitude);
            autocomplete2.setBounds(new google.maps.LatLngBounds(geolocation,
                geolocation));
        });
    }
}

var fullAddress;

function addAddress () {
    var place = autocomplete.getPlace();
    var fullAddress = place.formatted_address;
    $('#fullAddressDisplay').html(fullAddress);
    $('#address_autocomplete2').val(fullAddress);
}


// SEND CODE TO PLACE MARKER ON MAP

function codeAddress () {
    var place = autocomplete.getPlace();
    var address = place.formatted_address;

    geocoder.geocode({ 'address' : address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            map.setZoom(13);
            var marker = new google.maps.Marker({
                map : map,
                position : results[0].geometry.location
            });
            markers.push(marker);
        }
        else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}
function codeAddress2 () {
    var place = autocomplete2.getPlace();
    var address = place.formatted_address;
    $('#fullAddressDisplay').html(address);


    deleteMarkers();

    geocoder.geocode({ 'address' : address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            map.setZoom(13);
            var marker = new google.maps.Marker({
                map : map,
                position : results[0].geometry.location
            });
            markers.push(marker);
        }
        else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

// Sets the map on all markers in the array.
function setAllMap (map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers () {
    setAllMap(null);
}
// Deletes all markers in the array by removing references to them.
function deleteMarkers () {
    clearMarkers();
    markers = [];
}

google.maps.event.addDomListener(window, 'load', initialize);

// END OF PLACE MARKER CODE


// RIGHT RAIL CODE

function startCall () {
    $('.right-rail').slideDown();
    $('.main').removeClass().addClass('col-sm-6 col-sm-offset-3 col-md-8 col-md-offset-2 main');
    $('.start-new').replaceWith('<button class="btn btn-primary btn-lg pull-right close-call" onclick="endCall()">End Call</button>');
}

function saveInitial () {
    codeAddress();
    $('#initialForm').slideUp();
    $('.profile').slideDown();
}

function editSection (elem) {
    $(elem).parents('.profile-section').find('.input-container').find('p').fadeOut().parent().find('input, select').fadeIn();
    $(elem).replaceWith('<div class="saveGroup"><button class="btn btn-primary saveBtn" onclick="javascript:saveSection(this);">Save</button><button class="btn btn-default cancelBtn"  onclick="javascript:saveSection(this);">Cancel</button></div>');
}

function saveSection (elem) {
    if ($(elem).parents('.profile-section').hasClass('contact')) {
        codeAddress2();
    }
    ;

    $(elem).parents('.profile-section').find('.input-container').find('input, select').fadeOut().parent().find('p').fadeIn();
    $(elem).parents('.saveGroup').replaceWith('<button class="btn btn-link" onclick="javascript:editSection(this);">Edit</button>');
}

function endCall () {
    $('.right-rail').slideUp();
    $('.main').removeClass().addClass('col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main');
    $('.close-call').replaceWith('<button class="btn btn-primary btn-lg pull-right start-new" onclick="startCall()">Start New Call</button>');
    $('.profile').hide();
    $('#initialForm').show();
    saveCallData();
}

function saveCallData() {

    // Database service
    $.post("http://call-log-211-data-service.appspot.com/api/v1.0/calllog/", {
            "name": model.Name,
            "callReason": model.reason,
            "location": model.location,
            "phone": model.phone
        },
        function(data,status){
            if (status != "success") {
                alert("Data: " + data + "\nStatus: " + status);
            }
        });
}

// END OF RIGHT RAIL CODE


// KNOCKOUT CODE FOR FIELDS

function AppViewModel () {
    this.Name = ko.observable('');
    this.reason = ko.observable('');
    this.phone = ko.observable('');
    this.location = ko.observable('');
//    this.city = ko.observable('');
//    this.state = ko.observable('');
//    this.ZIP = ko.observable('');

}

var model = new AppViewModel();
ko.applyBindings(model);

// END OF KNOCKOUT CODE


// INITIAL LOAD SCRIPTS

$(document).ready(function () {

    // retrieve the types of calls that we can be receiving
    remoteContent.getCallTypes().then(function (items) {
        var $list = $('#callReason');
        var $list2 = $('#callReason2');
        $list.empty();
        $list2.empty();

        $list.append("<option value='' label=''> -- Select an Reason --</option>");
        $list2.append("<option value='' label=''> -- Select an Reason --</option>");

        _.each(items, function (item) {
            $list.append("<option value='" + item + "' label='" + item + "'>" + item + "</option>")
            $list2.append("<option value='" + item + "' label='" + item + "'>" + item + "</option>")
        });
    });


    $('.right-rail').hide();

    //$('#initialForm').hide();

    $('.profile').hide();

    $('.initialResults').hide();

    $('#fullProfile').hide();

    $('.fullResults').hide();

});
