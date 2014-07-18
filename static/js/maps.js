/**
 * Created by jcasseda on 7/15/14.
 */
var geocoder;
var map;

function initialize () {

    geocoder = new google.maps.Geocoder();
    var sandiegocounty = new google.maps.LatLng(32.93, -116.98);
    var mapOptions = {
        zoom : 10,
        center : sandiegocounty
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    remoteContent.getContent().then(function (data) {
        incidents.setIncidents(data.incidents);
        mapLayers.setLayers(data.KML);
        incidents.renderList();
        mapLayers.renderList();
    });


}

function codeAddress () {
    var address;
    if ($('#streetAddress').val()) {
        address = document.getElementById('streetAddress').value + document.getElementById('city').value + document.getElementById('state').value + document.getElementById('zipCode2').value;
    }
    else {
        address = document.getElementById('zipCode').value;
    }

    // Drop a pin on the map from the location entered in address or zipcode
    geocoder.geocode({ 'address' : address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map : map,
                position : results[0].geometry.location
            });
        }
        else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

google.maps.event.addDomListener(window, 'load', initialize);

function saveZIP () {
    codeAddress();
    $('#initialForm').slideUp();
    var callReason = $('#callReason').val();
    var zipCode = $('#zipCode').val();
    $('#reasonDisplay').html(callReason);
    $('#zipDisplay').html(zipCode);
    $('.initialResults').slideDown();
}

function editProfile () {
    var callReason = $('#callReason').val();
    var zipCode = $('#zipCode').val();
    $('#callReason2').val(callReason);
    $('#zipCode2').val(zipCode);
    $('.initialResults').slideUp();
    $('.fullResults').slideUp();
    $('#fullProfile').slideDown();
}

function saveProfile () {
    codeAddress();
    $('#fullProfile').slideUp();
    var callReason = $('#callReason2').val();
    var address = $('#streetAddress').val() + "<br />" + $('#city').val() + ", " + $('#state').val() + " " + $('#zipCode2').val();
    $('#reasonDisplay2').html(callReason);
    $('#addressDisplay').html(address);
    $('.fullResults').slideDown();
}

function startCall () {
    $('.right-rail').slideDown();
    $('.start-new').replaceWith('<button class="btn btn-primary btn-lg pull-right close-call" onclick="endCall()">End Call</button>');
}

function endCall () {
    $('.right-rail').slideUp();
    $('.close-call').replaceWith('<button class="btn btn-primary btn-lg pull-right start-new" onclick="startCall()">Start New Call</button>');
    $('.initialResults').hide();
    $('#fullProfile').hide();
    $('.fullResults').hide();
    $('#initialForm').show();
}

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
            $list.append("<option value='"+ item + "' label='" + item + "'>"+ item + "</option>")
            $list2.append("<option value='"+ item + "' label='" + item + "'>"+ item + "</option>")
        });
    });

    $('.right-rail').hide();

    $('.initialResults').hide();

    $('#fullProfile').hide();

    $('.fullResults').hide();


});
