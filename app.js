var chart;
var en;


var curSongs = null;
var curSongIndex;
var autoStop = false;

var allSongs = [];
var params = { };

en.trace=false;
var charts = [
    {
        key: 'energy',
        range: {
            auto: false,
            scale: 100,
            bins: 10,
            low: 0,
            high: 1
        },
        available: function(song) { return true; },
        get: function(song) {
            return song.audio_summary.energy;
        },

        nget: function(song) {
            return song.audio_summary.energy;
        },
    },
    {
        key: 'loudness',
        range: {
            auto: true,
            scale: 1,
            bins: 10,
            low: -60,
            high: 0
        },
        available: function(song) { return true; },
        get: function(song) {
            return song.audio_summary.loudness;
        },
        nget: function(song) {
            return song.audio_summary.normalized_loudness;
        },
    },
    {
        key: 'dance',
        range: {
            auto: false,
            scale: 100,
            bins: 10,
            low:  0,
            high: 1
        },
        available: function(song) { return true; },
        get: function(song) {
            return song.audio_summary.danceability;
        },
        nget: function(song) {
            return song.audio_summary.danceability;
        },
    },
    {
        key: 'liveness',
        range: {
            auto: false,
            scale: 100,
            bins: 10,
            low:  0,
            high: 1
        },
        available: function(song) { return true; },
        get: function(song) {
            return song.audio_summary.liveness;
        },
        nget: function(song) {
            return song.audio_summary.liveness;
        },
    },
    {
        key: 'speech',
        range: {
            auto: false,
            scale: 100,
            bins: 10,
            low:  0,
            high: 1
        },
        available: function(song) { return true; },
        get: function(song) {
            return song.audio_summary.speechiness;
        },
        nget: function(song) {
            return song.audio_summary.speechiness;
        },
    },
    {
        key: 'acoustic',
        range: {
            auto: false,
            scale: 100,
            bins: 10,
            low:  0,
            high: 1
        },

        available : function(song) {
            return 'acousticness' in song.audio_summary;
        },

        get: function(song) {
            return song.audio_summary.acousticness;
        },
        nget: function(song) {
            return song.audio_summary.acousticness;
        },
    },

    {
        key: 'valence',
        range: {
            auto: false,
            scale: 100,
            bins: 10,
            low:  0,
            high: 1
        },

        available : function(song) {
            return 'valence' in song.audio_summary;
        },

        get: function(song) {
            return song.audio_summary.valence;
        },
        nget: function(song) {
            return song.audio_summary.valence;
        },
    },
    /*
    */

    {
        key: 'hottt',
        range: {
            auto: false,
            scale: 100,
            bins: 10,
            low:  0,
            high: 1
        },
        available: function(song) { return true; },
        get: function(song) {
            return song.song_hotttnesss;
        },
        nget: function(song) {
            return song.song_hotttnesss;
        },
    },
    {
        key: 'tempo',
        range: {
            auto: true,
            scale: 1,
            bins: 10
        },
        available: function(song) { return true; },
        get: function(song) {
            return song.audio_summary.tempo;
        },

        nget: function(song) {
            return song.audio_summary.normalized_tempo;
        },
    },

    {
        key: 'duration',
        range: {
            auto: true,
            scale: 1,
            bins: 10
        },
        available: function(song) { return true; },
        get: function(song) {
            return song.audio_summary.duration;
        },
        nget: function(song) {
            return song.audio_summary.normalized_duration;
        },
    },

    {
        key: 'key',
        range: {
            auto: false,
            low:  0,
            high: 12,
            scale: 1,
            bins: 12
        },
        available: function(song) { return true; },
        get: function(song) {
            return song.audio_summary.key;
        },

        getLabel: function(label) {
            var notes = {
                0 : 'C',
                1 : 'C#',
                2 : 'D',
                3 : 'D#',
                4 : 'E',
                5 : 'F',
                e : 'F#',
                7 : 'G',
                8 : 'G#',
                9 : 'A',
                10 : 'A#',
                11 : 'B',
            }
            if (label in notes) {
                return notes[label];
            } else {
                return label;
            }
        }
    },

    {
        key: 'time sig',
        range: {
            auto: false,
            low:  0,
            high: 8,
            scale: 1,
            bins: 8 
        },
        available: function(song) { return true; },
        get: function(song) {
            return song.audio_summary.time_signature;
        },
    },
    {
        key: 'mode',
        range: {
            auto: false,
            low:  0,
            high: 2,
            scale: 1,
            bins: 2
        },
        available: function(song) { return true; },
        get: function(song) {
            return song.audio_summary.mode;
        },

        getLabel: function(label) {
            var mode = {
                0 : 'minor',
                1 : 'major',
            }

            if (label in mode) {
                return mode[label];
            } else {
                return label;
            }
        }
    },
];

