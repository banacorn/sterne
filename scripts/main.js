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
        this.onScroll();
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
          startX = e.clientX;
          startY = e.clientY;
          return _this.el.mousemove(function(e) {
            _this.az += (e.clientX - startX) * 0.002;
            _this.alt += (e.clientY - startY) * 0.002;
            if (_this.alt > Math.PI / 2) _this.alt = Math.PI / 2;
            if (_this.alt < -Math.PI / 2) _this.alt = -Math.PI / 2;
            _this.update();
            startX = e.clientX;
            return startY = e.clientY;
          });
        });
        return this.el.mouseup(function(e) {
          return _this.el.off('mousemove');
        });
      };

      Camera.prototype.onScroll = function() {
        var _this = this;
        return this.el.mousewheel(function(e, delta) {
          if (delta > 0) _this.distance *= 0.8;
          if (delta < 0) _this.distance *= 1.25;
          if (_this.distance > 20000) _this.distance = 20000;
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
        for (i = -30; i <= 30; i++) {
          lines.push(this.v(-30000, 0, i * 1000), this.v(30000, 0, i * 1000));
          lines.push(this.v(i * 1000, 0, -30000), this.v(i * 1000, 0, 30000));
        }
        lineGeo.vertices = lines;
        lineMat = new THREE.LineBasicMaterial({
          color: 0x202020,
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
        var planet, _i, _len, _ref,
          _this = this;
        this.time = new Sterne.Time;
        this.camera = new Camera;
        this.renderer = new Renderer;
        this.scene = new THREE.Scene;
        this.resize();
        this.coordLines = new CoordLines;
        this.planets = new Sterne.Collection;
        this.planets.push(Sterne.Model.Sun);
        this.planets.push(Sterne.Model.Mercury);
        this.planets.push(Sterne.Model.Venus);
        this.planets.push(Sterne.Model.Earth);
        this.planets.push(Sterne.Model.Mars);
        this.planets.push(Sterne.Model.Jupiter);
        this.planets.push(Sterne.Model.Saturn);
        this.planets.push(Sterne.Model.Uranus);
        this.planets.push(Sterne.Model.Neptune);
        _ref = this.planets.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          planet = _ref[_i];
          this.scene.add(planet.view);
        }
        this.scene.add(this.coordLines);
        this.animate();
        return setInterval(function() {
          var time;
          time = _this.time.date.getTime();
          time += 8640000;
          return _this.time.date.setTime(time);
        }, 10);
      };

      Viewport.prototype.render = function() {
        this.renderer.render(this.scene, this.camera);
        return this.planets.render(this.time);
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
