(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
    var App, Camera, Obj, Renderer, Scene, Viewport;
    Camera = (function() {
      __extends(Camera, THREE.PerspectiveCamera);
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
        this.el.mousedown(__bind(function(e) {
          var startX, startY;
          startX = e.clientX;
          startY = e.clientY;
          return this.el.mousemove(__bind(function(e) {
            this.az += (e.clientX - startX) * 0.002;
            this.alt += (e.clientY - startY) * 0.002;
            if (this.alt > Math.PI / 2) {
              this.alt = Math.PI / 2;
            }
            if (this.alt < -Math.PI / 2) {
              this.alt = -Math.PI / 2;
            }
            this.update();
            startX = e.clientX;
            return startY = e.clientY;
          }, this));
        }, this));
        return this.el.mouseup(__bind(function(e) {
          return this.el.off('mousemove');
        }, this));
      };
      Camera.prototype.onScroll = function() {
        return this.el.mousewheel(__bind(function(e, delta) {
          if (delta > 0) {
            this.distance *= 0.8;
          }
          if (delta < 0) {
            this.distance *= 1.25;
          }
          if (this.distance > 30000) {
            this.distance = 30000;
          }
          if (this.distance < 100) {
            this.distance = 100;
          }
          return this.update();
        }, this));
      };
      return Camera;
    })();
    Obj = (function() {
      function Obj() {
        this.initGrid();
        this.initPlanet();
      }
      Obj.prototype.initGrid = function() {
        var grid, i, line, lineGeo, lineMat, v;
        v = function(x, y, z) {
          return new THREE.Vertex(new THREE.Vector3(x, y, z));
        };
        grid = [];
        for (i = -30; i <= 30; i++) {
          grid.push(v(-30000, 0, i * 1000), v(30000, 0, i * 1000));
          grid.push(v(i * 1000, 0, -30000), v(i * 1000, 0, 30000));
        }
        lineGeo = new THREE.Geometry();
        lineGeo.vertices = grid;
        lineMat = new THREE.LineBasicMaterial({
          color: 0x202020,
          lineWidth: 1
        });
        line = new THREE.Line(lineGeo, lineMat);
        line.type = THREE.Lines;
        return this.grid = {
          view: line
        };
      };
      Obj.prototype.initPlanet = function() {
        return this.planet = new Sterne.Collection([new Sterne.View(Sterne.Model.Sun), new Sterne.View(Sterne.Model.Mercury), new Sterne.View(Sterne.Model.Venus), new Sterne.View(Sterne.Model.Earth), new Sterne.View(Sterne.Model.Mars), new Sterne.View(Sterne.Model.Jupiter), new Sterne.View(Sterne.Model.Saturn), new Sterne.View(Sterne.Model.Uranus), new Sterne.View(Sterne.Model.Neptune)]);
      };
      return Obj;
    })();
    Scene = (function() {
      __extends(Scene, THREE.Scene);
      function Scene() {
        Scene.__super__.constructor.apply(this, arguments);
      }
      Scene.prototype.add = function(obj) {
        var e, _i, _len, _results;
        if (Array.isArray(obj)) {
          _results = [];
          for (_i = 0, _len = obj.length; _i < _len; _i++) {
            e = obj[_i];
            _results.push(Scene.__super__.add.call(this, e));
          }
          return _results;
        } else {
          return Scene.__super__.add.call(this, obj);
        }
      };
      return Scene;
    })();
    Renderer = (function() {
      __extends(Renderer, THREE.WebGLRenderer);
      function Renderer() {
        Renderer.__super__.constructor.call(this, {
          antialias: true
        });
        $('#viewport').append(this.domElement);
        this.setClearColorHex(0x000000, 1.0);
        this.clear();
      }
      return Renderer;
    })();
    Viewport = (function() {
      __extends(Viewport, Backbone.View);
      function Viewport() {
        this.animate = __bind(this.animate, this);
        this.render = __bind(this.render, this);
        Viewport.__super__.constructor.apply(this, arguments);
      }
      Viewport.prototype.el = $('#viewport');
      Viewport.prototype.initialize = function() {
        this.time = new Sterne.Time;
        this.camera = new Camera;
        this.renderer = new Renderer;
        this.scene = new Scene;
        this.resize();
        this.obj = new Obj;
        this.scene.add(this.obj.grid.view);
        this.obj.planet.addBy(this.scene);
        this.animate();
        return setInterval(__bind(function() {
          var time;
          time = this.time.date.getTime();
          time += 8640000;
          return this.time.date.setTime(time);
        }, this), 10);
      };
      Viewport.prototype.render = function() {
        this.renderer.render(this.scene, this.camera);
        return this.obj.planet.update(this.time);
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
    })();
    App = (function() {
      __extends(App, Backbone.View);
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
    })();
    return $(function() {
      var app;
      return app = new App;
    });
  });
}).call(this);