function showBarChart(chartInfo) {
    var hist = createHistogram(chartInfo);
    // SERIAL CHART
    chart = new AmCharts.AmSerialChart();
    chart.dataProvider = hist
    chart.categoryField = "category";
    chart.startDuration = 1;
    chart.marginTop = 40;

    // AXES
    // category
    var categoryAxis = chart.categoryAxis;
    categoryAxis.labelRotation = 90;
    categoryAxis.labelRotation = 00;
    categoryAxis.gridPosition = "start";

    // value
    // in case you don't want to change default settings of value axis,
    // you don't need to create it, as one value axis is created automatically.

    var valueAxis = new AmCharts.ValueAxis();
    valueAxis.title = "Number of Songs";
    chart.addValueAxis(valueAxis);

    // GRAPH
    var graph = new AmCharts.AmGraph();
    graph.valueField = "val";
    graph.balloonText = "[[category]]: [[value]] songs";
    graph.type = "column";
    graph.lineAlpha = 0;
    graph.fillAlphas = 0.8;

    chart.addTitle(toTitleCase(chartInfo.key) + " distribution", 20, "#333", true)
    chart.addGraph(graph);

    chart.addListener("rollOverGraphItem", function(evt) {
    });

    chart.addListener("clickGraphItem", function(evt) {
        startPlayingSongs(hist[evt.index].songs);
    });
    chart.write("chartdiv");
}

// a cold to hot color pallet
var pallet = [
    color(41, 10, 216),
    color(38, 77, 255),
    color(63, 160, 255),
    color(114, 217, 255),
    color(170, 247, 255),
    color(224, 255, 255),
    color(255, 255, 191),
    color(255, 224, 153),
    color(255, 173, 114),
    color(247, 109, 94),
    color(216, 38, 50),
    color(165, 0, 33),
    color(165, 0, 33),
];

var pallet2 = [
    color(0, 0, 128),
    color(0, 64, 64),
    color(0, 128, 0),
    color(64, 64, 0),
    color(168, 0, 0),
    color(168, 0, 0),
    color(168, 0, 0),
];

var highlightColor = color(0xff, 0x80, 0x00);


function color(r, g, b) {
    function hc(c) {
        c = Math.round(c * 1);
        var cs = c.toString(16);
        if (cs.length == 1) {
            return '0' + cs;
        } else {
            return cs;
        }
    }
    return "#" + hc(r) + hc(g) + hc(b);
}

function getColor(val) {
    var cpallet = pallet2;
    var index = Math.round(val * (cpallet.length - 1));
    return cpallet[index];
}

function normalizeSongAttribute(attribute) {
    var min = 1000000;
    var max = -1000000;

    $.each(allSongs, function(index, song) {
        var val = song.audio_summary[attribute];
        if (val  > max) {
            max = val;
        }
        if (val  < max) {
            min = val;
        }
    });

    var range = max - min;
    $.each(allSongs, function(index, song) {
        var val = song.audio_summary[attribute];
        var nval = (val - min) / range;
        song.audio_summary['normalized_' + attribute] = nval;
    });
}


function getSongData(chartX, chartY, chartZ, chartW) {
    var data = [];
    var minSize = 3;
    var sizeRange = 12;

    function get(chart, song) {
        return chart.get(song) * chart.range.scale;
    }

    $.each(allSongs, function(index, song) {
        var d = {
            x : get(chartX, song),
            y : get(chartY, song),
            z : chartZ.nget(song) * sizeRange + minSize,
            z2 : chartZ.nget(song) * sizeRange + minSize,
            bullet: hasTracks(song) ? 'round' : 'square',
            color : getColor(chartW.nget(song)),
            color2 : getColor(chartW.nget(song)),
            title : song.title,
            song: song
        };
        song.pointData = d;
        data.push(d);
    });
    return data;
}


function highlightSong(song, state) {
    if (state) {
        song.pointData.z = 20;
        song.pointData.bullet = 'triangleUp';
        song.pointData.sortOrder = 1;
        song.pointData.color = highlightColor;
    } else {
        song.pointData.z = song.pointData.z2;
        song.pointData.bullet = 'round';
        song.pointData.bullet = hasTracks(song) ? 'round' : 'square',
        song.pointData.sortOrder = 0;
        song.pointData.color = song.pointData.color2;
    }
}

