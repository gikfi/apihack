/**!
 * The MIT License
 *
 * Copyright (c) 2013 the angular-leaflet-directive Team, http://tombatossals.github.io/angular-leaflet-directive
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * angular-leaflet-directive
 * https://github.com/tombatossals/angular-leaflet-directive
 *
 * @authors https://github.com/tombatossals/angular-leaflet-directive/graphs/contributors
 */

/*! angular-leaflet-directive 02-05-2014 */
!function() {
    "use strict";
    angular.module("leaflet-directive", []).directive("leaflet", ["$q", "leafletData", "leafletMapDefaults", "leafletHelpers", "leafletEvents", function(a, b, c, d, e) {
        var f;
        return {
            restrict: "EA",
            replace: !0,
            scope: {
                center: "=center",
                defaults: "=defaults",
                maxbounds: "=maxbounds",
                bounds: "=bounds",
                markers: "=markers",
                legend: "=legend",
                geojson: "=geojson",
                paths: "=paths",
                tiles: "=tiles",
                layers: "=layers",
                controls: "=controls",
                eventBroadcast: "=eventBroadcast"
            },
            template: '<div class="angular-leaflet-map"></div>',
            controller: ["$scope", function(b) {
                f = a.defer(), this.getMap = function() {
                    return f.promise
                }, this.getLeafletScope = function() {
                    return b
                }
            }
            ],
            link: function(a, g, h) {
                var i = d.isDefined, j = c.setDefaults(a.defaults, h.id), k = e.genDispatchMapEvent, l = e.getAvailableMapEvents();
                i(h.width) && (isNaN(h.width) ? g.css("width", h.width) : g.css("width", h.width + "px")), i(h.height) && (isNaN(h.height) ? g.css("height", h.height) : g.css("height", h.height + "px"));
                var m = new L.Map(g[0], c.getMapCreationDefaults(h.id));
                if (f.resolve(m), i(h.center) || m.setView([j.center.lat, j.center.lng], j.center.zoom)
                    , !i(h.tiles)&&!i(h.layers)) {
                    var n = L.tileLayer(j.tileLayer, j.tileLayerOptions);
                    n.addTo(m), b.setTiles(n, h.id)
                }
                if (i(m.zoomControl) && i(j.zoomControlPosition) && m.zoomControl.setPosition(j.zoomControlPosition), i(m.zoomControl) && j.zoomControl===!1 && m.zoomControl.removeFrom(m)
                    , i(m.zoomsliderControl) && i(j.zoomsliderControl) && j.zoomsliderControl===!1 && m.zoomsliderControl.removeFrom(m), !i(h.eventBroadcast))for (var o = "broadcast", p = 0; p < l.length; p++) {
                    var q = l[p];
                    m.on(q, k(a, q, o), {
                        eventName: q
                    })
                }
                m.whenReady(function() {
                    b.setMap(m, h.id)
                }), a.$on("$destroy", function() {
                    b.unresolveMap(h.id)
                })
            }
        }
    }
    ]), angular.module("leaflet-directive").directive("center", ["$log", "$q", "$location", "leafletMapDefaults", "leafletHelpers", "leafletBoundsHelpers", "leafletEvents", function(a, b, c, d, e, f, g) {
        var h, i = e.isDefined, j = e.isNumber, k = e.isSameCenterOnMap, l = e.safeApply, m = e.isValidCenter, n = e.isEmpty, o = e.isUndefinedOrEmpty, p = function(a, b) {
            return i(a)&&!n(a) && o(b)
        };
        return {
            restrict: "A",
            scope: !1,
            replace: !1,
            require: "leaflet",
            controller: function() {
                h = b.defer(), this.getCenter = function() {
                    return h.promise
                }
            },
            link: function(b, e, n, o) {
                var q = o.getLeafletScope(), r = q.center;
                o.getMap().then(function(b) {
                    var e = d.getDefaults(n.id);
                    if (-1 !== n.center.search("-"))
                        return a.error('The "center" variable can\'t use a "-" on his key name: "' + n.center + '".'), void b.setView([e.center.lat, e.center.lng], e.center.zoom);
                    if (p(q.bounds, r))
                        b.fitBounds(f.createLeafletBounds(q.bounds)), r = b.getCenter(), l(q, function(a) {
                        a.center = {
                            lat: b.getCenter().lat,
                            lng: b.getCenter().lng,
                            zoom: b.getZoom(),
                            autoDiscover: !1
                        }
                    }), l(q, function(a) {
                        var c = b.getBounds(), d = {
                            northEast: {
                                lat: c._northEast.lat,
                                lng: c._northEast.lng
                            },
                            southWest: {
                                lat: c._southWest.lat,
                                lng: c._southWest.lng
                            }
                        };
                        a.bounds = d
                    });
                    else {
                        if (!i(r))
                            return a.error('The "center" property is not defined in the main scope'), void b.setView([e.center.lat, e.center.lng], e.center.zoom);
                        i(r.lat) && i(r.lng) || i(r.autoDiscover) || angular.copy(e.center, r)
                    }
                    var o, s;
                    if ("yes" === n.urlHashCenter) {
                        var t = function() {
                            var a, b = c.search();
                            if (i(b.c)) {
                                var d = b.c.split(":");
                                3 === d.length && (a = {
                                    lat: parseFloat(d[0]),
                                    lng: parseFloat(d[1]),
                                    zoom: parseInt(d[2], 10)
                                })
                            }
                            return a
                        };
                        o = t(), q.$on("$locationChangeSuccess", function(a) {
                            var c = a.currentScope, d = t();
                            i(d)&&!k(d, b) && (c.center = {
                                lat: d.lat,
                                lng: d.lng,
                                zoom: d.zoom
                            })
                        })
                    }
                    q.$watch("center", function(c) {
                        return i(o) && (angular.copy(o, c), o = void 0), m(c) || c.autoDiscover===!0 ? c.autoDiscover===!0 ? (j(c.zoom) || b.setView([e.center.lat, e.center.lng], e.center.zoom), void b.locate(j(c.zoom) && c.zoom > e.center.zoom ? {
                            setView: !0,
                            maxZoom: c.zoom
                        } : i(e.maxZoom) ? {
                            setView: !0,
                            maxZoom: e.maxZoom
                        } : {
                            setView: !0
                        })) : void(s && k(c, b) || (b.setView([c.lat, c.lng], c.zoom), g.notifyCenterChangedToBounds(q, b))) : void a.warn("[AngularJS - Leaflet] invalid 'center'")
                    }, !0), b.whenReady(function() {
                        s=!0
                    }), b.on("moveend", function() {
                        h.resolve(), g.notifyCenterUrlHashChanged(q, b, n, c.search()), k(r, b) || l(q, function(a) {
                            a.center = {
                                lat: b.getCenter().lat,
                                lng: b.getCenter().lng,
                                zoom: b.getZoom(),
                                autoDiscover: !1
                            }, g.notifyCenterChangedToBounds(q, b)
                        })
                    }), r.autoDiscover===!0 && b.on("locationerror", function() {
                        a.warn("[AngularJS - Leaflet] The Geolocation API is unauthorized on this page."), m(r) ? (b.setView([r.lat, r.lng], r.zoom), g.notifyCenterChangedToBounds(q, b)) : (b.setView([e.center.lat, e.center.lng], e.center.zoom), g.notifyCenterChangedToBounds(q, b))
                    })
                })
            }
        }
    }
    ]), angular.module("leaflet-directive").directive("tiles", ["$log", "leafletData", "leafletMapDefaults", "leafletHelpers", function(a, b, c, d) {
        return {
            restrict: "A",
            scope: !1,
            replace: !1,
            require: "leaflet",
            link: function(e, f, g, h) {
                var i = d.isDefined, j = h.getLeafletScope(), k = j.tiles;
                return i(k) || i(k.url) ? void h.getMap().then(function(a) {
                    var d, e = c.getDefaults(g.id);
                    j.$watch("tiles", function(c) {
                        var f = e.tileLayerOptions, h = e.tileLayer;
                        return !i(c.url) && i(d) ? void a.removeLayer(d) : i(d) ? i(c.url) && i(c.options)&&!angular.equals(c.options, f) ? (a.removeLayer(d), f = e.tileLayerOptions, angular.copy(c.options, f), h = c.url, d = L.tileLayer(h, f), d.addTo(a), void b.setTiles(d, g.id)) : void(i(c.url) && d.setUrl(c.url)) : (i(c.options) && angular.copy(c.options, f), i(c.url) && (h = c.url), d = L.tileLayer(h, f), d.addTo(a), void b.setTiles(d, g.id))
                    },
                    !0)
                }) : void a.warn("[AngularJS - Leaflet] The 'tiles' definition doesn't have the 'url' property.")
            }
        }
    }
    ]), angular.module("leaflet-directive").directive("legend", ["$log", "$http", "leafletHelpers", "leafletLegendHelpers", function(a, b, c, d) {
        return {
            restrict: "A",
            scope: !1,
            replace: !1,
            require: "leaflet",
            link: function(e, f, g, h) {
                var i, j = c.isArray, k = c.isDefined, l = c.isFunction, m = h.getLeafletScope(), n = m.legend, o = n.legendClass ? n.legendClass: "legend", p = n.position || "bottomright";
                h.getMap().then(function(c) {
                    k(n.url) || j(n.colors) && j(n.labels) && n.colors.length === n.labels.length ? k(n.url) ? a.info("[AngularJS - Leaflet] loading arcgis legend service.") : (i = L.control({
                        position: p
                    }), i.onAdd = d.getOnAddArrayLegend(n, o), i.addTo(c)) : a.warn("[AngularJS - Leaflet] legend.colors and legend.labels must be set."), m.$watch("legend.url", function(e) {
                        k(e) && b.get(e).success(function(a) {
                            k(i) ? d.updateArcGISLegend(i.getContainer(), a) : (i = L.control({
                                position: p
                            }), i.onAdd = d.getOnAddArcGISLegend(a, o), i.addTo(c)), k(n.loadedData) && l(n.loadedData) && n.loadedData()
                        }).error(function() {
                            a.warn("[AngularJS - Leaflet] legend.url not loaded.")
                        })
                    })
                })
            }
        }
    }
    ]), angular.module("leaflet-directive").directive("geojson", ["$log", "$rootScope", "leafletData", "leafletHelpers", function(a, b, c, d) {
        return {
            restrict: "A",
            scope: !1,
            replace: !1,
            require: "leaflet",
            link: function(a, e, f, g) {
                var h = d.safeApply, i = d.isDefined, j = g.getLeafletScope(), k = {};
                g.getMap().then(function(a) {
                    j.$watch("geojson", function(e) {
                        if (i(k) && a.hasLayer(k) && a.removeLayer(k), i(e) && i(e.data)
                            ) {
                            var f = e.resetStyleOnMouseout, g = e.onEachFeature;
                            g || (g = function(a, c) {
                                d.LabelPlugin.isLoaded() && i(e.label) && c.bindLabel(a.properties.description), c.on({
                                    mouseover: function(c) {
                                        h(j, function() {
                                            e.selected = a, b.$broadcast("leafletDirectiveMap.geojsonMouseover", c)
                                        })
                                    },
                                    mouseout: function(a) {
                                        f && k.resetStyle(a.target), h(j, function() {
                                            e.selected = void 0, b.$broadcast("leafletDirectiveMap.geojsonMouseout", a)
                                        })
                                    },
                                    click: function(c) {
                                        h(j, function() {
                                            e.selected = a, b.$broadcast("leafletDirectiveMap.geojsonClick", e.selected, c)
                                        })
                                    }
                                })
                            }), e.options = {
                                style: e.style,
                                filter: e.filter,
                                onEachFeature: g,
                                pointToLayer: e.pointToLayer
                            }, k = L.geoJson(e.data, e.options), c.setGeoJSON(k), k.addTo(a)
                        }
                    })
                })
            }
        }
    }
    ]), angular.module("leaflet-directive").directive("layers", ["$log", "$q", "leafletData", "leafletHelpers", "leafletLayerHelpers", "leafletControlHelpers", function(a, b, c, d, e, f) {
        var g;
        return {
            restrict: "A",
            scope: !1,
            replace: !1,
            require: "leaflet",
            controller: function() {
                g = b.defer(), this.getLayers = function() {
                    return g.promise
                }
            },
            link: function(b, h, i, j) {
                var k = d.isDefined, l = {}, m = j.getLeafletScope(), n = m.layers, o = e.createLayer, p = f.updateLayersControl, q=!1;
                j.getMap().then(function(b) {
                    if (!k(n) ||!k(n.baselayers) || 0 === Object.keys(n.baselayers).length)
                        return void a.error("[AngularJS - Leaflet] At least one baselayer has to be defined");
                    g.resolve(l), c.setLayers(l, i.id), l.baselayers = {}, l.overlays = {};
                    var d = i.id, e=!1;
                    for (var f in n.baselayers) {
                        var h = o(n.baselayers[f]);
                        k(h) ? (l.baselayers[f] = h, n.baselayers[f].top===!0 && (b.addLayer(l.baselayers[f]), e=!0)) : delete n.baselayers[f]
                    }
                    !e && Object.keys(l.baselayers).length > 0 && b.addLayer(l.baselayers[Object.keys(n.baselayers)[0]]);
                    for (f in n.overlays) {
                        var j = o(n.overlays[f]);
                        k(j) ? (l.overlays[f] = j, n.overlays[f].visible===!0 && b.addLayer(l.overlays[f])) : delete n.overlays[f]
                    }
                    m.$watch("layers.baselayers", function(c) {
                        for (var e in l.baselayers)
                            k(c[e]) || (b.hasLayer(l.baselayers[e]) && b.removeLayer(l.baselayers[e]), delete l.baselayers[e]);
                        for (var f in c)
                            if (!k(l.baselayers[f])) {
                                var g = o(c[f]);
                                k(g) && (l.baselayers[f] = g, c[f].top===!0 && b.addLayer(l.baselayers[f]))
                            }
                        if (0 === Object.keys(l.baselayers).length)
                            return void a.error("[AngularJS - Leaflet] At least one baselayer has to be defined");
                        var h=!1;
                        for (var i in l.baselayers)
                            if (b.hasLayer(l.baselayers[i])) {
                                h=!0;
                                break
                            }
                        h || b.addLayer(l.baselayers[Object.keys(n.baselayers)[0]]), q = p(b, d, q, c, n.overlays, l)
                    }, !0), m.$watch("layers.overlays", function(a) {
                        for (var c in l.overlays)
                            k(a[c]) || (b.hasLayer(l.overlays[c]) && b.removeLayer(l.overlays[c]), delete l.overlays[c]);
                        for (var e in a) {
                            if (!k(l.overlays[e])) {
                                var f = o(a[e]);
                                k(f) && (l.overlays[e] = f, a[e].visible===!0 && b.addLayer(l.overlays[e]))
                            }
                            a[e].visible&&!b.hasLayer(l.overlays[e]) ? b.addLayer(l.overlays[e]) : a[e].visible===!1 && b.hasLayer(l.overlays[e]) && b.removeLayer(l.overlays[e])
                        }
                        q = p(b, d, q, n.baselayers, a, l)
                    }, !0)
                })
            }
        }
    }
    ]), angular.module("leaflet-directive").directive("bounds", ["$log", "$timeout", "leafletHelpers", "leafletBoundsHelpers", function(a, b, c, d) {
        return {
            restrict: "A",
            scope: !1,
            replace: !1,
            require: ["leaflet", "center"],
            link: function(b, e, f, g) {
                var h = c.isDefined, i = d.createLeafletBounds, j = g[0].getLeafletScope(), k = g[0], l = function(a) {
                    return 0 === a._southWest.lat && 0 === a._southWest.lng && 0 === a._northEast.lat && 0 === a._northEast.lng?!0 : !1
                };
                k.getMap().then(function(b) {
                    j.$on("boundsChanged", function(a) {
                        var c = a.currentScope, d = b.getBounds();
                        if (!l(d)) {
                            var e = {
                                northEast: {
                                    lat: d._northEast.lat,
                                    lng: d._northEast.lng
                                },
                                southWest: {
                                    lat: d._southWest.lat,
                                    lng: d._southWest.lng
                                }
                            };
                            angular.equals(c.bounds, e) || (c.bounds = e)
                        }
                    }), j.$watch("bounds", function(c) {
                        if (!h(c))
                            return void a.error("[AngularJS - Leaflet] Invalid bounds");
                        var d = i(c);
                        d&&!b.getBounds().equals(d) && b.fitBounds(d)
                    }, !0)
                })
            }
        }
    }
    ]), angular.module("leaflet-directive").directive("markers", ["$log", "$rootScope", "$q", "leafletData", "leafletHelpers", "leafletMapDefaults", "leafletMarkersHelpers", "leafletEvents", function(a, b, c, d, e, f, g, h) {
        return {
            restrict: "A",
            scope: !1,
            replace: !1,
            require: ["leaflet", "?layers"],
            link: function(b, f, i, j) {
                var k = j[0], l = e, m = e.isDefined, n = e.isString, o = k.getLeafletScope(), p = o.markers, q = g.deleteMarker, r = g.addMarkerWatcher, s = g.listenMarkerEvents, t = g.addMarkerToGroup, u = h.bindMarkerEvents, v = g.createMarker;
                k.getMap().then(function(b) {
                    var e, f = {};
                    e = m(j[1]) ? j[1].getLayers : function() {
                        var a = c.defer();
                        return a.resolve(), a.promise
                    }, m(p) && e().then(function(c) {
                        d.setMarkers(f, i.id), o.$watch("markers", function(d) {
                            for (var e in f)
                                m(d) && m(d[e]) || (q(f[e], b, c), delete f[e]);
                            for (var g in d)
                                if (-1 === g.search("-")) {
                                    if (!m(f[g])) {
                                        var h = d[g], j = v(h);
                                        if (!m(j)) {
                                            a.error("[AngularJS - Leaflet] Received invalid data on the marker " + g + ".");
                                            continue
                                        }
                                        if (f[g] = j, m(h.message) && j.bindPopup(h.message, h.popupOptions)
                                            , m(h.group) && t(j, h.group, b), l.LabelPlugin.isLoaded() && m(h.label) && m(h.label.message) && j.bindLabel(h.label.message, h.label.options), m(h) && m(h.layer)) {
                                                if (!n(h.layer)) {
                                                    a.error("[AngularJS - Leaflet] A layername must be a string");
                                                    continue
                                                }
                                                if (!m(c)) {
                                                    a.error("[AngularJS - Leaflet] You must add layers to the directive if the markers are going to use this functionality.");
                                                    continue
                                                }
                                                if (!m(c.overlays) ||!m(c.overlays[h.layer])) {
                                                    a.error('[AngularJS - Leaflet] A marker can only be added to a layer of type "group"');
                                                    continue
                                                }
                                                var k = c.overlays[h.layer];
                                                if (!(k instanceof L.LayerGroup)) {
                                                    a.error('[AngularJS - Leaflet] Adding a marker to an overlay needs a overlay of the type "group"');
                                                    continue
                                                }
                                                k.addLayer(j), b.hasLayer(j) && h.focus===!0 && j.openPopup()
                                            } else 
                                                m(h.group) || (b.addLayer(j), h.focus===!0 && j.openPopup(), l.LabelPlugin.isLoaded() && m(h.label) && m(h.label.options) && h.label.options.noHide===!0 && j.showLabel());
                                                var p=!m(i.watchMarkers) || "true" === i.watchMarkers;
                                                p && (r(j, g, o, c, b), s(j, h, o)), u(j, g, h, o)
                                            }
                            } else 
                                a.error('The marker can\'t use a "-" on his key name: "' + g + '".')
                            }, !0)
                    })
                })
            }
        }
    }
    ]), angular.module("leaflet-directive").directive("paths", ["$log", "leafletData", "leafletMapDefaults", "leafletHelpers", "leafletPathsHelpers", "leafletEvents", function(a, b, c, d, e, f) {
        return {
            restrict: "A",
            scope: !1,
            replace: !1,
            require: "leaflet",
            link: function(g, h, i, j) {
                var k = d.isDefined, l = j.getLeafletScope(), m = l.paths, n = e.createPath, o = f.bindPathEvents, p = e.setPathOptions;
                j.getMap().then(function(e) {
                    var f = c.getDefaults(i.id);
                    if (k(m)) {
                        var g = {};
                        b.setPaths(g, i.id);
                        var h = function(a, b) {
                            var c = l.$watch("paths." + b, function(b) {
                                return k(b) ? void p(a, b.type, b) : (e.removeLayer(a), void c())
                            }, !0)
                        };
                        l.$watch("paths", function(b) {
                            for (var c in b)
                                if (-1 === c.search("-")) {
                                    if (!k(g[c])) {
                                        var i = b[c], j = n(c, b[c], f);
                                        k(j) && k(i.message) && j.bindPopup(i.message), d.LabelPlugin.isLoaded() && k(i.label) && k(i.label.message) && j.bindLabel(i.label.message, i.label.options), k(j) && (g[c] = j, e.addLayer(j), h(j, c)), o(j, c, i, l)
                                    }
                                } else 
                                    a.error('[AngularJS - Leaflet] The path name "' + c + '" is not valid. It must not include "-" and a number.');
                            for (var m in g)
                                k(b[m]) || delete g[m]
                            }, !0)
                    }
                })
            }
        }
    }
    ]), angular.module("leaflet-directive").directive("controls", ["$log", "leafletHelpers", function(a, b) {
        return {
            restrict: "A",
            scope: !1,
            replace: !1,
            require: "?^leaflet",
            link: function(a, c, d, e) {
                if (e) {
                    var f = b.isDefined, g = e.getLeafletScope(), h = g.controls;
                    e.getMap().then(function(a) {
                        if (f(L.Control.Draw) && f(h.draw)) {
                            var b = new L.FeatureGroup;
                            a.addLayer(b);
                            var c = {
                                edit: {
                                    featureGroup: b
                                }
                            };
                            angular.extend(c, h.draw.options);
                            var d = new L.Control.Draw(c);
                            a.addControl(d)
                        }
                        if (f(h.custom))
                            for (var e in h.custom)
                                a.addControl(h.custom[e])
                    })
                }
            }
        }
    }
    ]), angular.module("leaflet-directive").directive("eventBroadcast", ["$log", "$rootScope", "leafletHelpers", "leafletEvents", function(a, b, c, d) {
        return {
            restrict: "A",
            scope: !1,
            replace: !1,
            require: "leaflet",
            link: function(b, e, f, g) {
                var h = c.isObject, i = g.getLeafletScope(), j = i.eventBroadcast, k = d.getAvailableMapEvents(), l = d.genDispatchMapEvent;
                g.getMap().then(function(b) {
                    var c, d, e = [], f = "broadcast";
                    if (h(j)) {
                        if (void 0 === j.map || null === j.map)
                            e = k;
                        else if ("object" != typeof j.map)
                            a.warn("[AngularJS - Leaflet] event-broadcast.map must be an object check your model.");
                        else {
                            void 0 !== j.map.logic && null !== j.map.logic && ("emit" !== j.map.logic && "broadcast" !== j.map.logic ? a.warn("[AngularJS - Leaflet] Available event propagation logic are: 'emit' or 'broadcast'.") : "emit" === j.map.logic && (f = "emit"));
                            var g=!1, m=!1;
                            if (void 0 !== j.map.enable && null !== j.map.enable && "object" == typeof j.map.enable && (g=!0)
                                , void 0 !== j.map.disable && null !== j.map.disable && "object" == typeof j.map.disable && (m=!0), g && m)a.warn("[AngularJS - Leaflet] can not enable and disable events at the time");
                            else if (g || m)
                                if (g)
                                    for (c = 0; c < j.map.enable.length; c++)
                                        d = j.map.enable[c], -1 !== e.indexOf(d) ? a.warn("[AngularJS - Leaflet] This event " + d + " is already enabled") : -1 === k.indexOf(d) ? a.warn("[AngularJS - Leaflet] This event " + d + " does not exist") : e.push(d);
                                else 
                                    for (e = k, c = 0; c < j.map.disable.length; c++) {
                                        d = j.map.disable[c];
                                        var n = e.indexOf(d);
                                        -1 === n ? a.warn("[AngularJS - Leaflet] This event " + d + " does not exist or has been already disabled") : e.splice(n, 1)
                                    } else 
                                        a.warn("[AngularJS - Leaflet] must enable or disable events")
                                    }
                        for (c = 0; c < e.length; c++)
                            d = e[c], b.on(d, l(i, d, f), {
                            eventName: d
                        })
                    } else 
                        a.warn("[AngularJS - Leaflet] event-broadcast must be an object, check your model.")
                        })
            }
        }
    }
    ]), angular.module("leaflet-directive").directive("maxbounds", ["$log", "leafletMapDefaults", "leafletBoundsHelpers", function(a, b, c) {
        return {
            restrict: "A",
            scope: !1,
            replace: !1,
            require: "leaflet",
            link: function(a, b, d, e) {
                var f = e.getLeafletScope(), g = c.isValidBounds;
                e.getMap().then(function(a) {
                    f.$watch("maxbounds", function(b) {
                        if (!g(b))
                            return void a.setMaxBounds();
                        var c = [[b.southWest.lat, b.southWest.lng], [b.northEast.lat, b.northEast.lng]];
                        a.setMaxBounds(c), a.fitBounds(c)
                    })
                })
            }
        }
    }
    ]), angular.module("leaflet-directive").service("leafletData", ["$log", "$q", "leafletHelpers", function(a, b, c) {
        var d = c.getDefer, e = c.getUnresolvedDefer, f = c.setResolvedDefer, g = {}, h = {}, i = {}, j = {}, k = {}, l = {};
        this.setMap = function(a, b) {
            var c = e(g, b);
            c.resolve(a), f(g, b)
        }, this.getMap = function(a) {
            var b = d(g, a);
            return b.promise
        }, this.unresolveMap = function(a) {
            var b = c.obtainEffectiveMapId(g, a);
            g[b] = void 0
        }, this.getPaths = function(a) {
            var b = d(j, a);
            return b.promise
        }, this.setPaths = function(a, b) {
            var c = e(j, b);
            c.resolve(a), f(j, b)
        }, this.getMarkers = function(a) {
            var b = d(k, a);
            return b.promise
        }, this.setMarkers = function(a, b) {
            var c = e(k, b);
            c.resolve(a), f(k, b)
        }, this.getLayers = function(a) {
            var b = d(i, a);
            return b.promise
        }, this.setLayers = function(a, b) {
            var c = e(i, b);
            c.resolve(a), f(i, b)
        }, this.setTiles = function(a, b) {
            var c = e(h, b);
            c.resolve(a), f(h, b)
        }, this.getTiles = function(a) {
            var b = d(h, a);
            return b.promise
        }, this.setGeoJSON = function(a, b) {
            var c = e(l, b);
            c.resolve(a), f(l, b)
        }, this.getGeoJSON = function(a) {
            var b = d(l, a);
            return b.promise
        }
    }
    ]), angular.module("leaflet-directive").factory("leafletMapDefaults", ["$q", "leafletHelpers", function(a, b) {
        function c() {
            return {
                keyboard: !0,
                dragging: !0,
                worldCopyJump: !1,
                doubleClickZoom: !0,
                scrollWheelZoom: !0,
                zoomControl: !0,
                zoomsliderControl: !1,
                zoomControlPosition: "topleft",
                attributionControl: !0,
                controls: {
                    layers: {
                        visible: !0,
                        position: "topright",
                        collapsed: !0
                    }
                },
                crs: L.CRS.EPSG3857,
                tileLayer: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                tileLayerOptions: {
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                },
                path: {
                    weight: 10,
                    opacity: 1,
                    color: "#0000ff"
                },
                center: {
                    lat: 0,
                    lng: 0,
                    zoom: 1
                }
            }
        }
        var d = b.isDefined, e = b.obtainEffectiveMapId, f = {};
        return {
            getDefaults: function(a) {
                var b = e(f, a);
                return f[b]
            },
            getMapCreationDefaults: function(a) {
                var b = e(f, a), c = f[b], g = {
                    maxZoom: c.maxZoom,
                    keyboard: c.keyboard,
                    dragging: c.dragging,
                    zoomControl: c.zoomControl,
                    doubleClickZoom: c.doubleClickZoom,
                    scrollWheelZoom: c.scrollWheelZoom,
                    attributionControl: c.attributionControl,
                    worldCopyJump: c.worldCopyJump,
                    crs: c.crs
                };
                return d(c.minZoom) && (g.minZoom = c.minZoom), d(c.zoomAnimation) && (g.zoomAnimation = c.zoomAnimation), d(c.fadeAnimation) && (g.fadeAnimation = c.fadeAnimation), d(c.markerZoomAnimation) && (g.markerZoomAnimation = c.markerZoomAnimation), g
            },
            setDefaults: function(a, b) {
                var g = c();
                d(a) && (g.doubleClickZoom = d(a.doubleClickZoom) ? a.doubleClickZoom : g.doubleClickZoom, g.scrollWheelZoom = d(a.scrollWheelZoom) ? a.scrollWheelZoom : g.doubleClickZoom, g.zoomControl = d(a.zoomControl) ? a.zoomControl : g.zoomControl, g.zoomsliderControl = d(a.zoomsliderControl) ? a.zoomsliderControl : g.zoomsliderControl, g.attributionControl = d(a.attributionControl) ? a.attributionControl : g.attributionControl, g.tileLayer = d(a.tileLayer) ? a.tileLayer : g.tileLayer, g.zoomControlPosition = d(a.zoomControlPosition) ? a.zoomControlPosition : g.zoomControlPosition, g.keyboard = d(a.keyboard) ? a.keyboard : g.keyboard, g.dragging = d(a.dragging) ? a.dragging : g.dragging, d(a.controls) && angular.extend(g.controls, a.controls), d(a.crs) && d(L.CRS[a.crs]) && (g.crs = L.CRS[a.crs]), d(a.tileLayerOptions) && angular.copy(a.tileLayerOptions, g.tileLayerOptions), d(a.maxZoom) && (g.maxZoom = a.maxZoom), d(a.minZoom) && (g.minZoom = a.minZoom), d(a.zoomAnimation) && (g.zoomAnimation = a.zoomAnimation), d(a.fadeAnimation) && (g.fadeAnimation = a.fadeAnimation), d(a.markerZoomAnimation) && (g.markerZoomAnimation = a.markerZoomAnimation), d(a.worldCopyJump) && (g.worldCopyJump = a.worldCopyJump));
                var h = e(f, b);
                return f[h] = g, g
            }
        }
    }
    ]), angular.module("leaflet-directive").factory("leafletEvents", ["$rootScope", "$q", "$log", "leafletHelpers", function(a, b, c, d) {
        var e = d.safeApply, f = d.isDefined, g = d.isObject, h = d, i = function() {
            return ["click", "dblclick", "mousedown", "mouseover", "mouseout", "contextmenu"]
        }, j = function(a, b, c, d) {
            for (var e = i(), f = "markers." + d, g = 0; g < e.length; g++) {
                var h = e[g];
                c.label.on(h, m(a, h, b, c.label, f))
            }
        }, k = function(b, c, d, f, g, h) {
            return function(i) {
                var j = "leafletDirectiveMarker." + b;
                "click" === b ? e(d, function() {
                    a.$broadcast("leafletDirectiveMarkersClick", g)
                }) : "dragend" === b && (e(d, function() {
                    h.lat = f.getLatLng().lat, h.lng = f.getLatLng().lng
                }), h.message && h.focus===!0 && f.openPopup()), e(d, function(b) {
                    "emit" === c ? b.$emit(j, {
                        markerName: g,
                        leafletEvent: i
                    }) : a.$broadcast(j, {
                        markerName: g,
                        leafletEvent: i
                    })
                })
            }
        }, l = function(b, c, d, f, g) {
            return function(f) {
                var h = "leafletDirectivePath." + b;
                e(d, function(b) {
                    "emit" === c ? b.$emit(h, {
                        pathName: g,
                        leafletEvent: f
                    }) : a.$broadcast(h, {
                        pathName: g,
                        leafletEvent: f
                    })
                })
            }
        }, m = function(b, c, d, f, g) {
            return function(h) {
                var i = "leafletDirectiveLabel." + c, j = g.replace("markers.", "");
                e(b, function(b) {
                    "emit" === d ? b.$emit(i, {
                        leafletEvent: h,
                        label: f,
                        markerName: j
                    }) : "broadcast" === d && a.$broadcast(i, {
                        leafletEvent: h,
                        label: f,
                        markerName: j
                    })
                })
            }
        }, n = function() {
            return ["click", "dblclick", "mousedown", "mouseover", "mouseout", "contextmenu", "dragstart", "drag", "dragend", "move", "remove", "popupopen", "popupclose"]
        }, o = function() {
            return ["click", "dblclick", "mousedown", "mouseover", "mouseout", "contextmenu", "add", "remove", "popupopen", "popupclose"]
        };
        return {
            getAvailableMapEvents: function() {
                return ["click", "dblclick", "mousedown", "mouseup", "mouseover", "mouseout", "mousemove", "contextmenu", "focus", "blur", "preclick", "load", "unload", "viewreset", "movestart", "move", "moveend", "dragstart", "drag", "dragend", "zoomstart", "zoomend", "zoomlevelschange", "resize", "autopanstart", "layeradd", "layerremove", "baselayerchange", "overlayadd", "overlayremove", "locationfound", "locationerror", "popupopen", "popupclose", "draw:created", "draw:edited", "draw:deleted", "draw:drawstart", "draw:drawstop", "draw:editstart", "draw:editstop", "draw:deletestart", "draw:deletestop"]
            },
            genDispatchMapEvent: function(b, c, d) {
                return function(f) {
                    var g = "leafletDirectiveMap." + c;
                    e(b, function(b) {
                        "emit" === d ? b.$emit(g, {
                            leafletEvent: f
                        }) : "broadcast" === d && a.$broadcast(g, {
                            leafletEvent: f
                        })
                    })
                }
            },
            getAvailableMarkerEvents: n,
            getAvailablePathEvents: o,
            notifyCenterChangedToBounds: function(a) {
                a.$broadcast("boundsChanged")
            },
            notifyCenterUrlHashChanged: function(a, b, c, d) {
                if (f(c.urlHashCenter)) {
                    var e = b.getCenter(), g = e.lat.toFixed(4) + ":" + e.lng.toFixed(4) + ":" + b.getZoom();
                    f(d.c) && d.c === g || a.$emit("centerUrlHash", g)
                }
            },
            bindMarkerEvents: function(a, b, d, e) {
                var i, l, m = [], o = "broadcast";
                if (f(e.eventBroadcast))
                    if (g(e.eventBroadcast))
                        if (f(e.eventBroadcast.marker))
                            if (g(e.eventBroadcast.marker)) {
                                void 0 !== e.eventBroadcast.marker.logic && null !== e.eventBroadcast.marker.logic && ("emit" !== e.eventBroadcast.marker.logic && "broadcast" !== e.eventBroadcast.marker.logic ? c.warn("[AngularJS - Leaflet] Available event propagation logic are: 'emit' or 'broadcast'.") : "emit" === e.eventBroadcast.marker.logic && (o = "emit"));
                                var p=!1, q=!1;
                                if (void 0 !== e.eventBroadcast.marker.enable && null !== e.eventBroadcast.marker.enable && "object" == typeof e.eventBroadcast.marker.enable && (p=!0)
                                    , void 0 !== e.eventBroadcast.marker.disable && null !== e.eventBroadcast.marker.disable && "object" == typeof e.eventBroadcast.marker.disable && (q=!0), p && q)c.warn("[AngularJS - Leaflet] can not enable and disable events at the same time");
                                else if (p || q)
                                    if (p)
                                        for (i = 0; i < e.eventBroadcast.marker.enable.length; i++)
                                            l = e.eventBroadcast.marker.enable[i], -1 !== m.indexOf(l) ? c.warn("[AngularJS - Leaflet] This event " + l + " is already enabled") : -1 === n().indexOf(l) ? c.warn("[AngularJS - Leaflet] This event " + l + " does not exist") : m.push(l);
                                    else 
                                        for (m = n(), i = 0; i < e.eventBroadcast.marker.disable.length; i++) {
                                            l = e.eventBroadcast.marker.disable[i];
                                            var r = m.indexOf(l);
                                            -1 === r ? c.warn("[AngularJS - Leaflet] This event " + l + " does not exist or has been already disabled") : m.splice(r, 1)
                                        } else 
                                            c.warn("[AngularJS - Leaflet] must enable or disable events")
                                    } else 
                                        c.warn("[AngularJS - Leaflet] event-broadcast.marker must be an object check your model.");
                else 
                    m = n();
                else 
                    c.error("[AngularJS - Leaflet] event-broadcast must be an object check your model.");
                else 
                    m = n();
                for (i = 0; i < m.length; i++)
                    l = m[i], a.on(l, k(l, o, e, a, b, d));
                h.LabelPlugin.isLoaded() && f(a.label) && j(e, o, a, b)
            },
            bindPathEvents: function(a, b, d, e) {
                var i, k, m = [], n = "broadcast";
                if (window.lls = e, f(e.eventBroadcast)
                    )if (g(e.eventBroadcast))
                    if (f(e.eventBroadcast.path))
                        if (g(e.eventBroadcast.paths))
                            c.warn("[AngularJS - Leaflet] event-broadcast.path must be an object check your model.");
                        else {
                            void 0 !== e.eventBroadcast.path.logic && null !== e.eventBroadcast.path.logic && ("emit" !== e.eventBroadcast.path.logic && "broadcast" !== e.eventBroadcast.path.logic ? c.warn("[AngularJS - Leaflet] Available event propagation logic are: 'emit' or 'broadcast'.") : "emit" === e.eventBroadcast.path.logic && (n = "emit"));
                            var p=!1, q=!1;
                            if (void 0 !== e.eventBroadcast.path.enable && null !== e.eventBroadcast.path.enable && "object" == typeof e.eventBroadcast.path.enable && (p=!0)
                                , void 0 !== e.eventBroadcast.path.disable && null !== e.eventBroadcast.path.disable && "object" == typeof e.eventBroadcast.path.disable && (q=!0), p && q)c.warn("[AngularJS - Leaflet] can not enable and disable events at the same time");
                            else if (p || q)
                                if (p)
                                    for (i = 0; i < e.eventBroadcast.path.enable.length; i++)
                                        k = e.eventBroadcast.path.enable[i], -1 !== m.indexOf(k) ? c.warn("[AngularJS - Leaflet] This event " + k + " is already enabled") : -1 === o().indexOf(k) ? c.warn("[AngularJS - Leaflet] This event " + k + " does not exist") : m.push(k);
                                else 
                                    for (m = o(), i = 0; i < e.eventBroadcast.path.disable.length; i++) {
                                        k = e.eventBroadcast.path.disable[i];
                                        var r = m.indexOf(k);
                                        -1 === r ? c.warn("[AngularJS - Leaflet] This event " + k + " does not exist or has been already disabled") : m.splice(r, 1)
                                    } else 
                                        c.warn("[AngularJS - Leaflet] must enable or disable events")
                                } else 
                                    m = o();
                else 
                    c.error("[AngularJS - Leaflet] event-broadcast must be an object check your model.");
                else 
                    m = o();
                for (i = 0; i < m.length; i++)
                    k = m[i], a.on(k, l(k, n, e, m, b));
                h.LabelPlugin.isLoaded() && f(a.label) && j(e, n, a, b)
            }
        }
    }
    ]), angular.module("leaflet-directive").factory("leafletLayerHelpers", ["$rootScope", "$log", "leafletHelpers", function($rootScope, $log, leafletHelpers) {
        function isValidLayerType(a) {
            return isString(a.type)?-1 === Object.keys(layerTypes).indexOf(a.type) ? ($log.error("[AngularJS - Leaflet] A layer must have a valid type: " + Object.keys(layerTypes)), !1) : layerTypes[a.type].mustHaveUrl&&!isString(a.url) ? ($log.error("[AngularJS - Leaflet] A base layer must have an url"), !1) : layerTypes[a.type].mustHaveData&&!isDefined(a.data) ? ($log.error('[AngularJS - Leaflet] The base layer must have a "data" array attribute'), !1) : layerTypes[a.type].mustHaveLayer&&!isDefined(a.layer) ? ($log.error("[AngularJS - Leaflet] The type of layer " + a.type + " must have an layer defined"), !1) : layerTypes[a.type].mustHaveBounds&&!isDefined(a.bounds) ? ($log.error("[AngularJS - Leaflet] The type of layer " + a.type + " must have bounds defined"), !1) : !0 : !1
        }
        var Helpers = leafletHelpers, isString = leafletHelpers.isString, isObject = leafletHelpers.isObject, isDefined = leafletHelpers.isDefined, layerTypes = {
            xyz: {
                mustHaveUrl: !0,
                createLayer: function(a) {
                    return L.tileLayer(a.url, a.options)
                }
            },
            geoJSON: {
                mustHaveUrl: !0,
                createLayer: function(a) {
                    return Helpers.GeoJSONPlugin.isLoaded() ? new L.TileLayer.GeoJSON(a.url, a.pluginOptions, a.options) : void 0
                }
            },
            wms: {
                mustHaveUrl: !0,
                createLayer: function(a) {
                    return L.tileLayer.wms(a.url, a.options)
                }
            },
            wmts: {
                mustHaveUrl: !0,
                createLayer: function(a) {
                    return L.tileLayer.wmts(a.url, a.options)
                }
            },
            wfs: {
                mustHaveUrl: !0,
                mustHaveLayer: !0,
                createLayer: function(params) {
                    if (Helpers.WFSLayerPlugin.isLoaded()) {
                        var options = angular.copy(params.options);
                        return options.crs && "string" == typeof options.crs && (options.crs = eval(options.crs)), new L.GeoJSON.WFS(params.url, params.layer, options)
                    }
                }
            },
            group: {
                mustHaveUrl: !1,
                createLayer: function() {
                    return L.layerGroup()
                }
            },
            google: {
                mustHaveUrl: !1,
                createLayer: function(a) {
                    var b = a.type || "SATELLITE";
                    if (Helpers.GoogleLayerPlugin.isLoaded())
                        return new L.Google(b, a.options)
                }
            },
            china: {
                mustHaveUrl: !1,
                createLayer: function(a) {
                    var b = a.type || "";
                    if (Helpers.ChinaLayerPlugin.isLoaded())
                        return L.tileLayer.chinaProvider(b, a.options)
                        }
                        },
            ags: {
                mustHaveUrl: !0,
                createLayer: function(a) {
                    if (Helpers.AGSLayerPlugin.isLoaded()) {
                        var b = angular.copy(a.options);
                        angular.extend(b, {
                            url: a.url
                        });
                        var c = new lvector.AGS(b);
                        return c.onAdd = function(a) {
                            this.setMap(a)
                        }, c.onRemove = function() {
                            this.setMap(null)
                        }, c
                    }
                }
            },
            dynamic: {
                mustHaveUrl: !0,
                createLayer: function(a) {
                    return Helpers.DynamicMapLayerPlugin.isLoaded() ? L.esri.dynamicMapLayer(a.url, a.options) : void 0
                }
            },
            markercluster: {
                mustHaveUrl: !1,
                createLayer: function(a) {
                    return Helpers.MarkerClusterPlugin.isLoaded() ? new L.MarkerClusterGroup(a.options) : void $log.error("[AngularJS - Leaflet] The markercluster plugin is not loaded.")
                }
            },
            bing: {
                mustHaveUrl: !1,
                createLayer: function(a) {
                    return Helpers.BingLayerPlugin.isLoaded() ? new L.BingLayer(a.key, a.options) : void 0
                }
            },
            heatmap: {
                mustHaveUrl: !1,
                mustHaveData: !0,
                createLayer: function(a) {
                    if (Helpers.HeatMapLayerPlugin.isLoaded()) {
                        var b = new L.TileLayer.WebGLHeatMap(a.options);
                        return isDefined(a.data) && b.setData(a.data), b
                    }
                }
            },
            yandex: {
                mustHaveUrl: !1,
                createLayer: function(a) {
                    var b = a.type || "map";
                    if (Helpers.YandexLayerPlugin.isLoaded())
                        return new L.Yandex(b, a.options)
                }
            },
            imageOverlay: {
                mustHaveUrl: !0,
                mustHaveBounds: !0,
                createLayer: function(a) {
                    return L.imageOverlay(a.url, a.bounds, a.options)
                }
            }
        };
        return {
            createLayer: function(a) {
                if (isValidLayerType(a)) {
                    if (!isString(a.name))
                        return void $log.error("[AngularJS - Leaflet] A base layer must have a name");
                    isObject(a.layerParams) || (a.layerParams = {}), isObject(a.layerOptions) || (a.layerOptions = {});
                    for (var b in a.layerParams)
                        a.layerOptions[b] = a.layerParams[b];
                    var c = {
                        url: a.url,
                        data: a.data,
                        options: a.layerOptions,
                        layer: a.layer,
                        type: a.layerType,
                        bounds: a.bounds,
                        key: a.key,
                        pluginOptions: a.pluginOptions
                    };
                    return layerTypes[a.type].createLayer(c)
                }
            }
        }
    }
    ]), angular.module("leaflet-directive").factory("leafletControlHelpers", ["$rootScope", "$log", "leafletHelpers", "leafletMapDefaults", function(a, b, c, d) {
        var e, f = c.isObject, g = c.isDefined, h = function(a, b) {
            var c = 0;
            return f(a) && (c += Object.keys(a).length), f(b) && (c += Object.keys(b).length), c > 1
        }, i = function(a) {
            var b, c = d.getDefaults(a), e = {
                collapsed: c.controls.layers.collapsed,
                position: c.controls.layers.position
            };
            return b = c.controls.layers && g(c.controls.layers.control) ? c.controls.layers.control.apply(this, [[], [], e]) : new L.control.layers([], [], e)
        };
        return {
            layersControlMustBeVisible: h,
            updateLayersControl: function(a, b, c, d, f, j) {
                var k, l = h(d, f);
                if (g(e) && c) {
                    for (k in j.baselayers)
                        e.removeLayer(j.baselayers[k]);
                    for (k in j.overlays)
                        e.removeLayer(j.overlays[k]);
                    e.removeFrom(a)
                }
                if (l) {
                    e = i(b);
                    for (k in d)
                        g(j.baselayers[k]) && e.addBaseLayer(j.baselayers[k], d[k].name);
                    for (k in f)
                        g(j.overlays[k]) && e.addOverlay(j.overlays[k], f[k].name);
                    e.addTo(a)
                }
                return l
            }
        }
    }
    ]), angular.module("leaflet-directive").factory("leafletLegendHelpers", function() {
        var a = function(a, b) {
            if (a.innerHTML = "", b.error)
                a.innerHTML += '<div class="info-title alert alert-danger">' + b.error.message + "</div>";
            else 
                for (var c = 0; c < b.layers.length; c++) {
                    var d = b.layers[c];
                    a.innerHTML += '<div class="info-title">' + d.layerName + "</div>";
                    for (var e = 0; e < d.legend.length; e++) {
                        var f = d.legend[e];
                        a.innerHTML += '<div class="inline"><img src="data:' + f.contentType + ";base64," + f.imageData + '" /></div><div class="info-label">' + f.label + "</div>"
                    }
                }
        }, b = function(b, c) {
            return function() {
                var d = L.DomUtil.create("div", c);
                return L.Browser.touch ? L.DomEvent.on(d, "click", L.DomEvent.stopPropagation) : (L.DomEvent.disableClickPropagation(d), L.DomEvent.on(d, "mousewheel", L.DomEvent.stopPropagation)), a(d, b), d
            }
        }, c = function(a, b) {
            return function() {
                for (var c = L.DomUtil.create("div", b), d = 0; d < a.colors.length; d++)
                    c.innerHTML += '<div class="outline"><i style="background:' + a.colors[d] + '"></i></div><div class="info-label">' + a.labels[d] + "</div>";
                return L.Browser.touch ? L.DomEvent.on(c, "click", L.DomEvent.stopPropagation) : (L.DomEvent.disableClickPropagation(c), L.DomEvent.on(c, "mousewheel", L.DomEvent.stopPropagation)), c
            }
        };
        return {
            getOnAddArcGISLegend: b,
            getOnAddArrayLegend: c,
            updateArcGISLegend: a
        }
    }), angular.module("leaflet-directive").factory("leafletPathsHelpers", ["$rootScope", "$log", "leafletHelpers", function(a, b, c) {
        function d(a) {
            return a.filter(function(a) {
                return k(a)
            }).map(function(a) {
                return new L.LatLng(a.lat, a.lng)
            })
        }
        function e(a) {
            return new L.LatLng(a.lat, a.lng)
        }
        function f(a) {
            return a.map(function(a) {
                return d(a)
            })
        }
        function g(a, b) {
            for (var c = ["stroke", "weight", "color", "opacity", "fill", "fillColor", "fillOpacity", "dashArray", "lineCap", "lineJoin", "clickable", "pointerEvents", "className", "smoothFactor", "noClip"], d = {}, e = 0; e < c.length; e++) {
                var f = c[e];
                h(a[f]) ? d[f] = a[f] : h(b.path[f]) && (d[f] = b.path[f])
            }
            return d
        }
        var h = c.isDefined, i = c.isArray, j = c.isNumber, k = c.isValidPoint, l = function(a, b) {
            h(b.weight) && a.setStyle({
                weight: b.weight
            }), h(b.color) && a.setStyle({
                color: b.color
            }), h(b.opacity) && a.setStyle({
                opacity: b.opacity
            })
        }, m = function(a) {
            if (!i(a))
                return !1;
            for (var b in a) {
                var c = a[b];
                if (!k(c))
                    return !1
            }
            return !0
        }, n = {
            polyline: {
                isValid: function(a) {
                    var b = a.latlngs;
                    return m(b)
                },
                createPath: function(a) {
                    return new L.Polyline([], a)
                },
                setPath: function(a, b) {
                    a.setLatLngs(d(b.latlngs)), l(a, b)
                }
            },
            multiPolyline: {
                isValid: function(a) {
                    var b = a.latlngs;
                    if (!i(b))
                        return !1;
                    for (var c in b) {
                        var d = b[c];
                        if (!m(d))
                            return !1
                    }
                    return !0
                },
                createPath: function(a) {
                    return new L.multiPolyline([[[0, 0], [1, 1]]], a)
                },
                setPath: function(a, b) {
                    a.setLatLngs(f(b.latlngs)), l(a, b)
                }
            },
            polygon: {
                isValid: function(a) {
                    var b = a.latlngs;
                    return m(b)
                },
                createPath: function(a) {
                    return new L.Polygon([], a)
                },
                setPath: function(a, b) {
                    a.setLatLngs(d(b.latlngs)), l(a, b)
                }
            },
            multiPolygon: {
                isValid: function(a) {
                    var b = a.latlngs;
                    if (!i(b))
                        return !1;
                    for (var c in b) {
                        var d = b[c];
                        if (!m(d))
                            return !1
                    }
                    return !0
                },
                createPath: function(a) {
                    return new L.MultiPolygon([[[0, 0], [1, 1], [0, 1]]], a)
                },
                setPath: function(a, b) {
                    a.setLatLngs(f(b.latlngs)), l(a, b)
                }
            },
            rectangle: {
                isValid: function(a) {
                    var b = a.latlngs;
                    if (!i(b) || 2 !== b.length)
                        return !1;
                    for (var c in b) {
                        var d = b[c];
                        if (!k(d))
                            return !1
                    }
                    return !0
                },
                createPath: function(a) {
                    return new L.Rectangle([[0, 0], [1, 1]], a)
                },
                setPath: function(a, b) {
                    a.setBounds(new L.LatLngBounds(d(b.latlngs))), l(a, b)
                }
            },
            circle: {
                isValid: function(a) {
                    var b = a.latlngs;
                    return k(b) && j(a.radius)
                },
                createPath: function(a) {
                    return new L.Circle([0, 0], 1, a)
                },
                setPath: function(a, b) {
                    a.setLatLng(e(b.latlngs)), h(b.radius) && a.setRadius(b.radius), l(a, b)
                }
            },
            circleMarker: {
                isValid: function(a) {
                    var b = a.latlngs;
                    return k(b) && j(a.radius)
                },
                createPath: function(a) {
                    return new L.CircleMarker([0, 0], a)
                },
                setPath: function(a, b) {
                    a.setLatLng(e(b.latlngs)), h(b.radius) && a.setRadius(b.radius), l(a, b)
                }
            }
        }, o = function(a) {
            var b = {};
            return a.latlngs && (b.latlngs = a.latlngs), a.radius && (b.radius = a.radius), b
        };
        return {
            setPathOptions: function(a, b, c) {
                h(b) || (b = "polyline"), n[b].setPath(a, c)
            },
            createPath: function(a, c, d) {
                h(c.type) || (c.type = "polyline");
                var e = g(c, d), f = o(c);
                return n[c.type].isValid(f) ? n[c.type].createPath(e) : void b.error("[AngularJS - Leaflet] Invalid data passed to the " + c.type + " path")
            }
        }
    }
    ]), angular.module("leaflet-directive").factory("leafletBoundsHelpers", ["$log", "leafletHelpers", function(a, b) {
        function c(a) {
            return angular.isDefined(a) && angular.isDefined(a.southWest) && angular.isDefined(a.northEast) && angular.isNumber(a.southWest.lat) && angular.isNumber(a.southWest.lng) && angular.isNumber(a.northEast.lat) && angular.isNumber(a.northEast.lng)
        }
        var d = b.isArray, e = b.isNumber;
        return {
            createLeafletBounds: function(a) {
                return c(a) ? L.latLngBounds([a.southWest.lat, a.southWest.lng], [a.northEast.lat, a.northEast.lng]) : void 0
            },
            isValidBounds: c,
            createBoundsFromArray: function(b) {
                return d(b) && 2 === b.length && d(b[0]) && d(b[1]) && 2 === b[0].length && 2 === b[1].length && e(b[0][0]) && e(b[0][1]) && e(b[1][0]) && e(b[1][1]) ? {
                    northEast: {
                        lat: b[0][0],
                        lng: b[0][1]
                    },
                    southWest: {
                        lat: b[1][0],
                        lng: b[1][1]
                    }
                } : void a.error("[AngularJS - Leaflet] The bounds array is not valid.")
            }
        }
    }
    ]), angular.module("leaflet-directive").factory("leafletMarkersHelpers", ["$rootScope", "leafletHelpers", "$log", function(a, b, c) {
        var d = b.isDefined, e = b.MarkerClusterPlugin, f = b.AwesomeMarkersPlugin, g = b.safeApply, h = b, i = b.isString, j = b.isNumber, k = b.isObject, l = {}, m = function(a) {
            if (d(a) && d(a.type) && "awesomeMarker" === a.type)
                return f.isLoaded() || c.error("[AngularJS - Leaflet] The AwesomeMarkers Plugin is not loaded."), new L.AwesomeMarkers.icon(a);
            if (d(a) && d(a.type) && "div" === a.type)
                return new L.divIcon(a);
            var b = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAGmklEQVRYw7VXeUyTZxjvNnfELFuyIzOabermMZEeQC/OclkO49CpOHXOLJl/CAURuYbQi3KLgEhbrhZ1aDwmaoGqKII6odATmH/scDFbdC7LvFqOCc+e95s2VG50X/LLm/f4/Z7neY/ne18aANCmAr5E/xZf1uDOkTcGcWR6hl9247tT5U7Y6SNvWsKT63P58qbfeLJG8M5qcgTknrvvrdDbsT7Ml+tv82X6vVxJE33aRmgSyYtcWVMqX97Yv2JvW39UhRE2HuyBL+t+gK1116ly06EeWFNlAmHxlQE0OMiV6mQCScusKRlhS3QLeVJdl1+23h5dY4FNB3thrbYboqptEFlphTC1hSpJnbRvxP4NWgsE5Jyz86QNNi/5qSUTGuFk1gu54tN9wuK2wc3o+Wc13RCmsoBwEqzGcZsxsvCSy/9wJKf7UWf1mEY8JWfewc67UUoDbDjQC+FqK4QqLVMGGR9d2wurKzqBk3nqIT/9zLxRRjgZ9bqQgub+DdoeCC03Q8j+0QhFhBHR/eP3U/zCln7Uu+hihJ1+bBNffLIvmkyP0gpBZWYXhKussK6mBz5HT6M1Nqpcp+mBCPXosYQfrekGvrjewd59/GvKCE7TbK/04/ZV5QZYVWmDwH1mF3xa2Q3ra3DBC5vBT1oP7PTj4C0+CcL8c7C2CtejqhuCnuIQHaKHzvcRfZpnylFfXsYJx3pNLwhKzRAwAhEqG0SpusBHfAKkxw3w4627MPhoCH798z7s0ZnBJ/MEJbZSbXPhER2ih7p2ok/zSj2cEJDd4CAe+5WYnBCgR2uruyEw6zRoW6/DWJ/OeAP8pd/BGtzOZKpG8oke0SX6GMmRk6GFlyAc59K32OTEinILRJRchah8HQwND8N435Z9Z0FY1EqtxUg+0SO6RJ/mmXz4VuS+DpxXC3gXmZwIL7dBSH4zKE50wESf8qwVgrP1EIlTO5JP9Igu0aexdh28F1lmAEGJGfh7jE6ElyM5Rw/FDcYJjWhbeiBYoYNIpc2FT/SILivp0F1ipDWk4BIEo2VuodEJUifhbiltnNBIXPUFCMpthtAyqws/BPlEF/VbaIxErdxPphsU7rcCp8DohC+GvBIPJS/tW2jtvTmmAeuNO8BNOYQeG8G/2OzCJ3q+soYB5i6NhMaKr17FSal7GIHheuV3uSCY8qYVuEm1cOzqdWr7ku/R0BDoTT+DT+ohCM6/CCvKLKO4RI+dXPeAuaMqksaKrZ7L3FE5FIFbkIceeOZ2OcHO6wIhTkNo0ffgjRGxEqogXHYUPHfWAC/lADpwGcLRY3aeK4/oRGCKYcZXPVoeX/kelVYY8dUGf8V5EBRbgJXT5QIPhP9ePJi428JKOiEYhYXFBqou2Guh+p/mEB1/RfMw6rY7cxcjTrneI1FrDyuzUSRm9miwEJx8E/gUmqlyvHGkneiwErR21F3tNOK5Tf0yXaT+O7DgCvALTUBXdM4YhC/IawPU+2PduqMvuaR6eoxSwUk75ggqsYJ7VicsnwGIkZBSXKOUww73WGXyqP+J2/b9c+gi1YAg/xpwck3gJuucNrh5JvDPvQr0WFXf0piyt8f8/WI0hV4pRxxkQZdJDfDJNOAmM0Ag8jyT6hz0WGXWuP94Yh2jcfjmXAGvHCMslRimDHYuHuDsy2QtHuIavznhbYURq5R57KpzBBRZKPJi8eQg48h4j8SDdowifdIrEVdU+gbO6QNvRRt4ZBthUaZhUnjlYObNagV3keoeru3rU7rcuceqU1mJBxy+BWZYlNEBH+0eH4vRiB+OYybU2hnblYlTvkHinM4m54YnxSyaZYSF6R3jwgP7udKLGIX6r/lbNa9N6y5MFynjWDtrHd75ZvTYAPO/6RgF0k76mQla3FGq7dO+cH8sKn0Vo7nDllwAhqwLPkxrHwWmHJOo+AKJ4rab5OgrM7rVu8eWb2Pu0Dh4eDgXoOfvp7Y7QeqknRmvcTBEyq9m/HQQSCSz6LHq3z0yzsNySRfMS253wl2KyRDbcZPcfJKjZmSEOjcxyi+Y8dUOtsIEH6R2wNykdqrkYJ0RV92H0W58pkfQk7cKevsLK10Py8SdMGfXNXATY+pPbyJR/ET6n9nIfztNtZYRV9XniQu9IA2vOVgy4ir7GCLVmmd+zjkH0eAF9Po6K61pmCXHxU5rHMYd1ftc3owjwRSVRzLjKvqZEty6cRUD7jGqiOdu5HG6MdHjNcNYGqfDm5YRzLBBCCDl/2bk8a8gdbqcfwECu62Fg/HrggAAAABJRU5ErkJggg==", e = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAYAAACoYAD2AAAC5ElEQVRYw+2YW4/TMBCF45S0S1luXZCABy5CgLQgwf//S4BYBLTdJLax0fFqmB07nnQfEGqkIydpVH85M+NLjPe++dcPc4Q8Qh4hj5D/AaQJx6H/4TMwB0PeBNwU7EGQAmAtsNfAzoZkgIa0ZgLMa4Aj6CxIAsjhjOCoL5z7Glg1JAOkaicgvQBXuncwJAWjksLtBTWZe04CnYRktUGdilALppZBOgHGZcBzL6OClABvMSVIzyBjazOgrvACf1ydC5mguqAVg6RhdkSWQFj2uxfaq/BrIZOLEWgZdALIDvcMcZLD8ZbLC9de4yR1sYMi4G20S4Q/PWeJYxTOZn5zJXANZHIxAd4JWhPIloTJZhzMQduM89WQ3MUVAE/RnhAXpTycqys3NZALOBbB7kFrgLesQl2h45Fcj8L1tTSohUwuxhy8H/Qg6K7gIs+3kkaigQCOcyEXCHN07wyQazhrmIulvKMQAwMcmLNqyCVyMAI+BuxSMeTk3OPikLY2J1uE+VHQk6ANrhds+tNARqBeaGc72cK550FP4WhXmFmcMGhTwAR1ifOe3EvPqIegFmF+C8gVy0OfAaWQPMR7gF1OQKqGoBjq90HPMP01BUjPOqGFksC4emE48tWQAH0YmvOgF3DST6xieJgHAWxPAHMuNhrImIdvoNOKNWIOcE+UXE0pYAnkX6uhWsgVXDxHdTfCmrEEmMB2zMFimLVOtiiajxiGWrbU52EeCdyOwPEQD8LqyPH9Ti2kgYMf4OhSKB7qYILbBv3CuVTJ11Y80oaseiMWOONc/Y7kJYe0xL2f0BaiFTxknHO5HaMGMublKwxFGzYdWsBF174H/QDknhTHmHHN39iWFnkZx8lPyM8WHfYELmlLKtgWNmFNzQcC1b47gJ4hL19i7o65dhH0Negbca8vONZoP7doIeOC9zXm8RjuL0Gf4d4OYaU5ljo3GYiqzrWQHfJxA6ALhDpVKv9qYeZA8eM3EhfPSCmpuD0AAAAASUVORK5CYII=";
            return d(a) ? (d(a.iconUrl) || (a.iconUrl = b, a.shadowUrl = e), new L.Icon.Default(a)) : new L.Icon.Default({
                iconUrl: b,
                shadowUrl: e
            })
        }, n = function(a, b, c) {
            if (a.closePopup(), d(c) && d(c.overlays)
                )for (var e in c.overlays)
                if (c.overlays[e]instanceof L.LayerGroup && c.overlays[e].hasLayer(a))
                    return void c.overlays[e].removeLayer(a);
            if (d(l))
                for (var f in l)
                    l[f].hasLayer(a) && l[f].removeLayer(a);
            b.hasLayer(a) && b.removeLayer(a)
        };
        return {
            deleteMarker: n,
            createMarker: function(a) {
                if (!d(a))
                    return void c.error("[AngularJS - Leaflet] The marker definition is not valid.");
                var b = {
                    icon: m(a.icon),
                    title: d(a.title) ? a.title: "",
                    draggable: d(a.draggable) ? a.draggable: !1,
                    clickable: d(a.clickable) ? a.clickable: !0,
                    riseOnHover: d(a.riseOnHover) ? a.riseOnHover: !1,
                    zIndexOffset: d(a.zIndexOffset) ? a.zIndexOffset: 0,
                    iconAngle: d(a.iconAngle) ? a.iconAngle: 0
                };
                return new L.marker(a, b)
            },
            addMarkerToGroup: function(a, b, f) {
                return i(b) ? e.isLoaded() ? (d(l[b]) || (l[b] = new L.MarkerClusterGroup, f.addLayer(l[b])), void l[b].addLayer(a)) : void c.error("[AngularJS - Leaflet] The MarkerCluster plugin is not loaded.") : void c.error("[AngularJS - Leaflet] The marker group you have specified is invalid.")
            },
            listenMarkerEvents: function(a, b, c) {
                a.on("popupopen", function() {
                    g(c, function() {
                        b.focus=!0
                    })
                }), a.on("popupclose", function() {
                    g(c, function() {
                        b.focus=!1
                    })
                })
            },
            addMarkerWatcher: function(a, b, e, f, g) {
                var l = e.$watch("markers." + b, function(b, e) {
                    if (!d(b))
                        return n(a, g, f), void l();
                    if (d(e)) {
                        if (!j(b.lat) ||!j(b.lng))
                            return c.warn("There are problems with lat-lng data, please verify your marker model"), void n(a, g, f);
                        if (i(b.layer) || i(e.layer) && (d(f.overlays[e.layer]) && f.overlays[e.layer].hasLayer(a) && (f.overlays[e.layer].removeLayer(a), a.closePopup()), g.hasLayer(a) || g.addLayer(a)
                            ), i(b.layer) && e.layer !== b.layer) {
                            if (i(e.layer) && d(f.overlays[e.layer]) && f.overlays[e.layer].hasLayer(a) && f.overlays[e.layer].removeLayer(a), a.closePopup()
                                , g.hasLayer(a) && g.removeLayer(a), !d(f.overlays[b.layer]))return void c.error("[AngularJS - Leaflet] You must use a name of an existing layer");
                            var o = f.overlays[b.layer];
                            if (!(o instanceof L.LayerGroup))
                                return void c.error('[AngularJS - Leaflet] A marker can only be added to a layer of type "group"');
                            o.addLayer(a), g.hasLayer(a) && b.focus===!0 && a.openPopup()
                        }
                        if (b.draggable!==!0 && e.draggable===!0 && d(a.dragging) && a.dragging.disable(), b.draggable===!0 && e.draggable!==!0 && (a.dragging ? a.dragging.enable() 
                            : L.Handler.MarkerDrag && (a.dragging = new L.Handler.MarkerDrag(a), a.options.draggable=!0, a.dragging.enable())), k(b.icon) || k(e.icon) && (a.setIcon(m()), a.closePopup(), a.unbindPopup(), i(b.message) && a.bindPopup(b.message)), k(b.icon) && k(e.icon)&&!angular.equals(b.icon, e.icon)) {
                            var p=!1;
                            a.dragging && (p = a.dragging.enabled()), a.setIcon(m(b.icon)), p && a.dragging.enable(), a.closePopup(), a.unbindPopup(), i(b.message) && a.bindPopup(b.message)
                        }
                        !i(b.message) && i(e.message) && (a.closePopup(), a.unbindPopup()), h.LabelPlugin.isLoaded() && d(b.label) && d(b.label.message)&&!angular.equals(b.label.message, e.label.message) && a.updateLabelContent(b.label.message), i(b.message)&&!i(e.message) && (a.bindPopup(b.message), b.focus===!0 && a.openPopup()), i(b.message) && i(e.message) && b.message !== e.message && a.setPopupContent(b.message);
                        var q=!1;
                        b.focus!==!0 && e.focus===!0 && (a.closePopup(), q=!0), b.focus===!0 && e.focus!==!0 && (a.openPopup(), q=!0), e.focus===!0 && b.focus===!0 && (a.openPopup(), q=!0);
                        var r = a.getLatLng(), s = i(b.layer) && h.MarkerClusterPlugin.is(f.overlays[b.layer]);
                        s ? q ? (b.lat !== e.lat || b.lng !== e.lng) && (f.overlays[b.layer].removeLayer(a), a.setLatLng([b.lat, b.lng]), f.overlays[b.layer].addLayer(a)) : r.lat !== b.lat || r.lng !== b.lng ? (f.overlays[b.layer].removeLayer(a), a.setLatLng([b.lat, b.lng]), f.overlays[b.layer].addLayer(a)) : (b.lat !== e.lat || b.lng !== e.lng) && (f.overlays[b.layer].removeLayer(a), a.setLatLng([b.lat, b.lng]), f.overlays[b.layer].addLayer(a)) : (r.lat !== b.lat || r.lng !== b.lng) && a.setLatLng([b.lat, b.lng])
                    }
                }, !0)
            }
        }
    }
    ]), angular.module("leaflet-directive").factory("leafletHelpers", ["$q", "$log", function(a, b) {
        function c(a, c) {
            var d, e;
            if (angular.isDefined(c))
                d = c;
            else if (1 === Object.keys(a).length)
                for (e in a)
                    a.hasOwnProperty(e) && (d = e);
            else 
                0 === Object.keys(a).length ? d = "main" : b.error("[AngularJS - Leaflet] - You have more than 1 map on the DOM, you must provide the map ID to the leafletData.getXXX call");
            return d
        }
        function d(b, d) {
            var e, f = c(b, d);
            return angular.isDefined(b[f]) && b[f].resolvedDefer!==!0 ? e = b[f].defer : (e = a.defer(), b[f] = {
                defer : e, resolvedDefer : !1
            }), e
        }
        return {
            isEmpty: function(a) {
                return 0 === Object.keys(a).length
            },
            isUndefinedOrEmpty: function(a) {
                return angular.isUndefined(a) || null === a || 0 === Object.keys(a).length
            },
            isDefined: function(a) {
                return angular.isDefined(a) && null !== a
            },
            isNumber: function(a) {
                return angular.isNumber(a)
            },
            isString: function(a) {
                return angular.isString(a)
            },
            isArray: function(a) {
                return angular.isArray(a)
            },
            isObject: function(a) {
                return angular.isObject(a)
            },
            isFunction: function(a) {
                return angular.isFunction(a)
            },
            equals: function(a, b) {
                return angular.equals(a, b)
            },
            isValidCenter: function(a) {
                return angular.isDefined(a) && angular.isNumber(a.lat) && angular.isNumber(a.lng) && angular.isNumber(a.zoom)
            },
            isValidPoint: function(a) {
                return angular.isDefined(a) && angular.isNumber(a.lat) && angular.isNumber(a.lng)
            },
            isSameCenterOnMap: function(a, b) {
                var c = b.getCenter(), d = b.getZoom();
                return c.lat === a.lat && c.lng === a.lng && d === a.zoom?!0 : !1
            },
            safeApply: function(a, b) {
                var c = a.$root.$$phase;
                "$apply" === c || "$digest" === c ? a.$eval(b) : a.$apply(b)
            },
            obtainEffectiveMapId: c,
            getDefer: function(a, b) {
                var e, f = c(a, b);
                return e = angular.isDefined(a[f]) && a[f].resolvedDefer!==!1 ? a[f].defer : d(a, b)
            },
            getUnresolvedDefer: d,
            setResolvedDefer: function(a, b) {
                var d = c(a, b);
                a[d].resolvedDefer=!0
            },
            AwesomeMarkersPlugin: {
                isLoaded: function() {
                    return angular.isDefined(L.AwesomeMarkers) && angular.isDefined(L.AwesomeMarkers.Icon)?!0 : !1
                },
                is: function(a) {
                    return this.isLoaded() ? a instanceof L.AwesomeMarkers.Icon : !1
                },
                equal: function(a, b) {
                    return this.isLoaded() && this.is(a) ? angular.equals(a, b) : !1
                }
            },
            LabelPlugin: {
                isLoaded: function() {
                    return angular.isDefined(L.Label)
                },
                is: function(a) {
                    return this.isLoaded() ? a instanceof L.MarkerClusterGroup : !1
                }
            },
            MarkerClusterPlugin: {
                isLoaded: function() {
                    return angular.isDefined(L.MarkerClusterGroup)
                },
                is: function(a) {
                    return this.isLoaded() ? a instanceof L.MarkerClusterGroup : !1
                }
            },
            GoogleLayerPlugin: {
                isLoaded: function() {
                    return angular.isDefined(L.Google)
                },
                is: function(a) {
                    return this.isLoaded() ? a instanceof L.Google : !1
                }
            },
            ChinaLayerPlugin: {
                isLoaded: function() {
                    return angular.isDefined(L.tileLayer.chinaProvider)
                }
            },
            HeatMapLayerPlugin: {
                isLoaded: function() {
                    return angular.isDefined(L.TileLayer.WebGLHeatMap)
                }
            },
            BingLayerPlugin: {
                isLoaded: function() {
                    return angular.isDefined(L.BingLayer)
                },
                is: function(a) {
                    return this.isLoaded() ? a instanceof L.BingLayer : !1
                }
            },
            WFSLayerPlugin: {
                isLoaded: function() {
                    return void 0 !== L.GeoJSON.WFS
                },
                is: function(a) {
                    return this.isLoaded() ? a instanceof L.GeoJSON.WFS : !1
                }
            },
            AGSLayerPlugin: {
                isLoaded: function() {
                    return void 0 !== lvector && void 0 !== lvector.AGS
                },
                is: function(a) {
                    return this.isLoaded() ? a instanceof lvector.AGS : !1
                }
            },
            YandexLayerPlugin: {
                isLoaded: function() {
                    return angular.isDefined(L.Yandex)
                },
                is: function(a) {
                    return this.isLoaded() ? a instanceof L.Yandex : !1
                }
            },
            DynamicMapLayerPlugin: {
                isLoaded: function() {
                    return void 0 !== L.esri && void 0 !== L.esri.dynamicMapLayer
                },
                is: function(a) {
                    return this.isLoaded() ? a instanceof L.esri.dynamicMapLayer : !1
                }
            },
            GeoJSONPlugin: {
                isLoaded: function() {
                    return angular.isDefined(L.TileLayer.GeoJSON)
                },
                is: function(a) {
                    return this.isLoaded() ? a instanceof L.TileLayer.GeoJSON : !1
                }
            },
            Leaflet: {
                DivIcon: {
                    is: function(a) {
                        return a instanceof L.DivIcon
                    },
                    equal: function(a, b) {
                        return this.is(a) ? angular.equals(a, b) : !1
                    }
                },
                Icon: {
                    is: function(a) {
                        return a instanceof L.Icon
                    },
                    equal: function(a, b) {
                        return this.is(a) ? angular.equals(a, b) : !1
                    }
                }
            }
        }
    }
    ])
}();
