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
      hogan: 'lib/hogan-1.0.5.min.amd'
    }
  });

  require(['order!jquery', 'order!wheel', 'io', 'three', 'underscore', 'backbone', 'hogan'], function($, wheel, io, THREE, _, Backbone, hogan) {
    var App, Camera, Viewport;
    Camera = (function(_super) {

      __extends(Camera, _super);

      Camera.prototype.el = $('#viewport');

      Camera.prototype.distance = 300;

      Camera.prototype.alt = 0;

      Camera.prototype.az = 0;

      function Camera() {
        Camera.__super__.constructor.call(this, 45, $(window).width() / $(window).height(), 1, 10000);
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
            _this.az += (e.offsetX - startX) * 0.005;
            _this.alt += (e.offsetY - startY) * 0.005;
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
          if (_this.distance > 5000) _this.distance = 5000;
          if (_this.distance < 100) _this.distance = 100;
          console.log(_this.distance);
          return _this.update();
        });
      };

      return Camera;

    })(THREE.PerspectiveCamera);
    Viewport = (function(_super) {

      __extends(Viewport, _super);

      function Viewport() {
        this.animate = __bind(this.animate, this);
        Viewport.__super__.constructor.apply(this, arguments);
      }

      Viewport.prototype.el = $('#viewport');

      Viewport.prototype.animate = function() {
        var t;
        t = new Date().getTime();
        this.renderer.render(this.scene, this.camera);
        return window.requestAnimationFrame(this.animate, this.renderer.domElement);
      };

      Viewport.prototype.rendererInit = function() {
        this.renderer = new THREE.WebGLRenderer({
          antialias: true
        });
        return this.$el.append(this.renderer.domElement);
      };

      Viewport.prototype.initialize = function() {
        var cube;
        this.camera = new Camera;
        console.log('init viewport');
        this.rendererInit();
        this.resize();
        this.scene = new THREE.Scene();
        cube = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50), new THREE.MeshPhongMaterial({
          color: 0xFFFFFF
        }));
        this.scene.add(cube);
        this.light0 = new THREE.SpotLight();
        this.light1 = new THREE.SpotLight();
        this.light2 = new THREE.SpotLight();
        this.light0.position.set(0, 200, 0);
        this.light1.position.set(50, 100, 50);
        this.light2.position.set(-50, 100, -50);
        this.scene.add(this.light0);
        this.scene.add(this.light1);
        this.scene.add(this.light2);
        return this.animate();
      };

      Viewport.prototype.render = function() {
        return this.renderer.render(this.scene, this.camera);
      };

      Viewport.prototype.resize = function() {
        console.log('resize viewport');
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