function highlightSongByName(name) {
    name = name.toLowerCase();
    $.each(allSongs, function(index, song) {
        if (name.length > 0 && song.song_name.toLowerCase().indexOf(name) >= 0) {
            highlightSong(song, true);
        } else {
            highlightSong(song, false);
        }
    });

    chart.dataProvider = _.sortBy(chart.dataProvider, 'sortOrder');
    chart.validateData();
}


function updateScatterChart() {
    var chartX = $("#x-attribute-select :selected").val();
    var cx = charts[chartX];

    var chartY = $("#y-attribute-select :selected").val();
    var cy = charts[chartY];

    var chartZ = $("#z-attribute-select :selected").val();
    var cz = charts[chartZ];

    var chartW = $("#w-attribute-select :selected").val();
    var cw = charts[chartW];

    addURL('x', cx.key);
    addURL('y', cy.key);
    addURL('z', cz.key);
    addURL('w', cw.key);
    addURL('type', 'scatter');
    clrURL(['d']);
    makeURL();

    // SERIAL CHART
    var dataProvider = getSongData(cx, cy, cz, cw);
    chart = new AmCharts.AmXYChart();
    chart.dataProvider = dataProvider;
    chart.startDuration = 0;
    chart.startEffect = 'elastic';
    chart.sequencedAnimation = false;
    chart.marginTop = 40;
    chart.pathToImages ="amcharts/images/";

    // AXES
    // category
    var xAxis = new AmCharts.ValueAxis();
    xAxis.position = "bottom";
    xAxis.axisAlpha = 0;
    xAxis.autoGridCount = true;
    xAxis.title = cx.key;
    chart.addValueAxis(xAxis);

    var yAxis = new AmCharts.ValueAxis();
    yAxis.position = "left";
    yAxis.axisAlpha = 0;
    yAxis.autoGridCount = true;
    yAxis.title = cy.key;
    chart.addValueAxis(yAxis);


    // GRAPH
    var graph = new AmCharts.AmGraph();
    graph.valueField = "val";
    graph.balloonText = "[[title]]";
    graph.xField = 'x';
    graph.yField = 'y';
    graph.bulletField = 'bullet';
    graph.colorField = 'color';
    graph.lineAlpha = 0;
    graph.bullet = 'round';
    graph.bulletSizeField = 'z';
    // graph.descriptionField = 'title';

    chart.addTitle("Scatter plot", 20, "#333", true)
        // CURSOR
    var chartCursor = new AmCharts.ChartCursor();
    chart.addChartCursor(chartCursor);

    // SCROLLBAR
    var chartScrollbar = new AmCharts.ChartScrollbar();
    chart.addChartScrollbar(chartScrollbar);

    chart.addGraph(graph);

    chart.addListener("rollOverGraphItem", function(evt) {
    });

    chart.addListener("clickGraphItem", function(evt) {
        var song = chart.dataProvider[evt.index].song;
        playSong(song);
    });

    chart.write("schartdiv");
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}



function initUI() {
    $("#pause-play").click(function() {
        R.player.togglePause();
    });

    $("#play-next").click(function() {
        playNextSong();
    });

    $(window).resize(function() {
        resizeChart();
    });

    $("#catalog-input").change(function() {
        var id = $("#catalog-input").val();
        fetchSongsFromTasteProfile(id, 0);
    });

    $(".attribute-select").empty();
    $.each(charts, function(index, chart) {
        var choice = $("<option>");
        choice.attr('value', index);
        choice.text(chart.key);
        $(".attribute-select").append(choice);
    }); 

    $('#x-attribute-select option[value=0]').attr("selected",true);
    $('#y-attribute-select option[value=1]').attr("selected",true);
    $('#z-attribute-select option[value=5]').attr("selected",true);
    $('#w-attribute-select option[value=3]').attr("selected",true);


    $(".attribute-select").change(function() {
        updateCharts();
    });


    $("#show-main").click(function() {
        makeDistributionChartActive();
    });

    $("#show-about").click(function() {
        $(".nav-choice").removeClass("active");
        $("#show-about").parent().addClass("active");
        $(".main-display").hide();
        $("#about").show();
    });

    $("#show-scatter").click(function() {
        makeScatterChartActive();
    });

    $("#song-input").change(function() {
        var songName = $("#song-input").val();
        highlightSongByName(songName);
    });
    resizeChart();
}

