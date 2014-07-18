var remoteContent = (function () {
    var _instance = {

        getContent : function () {
            var deferred = $.Deferred();
            $.ajax({
                url : _contentUrl,
                cache : false,
                dataType : 'json',
                success : function (response) {
                    var incidents = _parseIncidents(response);
                    var KML = _parseKML(response);
                    deferred.resolve({incidents : incidents, KML : KML});
                },
                error : function () {
                    deferred.resolve("error");
                }
            });

            return deferred.promise();
        },

        getCallTypes : function () {
            var deferred = $.Deferred();
            $.ajax({
                url : _callTypeUrl,
                cache : false,
                dataType : 'json',
                success : function (response) {
                    var types = _parseCallTypes(response);
                    deferred.resolve(types);
                },
                error : function () {
                    deferred.resolve("error");
                }
            });

            return deferred.promise();
        }
    };

    var server = location.href.indexOf('localhost' >=0)?"http://localhost:5000":"";
    var _contentUrl = server + "/content";
    var _callTypeUrl = server + "/calltype";

    function _parseIncidents (data) {
        var _data = data.incidents;
        var incidents = [];
        var entries = _data.feed.entry;
        _.each(entries, function (entry) {
            incidents.push(
                {
                    name : entry.gsx$disastername.$t,
                    type : (entry.gsx$disastertype.$t).toLowerCase(),
                    location : entry.gsx$zipcode.$t,
                    mapZoom : parseInt(entry.gsx$zoomfactor.$t, 10)
                }
            )
        });
        return incidents;
    }

    function _parseKML (data) {
        var _data = data.KML;
        var KML = [];
        var entries = _data.feed.entry;
        _.each(entries, function (entry) {
            KML.push(
                {
                    name : entry.gsx$layername.$t,
                    toggle : entry.gsx$default.$t === 'on',
                    location : entry.gsx$kmlurl.$t
                }
            )
        });
        return KML;
    }

    function _parseCallTypes (data) {
        var types = [];
        var entries = data.feed.entry;
        _.each(entries, function (entry) {
            types.push(entry.gsx$reasonsforcalling.$t);
        });
        return types;
    }

    return _instance;
})();
