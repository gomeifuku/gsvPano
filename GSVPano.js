var GSVPANO = GSVPANO || {};
GSVPANO.PanoLoader = function (g) {
    var g = g || {},
        d,
        k,
        m = new google.maps.StreetViewService,
        f = 0,
        h = 0,
        a = document.createElement("canvas"),
        i = a.getContext("2d");


    this.setProgress        = function (b) {
        if (this.onProgress)
            this.onProgress(b)
    };
    this.throwError         = function (b) {
        if (this.onError)
            this.onError(b);
        else
            console.error(b)
    };
    this.adaptTextureToZoom = function () {
        var b = 416 * Math.pow(2, d),
            c = 416 * Math.pow(2, d - 1);
        a.width  = b;
        a.height = c;
        i.translate(a.width, 0);
        i.scale(-1, 1)
    };
    this.composeFromTile    = function (b, c, j) {
        i.drawImage(j, 512 * b, 512 * c);
        f++;
        this.setProgress(Math.round(100 * f / h));
        if (f === h && (this.canvas = a, this.onPanoramaLoad))
            this.onPanoramaLoad()
    };
    this.composePanorama    = function () {
        this.setProgress(0);
        console.log("Loading panorama for zoom " + d + "...");
        var b = Math.pow(2, d),
            c = Math.pow(2, d - 1),
            j = this,
            l,
            a,
            e;
        f = 0;
        h = b * c;
        for (e = 0; e < c; e++)
            for (a = 0; a < b; a++)
                l = "http://maps.google.com/cbk?output=tile&panoid=" + k + "&zoom=" + d + "&x=" + a +
                        "&y=" + e + "&" + Date.now(),
                function (b, c) {
                    var a = new Image;
                    a.addEventListener("load", function () {
                        j.composeFromTile(b, c, this)
                    });
                    a.crossOrigin = "";
                    a.src         = l
                }
            (a, e)
    };
    this.load               = function (b) {
        console.log("Load for", b);
        var c = this;
        m.getPanoramaByLocation(b, 50, function (a, d) {
            if (d === google.maps.StreetViewStatus.OK) {
                if (c.onPanoramaData)
                    c.onPanoramaData(a);
                google
                    .maps
                    .geometry
                    .spherical
                    .computeHeading(b, a.location.latLng);
                c.copyright = a.copyright;
                k           = a.location.pano;
                c.location  = b;
                c.composePanorama();
            } else {
                if (c.onNoPanoramaData)
                    c.onNoPanoramaData(d);
                c.throwError("Could not retrieve panorama for the following reason: " + d)
            }
        })
    };
    this.setZoom            = function (a) {
        d = a;
        this.adaptTextureToZoom()
    };
    this.setZoom(g.zoom || 1)
};