function makeScatterChartActive() {
    $(".nav-choice").removeClass("active");
    $("#show-scatter").parent().addClass("active");
    $(".main-display").hide();
    $("#scatter-display").show();
    updateScatterChart();
}

function makeDistributionChartActive() {
    $(".nav-choice").removeClass("active");
    $("#show-main").parent().addClass("active");
    $(".main-display").hide();
    $("#main").show();
    updateDistributionChart();
}

function resizeChart() {
    var width = $("#sim-tab").width();
    var height = $("#sim-tab").height();

    if (height > 800) {
        height = 800;
    }
    $("#simgraph").attr("width", width);
    $("#simgraph").attr("height", height);
}

function info(s) {
    if (s.length > 0) {
        //$("#info").show();
        $("#info").text(s);
    } else {
        $("#info").text("");
        //$("#info").hide();
    }
}

function getRdioID(song) {
    console.log(song);
    var id = song.tracks[0].foreign_id;
    var rawID = id.split(':')[2]
    return rawID;
}

function hasTracks(song) {
    return song.tracks.length > 0;
}

function playSong(song) {
    if (hasTracks(song)) {
        var rdioID = getRdioID(song);
        currentSong = song;
        R.player.play({
            source: rdioID
        });
    }
    $("#song-title").text(song.song_name);
    $("#artist-name").text(song.artist_name);
    updateSongTables(song);
}

function queueSong(song) {
    autoStop = true;
    playSong(song);
}

function playNextSong() {
    $("#now-playing").show();
    if (curSongIndex >= curSongs.length) {
        curSongIndex = 0;
    }

    if (curSongIndex < curSongs.length) {
        playSong(curSongs[curSongIndex++]);
    }
}

function startPlayingSongs(songs) {
    if (curSongs != songs) {
        curSongIndex = 0;
        curSongs = songs;
    }
    playNextSong();
}


function fetchSongsFromTasteProfile(id,start) {
    var pageSize = 100;

    if (start == 0) {
        addURL('id', id);
        allSongs = [];
    }

    en.apiRequest('catalog/read', 
        {
            id:id,
            bucket: ['audio_summary', 'song_hotttnesss', 'tracks', 'id:rdio-US'],
            results: pageSize,
            start: start
        }, 

        function(data) {
            console.log(data);

            if (start == 0) {
                var name = data.response.catalog.name;
                $("#tp-name").text(name);
            }
            $.each(data.response.catalog.items, function(index, item) {
                if ('audio_summary' in item) {
                    allSongs.push(item);
                }
            });

            if (data.response.catalog.items.length == pageSize) {
                fetchSongsFromTasteProfile(id, start + pageSize);
            } else {
                // got all the data
                console.log('all songs', allSongs);

                $("#catalog-input").prop('disabled', false);
                info("");
                normalizeSongs();
                curSongs = allSongs;
                curSongIndex = 0;
                updateCharts();
                if (!R.player.playState() == R.player.PLAYSTATE_PLAYING) {
                    queueHotSong();
                }
            }
        }, 

        function() {
        }
    );
}

function createHistogram(chartInfo) {
    var vMax = -1000000;
    var vMin = 1000000;

    if (chartInfo.range.auto) {
        $.each(allSongs, function(index, song) {
            var val = chartInfo.get(song);
            if (val > vMax) {
                vMax = val;
            }
            if (val < vMin) {
                vMin = val;
            }
        });
    } else {
        vMin = chartInfo.range.low;
        vMax = chartInfo.range.high;
    }

    var range = (vMax - vMin);

    var hist = [];

    var doubleLabel = (chartInfo.range.bins - range) != 0;
    for (var i = 0; i < chartInfo.range.bins; i++) {
        var label = Math.round(chartInfo.range.scale * i / chartInfo.range.bins * range + vMin);
        if (doubleLabel)  {
            var hlabel = Math.round(chartInfo.range.scale * (i + 1) / chartInfo.range.bins * range + vMin);
            label =  label + ' - ' + hlabel;
        } 

        if (chartInfo.getLabel) {
            label = chartInfo.getLabel(label);
        }
        hist[i] = { category: label, val: 0, songs:[] };
    }

    $.each(allSongs, function(index, song) {
        var val = chartInfo.get(song);

        val = val > vMax ? vMax : val < vMin ? vMin : val;
        nval = (val - vMin) / range;
        var bin = Math.floor(nval * chartInfo.range.bins);
        bin = bin >= hist.length ? hist.length - 1 : bin < 0 ? 0 : bin;
        hist[bin].val += 1;
        hist[bin].songs.push(song);
    });

    return hist;
}

