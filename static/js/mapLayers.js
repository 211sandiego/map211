var mapLayers = (function () {
    var _instance = {
        setLayers : function (layers) {
            // reset the map
            _kml = [];
            _.each(layers, function (layer, idx) {
                _kml.push(new google.maps.KmlLayer({
                    url : layer.location,
                    preserveViewport : true
                }))
            });

            _layers = layers;
        },

        showLayer : function (index) {
            var layer = _layers[index];
            if (layer.toggle) {
                _kml[index].setMap(null);
            }
            else {
                _kml[index].setMap(map);
            }
            layer.toggle = !layer.toggle;

        },

        renderList : function () {
            // clean up event handlers so we don't leak memory
            $('#toggleLayers').off();

            var dom = $('#toggleLayers');
            // clear the current list
            dom.empty();

            // render new list
            _.each(_layers, function (item, idx) {
                var $item = $(
                        "<li><label for='cb" + idx + "' class='tgl-label'>" + item.name + "</label>" +
                            "<div class='toggle-btn pull-right'>" +
                                "<input class='tgl tgl-light' id='cb" + idx + "' type='checkbox'" + (item.toggle?'checked':'') + ">" +
                                "<label class='tgl-btn' for='cb" + idx + "'></label>" +
                            "</div>" +
                        "</li>");

                dom.append($item);
                $('#cb'+idx).bind('change', function (evt){
                    _instance.showLayer(idx);
                });

                // toggle on layers in the map if indicated
                if (item.toggle) {
                    _kml[idx].setMap(map)
                }
            })
        }

    };

    var _layers = [];
    _kml = [];

    return _instance;
})();