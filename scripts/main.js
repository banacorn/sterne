(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  require.config({
    paths: {
      jquery: 'lib/jquery-1.7.1.min',
      wheel: 'lib/jquery.mousewheel.min',
      io: 'lib/socket.io.min.amd',
      three: 'lib/Three',
      underscore: 'lib/underscore-min.amd',
      backbone: 'lib/backbone-min.amd',
      sterne: 'sterne'
    }
  });

  require(['order!jquery', 'order!wheel', 'io', 'three', 'underscore', 'backbone', 'sterne'], function($, wheel, io, THREE, _, Backbone, Sterne) {
    var App, Camera, CoordLines, Renderer, Viewport;
    Camera = (function(_super) {

      __extends(Camera, _super);

      Camera.prototype.el = $('#viewport');

      Camera.prototype.distance = 5000;

      Camera.prototype.alt = Math.PI / 8;

      Camera.prototype.az = Math.PI / 8;

      function Camera() {
        Camera.__super__.constructor.call(this, 45, $(window).width() / $(window).height(), 1, 100000);
        this.update();
        this.onDrag();
      }

      Camera.prototype.update = function() {
        this.position.x = (this.distance * Math.cos(this.az)) * Math.cos(this.alt);
        this.position.z = (this.distance * Math.sin(this.az)) * Math.cos(this.alt);
        this.position.y = this.distance * Math.sin(this.alt);
        return this.lookAt({
          x: 0,
          y: 0,
          z: 0
        });
      };

      Camera.prototype.onDrag = function() {
        var _this = this;
        this.el.mousedown(function(e) {
          var startX, startY;
          startX = e.offsetX;
          startY = e.offsetY;
          return _this.el.mousemove(function(e) {
            _this.az += (e.offsetX - startX) * 0.002;
            _this.alt += (e.offsetY - startY) * 0.002;
            if (_this.alt > Math.PI / 2) _this.alt = Math.PI / 2;
            if (_this.alt < -Math.PI / 2) _this.alt = -Math.PI / 2;
            _this.update();
            startX = e.offsetX;
            return startY = e.offsetY;
          });
        });
        this.el.mouseup(function(e) {
          return _this.el.off('mousemove');
        });
        return this.el.mousewheel(function(e, delta) {
          if (delta > 0) _this.distance *= 0.8;
          if (delta < 0) _this.distance *= 1.25;
          if (_this.distance > 10000) _this.distance = 10000;
          if (_this.distance < 100) _this.distance = 100;
          return _this.update();
        });
      };

      return Camera;

    })(THREE.PerspectiveCamera);
    CoordLines = (function() {

      function CoordLines() {
        var i, line, lineGeo, lineMat, lines;
        lineGeo = new THREE.Geometry();
        lines = [];
        for (i = -10; i <= 10; i++) {
          lines.push(this.v(-10000, 0, i * 1000), this.v(10000, 0, i * 1000));
          lines.push(this.v(i * 1000, 0, -10000), this.v(i * 1000, 0, 10000));
        }
        lineGeo.vertices = lines;
        lineMat = new THREE.LineBasicMaterial({
          color: 0x222222,
          lineWidth: 1
        });
        line = new THREE.Line(lineGeo, lineMat);
        line.type = THREE.Lines;
        return line;
      }

      CoordLines.prototype.v = function(x, y, z) {
        return new THREE.Vertex(new THREE.Vector3(x, y, z));
      };

      return CoordLines;

    })();
    Renderer = (function(_super) {

      __extends(Renderer, _super);

      function Renderer() {
        Renderer.__super__.constructor.call(this, {
          antialias: true
        });
        $('#viewport').append(this.domElement);
        this.setClearColorHex(0x000000, 1.0);
        this.clear();
      }

      return Renderer;

    })(THREE.WebGLRenderer);
    Viewport = (function(_super) {

      __extends(Viewport, _super);

      function Viewport() {
        this.animate = __bind(this.animate, this);
        this.render = __bind(this.render, this);
        Viewport.__super__.constructor.apply(this, arguments);
      }

      Viewport.prototype.el = $('#viewport');

      Viewport.prototype.initialize = function() {
        var key, planet, _ref,
          _this = this;
        this.time = new Sterne.Time;
        this.camera = new Camera;
        this.renderer = new Renderer;
        this.scene = new THREE.Scene;
        this.resize();
        this.coordLines = new CoordLines;
        this.planets = {};
        this.planets.Sun = new Sterne.PlanetView({
          size: 100,
          color: 0xE95202,
          model: Sterne.Planet.Sun
        });
        this.planets.Mercury = new Sterne.PlanetView({
          size: 10,
          color: 0x999999,
          model: Sterne.Planet.Mercury
        });
        this.planets.Venus = new Sterne.PlanetView({
          size: 20,
          color: 0xE0DCD9,
          model: Sterne.Planet.Venus
        });
        this.planets.Earth = new Sterne.PlanetView({
          size: 20,
          color: 0x2E3A52,
          model: Sterne.Planet.Earth
        });
        this.planets.Mars = new Sterne.PlanetView({
          size: 10,
          color: 0xBE8E60,
          model: Sterne.Planet.Mars
        });
        this.planets.Jupiter = new Sterne.PlanetView({
          size: 60,
          color: 0xB38667,
          model: Sterne.Planet.Jupiter
        });
        this.planets.Saturn = new Sterne.PlanetView({
          size: 55,
          color: 0xCEB193,
          model: Sterne.Planet.Saturn
        });
        this.planets.Uranus = new Sterne.PlanetView({
          size: 35,
          color: 0xC0E5EB,
          model: Sterne.Planet.Uranus
        });
        this.planets.Neptune = new Sterne.PlanetView({
          size: 35,
          color: 0x6199F0,
          model: Sterne.Planet.Neptune
        });
        _ref = this.planets;
        for (key in _ref) {
          planet = _ref[key];
          this.scene.add(planet.view);
        }
        this.scene.add(this.coordLines);
        this.animate();
        return setInterval(function() {
          var time;
          time = _this.time.date.getTime();
          time += 86400000;
          return _this.time.date.setTime(time);
        }, 40);
      };

      Viewport.prototype.render = function() {
        var key, planet, _ref, _results;
        this.renderer.render(this.scene, this.camera);
        _ref = this.planets;
        _results = [];
        for (key in _ref) {
          planet = _ref[key];
          _results.push(planet.render(this.time));
        }
        return _results;
      };

      Viewport.prototype.animate = function() {
        this.render();
        return window.requestAnimationFrame(this.animate, this.renderer.domElement);
      };

      Viewport.prototype.resize = function() {
        this.width = $(window).width();
        this.height = $(window).height() - 5;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        return this.camera.updateProjectionMatrix();
      };

      return Viewport;

    })(Backbone.View);
    App = (function(_super) {

      __extends(App, _super);

      function App() {
        App.__super__.constructor.apply(this, arguments);
      }

      App.prototype.el = $(window);

      App.prototype.initialize = function() {
        return this.viewport = new Viewport;
      };

      App.prototype.events = {
        'resize': 'resize'
      };

      App.prototype.resize = function() {
        return this.viewport.resize();
      };

      return App;

    })(Backbone.View);
    return $(function() {
      var app;
      return app = new App;
    });
  });

}).call(this);