function updateCharts() {
    if ('type' in params && params.type == 'scatter') {
        updateScatterChart();
    } else {
        updateDistributionChart();
    }
}


function updateDistributionChart() {
    var whichChart = $("#attribute-select :selected").val();
    var chartInfo = charts[whichChart];

    addURL('type', 'bar');
    addURL('d', chartInfo.key);
    clrURL(['x', 'y', 'z', 'w']);
    makeURL();

    showBarChart(chartInfo);
}

function normalizeSongs() {
    normalizeSongAttribute('tempo');
    normalizeSongAttribute('loudness');
    normalizeSongAttribute('duration');
}


function updateSongTables(song) {
    var rowsPerTable = Math.ceil(charts.length / 2);
    $(".stable").empty();


    function get(chart, song) {
        var val = chart.get(song);
        val = Math.round(val * chart.range.scale);

        if (chart.getLabel) {
            val = chart.getLabel(val);
        }
        return val;
    }

    $.each(charts, function(index, chart) {
        var which = Math.floor(index / rowsPerTable);
        var table = $('#stable-' + (which + 1));
        var tr = $("<tr>");
        var th = $("<th>");
        var td = $("<td>");

        th.text(chart.key);
        td.text(get(chart, song));

        tr.append(th);
        tr.append(td);
        table.append(tr);
    });
}

function queueHotSong() {
    var hotttest = allSongs[0];
    $.each(allSongs, function(index, song) {
        if (song.hotttnesss > hotttest.hotttnesss) {
            hotttest = song;
        }
    });
    queueSong(hotttest);
}


R.ready(function() {
    R.player.on("change:playingTrack", function(track) {
        if (track) {
            var image = track.attributes.icon;
            $("#album-art").attr('src', image);
        } else {
            playNextSong();
        }
    });

    R.player.on("change:playState", function(state) {
        if (state == R.player.PLAYSTATE_PAUSED) {
            $("#pause-play i").removeClass("icon-pause");
            $("#pause-play i").addClass("icon-play");
        }
        if (state == R.player.PLAYSTATE_PLAYING) {
            if (autoStop) {
                autoStop = false;
                R.player.pause();
            }
            $("#pause-play i").removeClass("icon-play");
            $("#pause-play i").addClass("icon-pause");
        }
    });

    R.player.on("change:playingSource", function(track) {});
});

function urldecode(str) {
   return decodeURIComponent((str+'').replace(/\+/g, '%20'));
}

function addURL(key, value) {
    params[key] = value;
}

function makeURL() {
    var p = ''
    $.each(params, function(key, val) {
        if (val != null) {
            if (p.length == 0) {
                p += '?';
            } else {
                p += '&';
            }
            p += key;
            p += '=';
            p += val
        }
    });
    history.replaceState({}, document.title, p);
}

function clrURL(keylist) {
    $.each(keylist, function(index, val) {
        if (val in params) {
            delete params[val];
        }
    });
}

function selectAttribute(select, attribute, params) {
    if (attribute in params) {
        var val = params[attribute];
        $(select + ' option:contains("' + val + '")').attr("selected",true);
    }
}

function processParams() {
    var q = document.URL.split('?')[1];
    if(q != undefined){
        q = q.split('&');
        for(var i = 0; i < q.length; i++){
            var pv = q[i].split('=');
            var p = pv[0];
            var v = pv[1];
            params[p] = urldecode(v);
        }
    }

    var id = 'CABSZND13D3C017B85';
    if ('id' in params) {
        id = params['id'];
    } 

    selectAttribute("#attribute-select", 'd', params);
    selectAttribute("#x-attribute-select", 'x', params);
    selectAttribute("#y-attribute-select", 'y', params);
    selectAttribute("#z-attribute-select", 'z', params);
    selectAttribute("#w-attribute-select", 'w', params);

    if ('type' in params) {
        if (params['type'] == 'scatter') {
            makeScatterChartActive();
        }
    } 
    fetchSongsFromTasteProfile(id, 0);
}

$(document).ready(function() {
    fetchApiKey( function(api_key, isLoggedIn) {
        en = new EchoNest(api_key);
        initUI();
        AmCharts.ready( function() { processParams()});
    });
});
