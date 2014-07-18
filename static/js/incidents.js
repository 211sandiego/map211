var incidents = (function () {
    var _instance = {
        setIncidents : function (incidents) {
            _incidents = incidents;
        },

        showLocation : function (index) {
            var incident = _incidents[index];
            geocoder.geocode({ 'address' : incident.location}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location);
                    // TODO - zoom to specified level
                }
            });
        },

        renderList : function () {
            // clean up event handlers so we don't leak memory
            $('#incidents').off();

            var dom = $('#incidents');
            // clear the current list
            dom.empty();

            // render new list
            _.each(_incidents, function (item, idx) {
                var $item = $("<li><span class='glyphicon glyphicon-" + item.type + "'></span> " + item.name + "</li>");
                $item.click(function () {
                    incidents.showLocation(idx);
                });
                dom.append($item);
            })
        }

    };

    var _incidents = [];

    return _instance;
})();