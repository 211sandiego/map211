/**
 * Created by jcasseda on 7/15/14.
 */
var geocoder;
var map;
var incident1;
var incident2;
var incident3;

function initialize() {
    geocoder = new google.maps.Geocoder();
    var sandiegocounty = new google.maps.LatLng(32.93, -116.98 );
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
    //incident2.setMap(map);

    incident3 = new google.maps.KmlLayer({
        url: 'http://map211.herokuapp.com/ggeoxml/incident3.kml', preserveViewport: true
    });
    //incident3.setMap(map);
}

var incident1shown = "true";
var incident2shown = "false";
var incident3shown = "false";

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

function toggleIncident3() {
    if ( incident3shown == "true" ) {
        incident3.setMap(null);
        incident3shown = "false";
    }
    else {
        incident3.setMap(map);
        incident3shown = "true";
    }
}

function codeAddress() {
    if ( $('#streetAddress').val() ) {
        var address = document.getElementById('streetAddress').value + document.getElementById('city').value + document.getElementById('state').value + document.getElementById('zipCode2').value;
    }
    else {
        var address = document.getElementById('zipCode').value;
    }
    
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

function saveZIP() {
    codeAddress();
    $('#initialForm').slideUp();
    var callReason = $('#callReason').val();
    var zipCode = $('#zipCode').val();
    $('#reasonDisplay').html( callReason );
    $('#zipDisplay').html( zipCode );
    $('.initialResults').slideDown();
}

function saveInitial() {
    codeAddress();
    $('#initialForm').slideUp();
    $('.profile').slideDown();
}

function editProfile() {
    var callReason = $('#callReason').val();
    var zipCode = $('#zipCode').val();
    $('#callReason2').val( callReason );
    $('#zipCode2').val( zipCode );
    $('.initialResults').slideUp();
    $('.fullResults').slideUp();
    $('#fullProfile').slideDown();
}

function saveProfile() {
    codeAddress();
    $('#fullProfile').slideUp();
    var callReason = $('#callReason2').val();
    var address = $('#streetAddress').val() + "<br />" + $('#city').val() + ", " + $('#state').val() + " " + $('#zipCode2').val();
    $('#reasonDisplay2').html( callReason );
    $('#addressDisplay').html( address );
    $('.fullResults').slideDown();
}

function startCall() {
    $('.right-rail').slideDown();
    $('.main').removeClass().addClass('col-sm-6 col-sm-offset-3 col-md-8 col-md-offset-2 main');
    $('.start-new').replaceWith('<button class="btn btn-primary btn-lg pull-right close-call" onclick="endCall()">End Call</button>');
}

function endCall() {
    $('.right-rail').slideUp();
    $('.main').removeClass().addClass('col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main');
    $('.close-call').replaceWith('<button class="btn btn-primary btn-lg pull-right start-new" onclick="startCall()">Start New Call</button>');
    $('.profile').hide();
    $('#initialForm').show();
}

function editSection(elem) {
    $(elem).parents('.profile-section').find('.input-container').find('p').fadeOut().parent().find('input, select').fadeIn();
    $(elem).replaceWith('<div class="saveGroup"><button class="btn btn-primary saveBtn" onclick="javascript:saveSection(this);">Save</button><button class="btn btn-default cancelBtn"  onclick="javascript:saveSection(this);">Cancel</button></div>');
}
function saveSection(elem) {
    $(elem).parents('.profile-section').find('.input-container').find('input, select').fadeOut().parent().find('p').fadeIn();
    $(elem).parents('.saveGroup').replaceWith('<button class="btn btn-link" onclick="javascript:editSection(this);">Edit</button>');
}

function AppViewModel() {
    this.Name = ko.observable('');
    this.reason = ko.observable('');
    this.phone = ko.observable('');
    this.street = ko.observable('');
    this.city = ko.observable('');
    this.state = ko.observable('');
    this.ZIP = ko.observable('');
}

ko.applyBindings(new AppViewModel());

$(document).ready(function() {
  $('.right-rail').hide();

  //$('#initialForm').hide();

  $('.profile').hide();

  $('.initialResults').hide();

  $('#fullProfile').hide();  

  $('.fullResults').hide();

});
