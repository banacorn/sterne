(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  require.config({
    paths: {
      jquery: 'lib/jquery-1.7.1.min',
      io: 'lib/socket.io.min.amd',
      three: 'lib/Three',
      underscore: 'lib/underscore-min.amd',
      backbone: 'lib/backbone-min.amd',
      hogan: 'lib/hogan-1.0.5.min.amd'
    }
  });

  require(['jquery', 'io', 'three', 'underscore', 'backbone', 'hogan'], function($, io, THREE, _, Backbone, hogan) {
    var App, Viewport;
    Viewport = (function(_super) {

      __extends(Viewport, _super);

      function Viewport() {
        this.animate = __bind(this.animate, this);
        this.dragStart = __bind(this.dragStart, this);
        Viewport.__super__.constructor.apply(this, arguments);
      }

      Viewport.prototype.el = $('#viewport');

      Viewport.prototype.events = {
        'mousedown': 'dragStart',
        'mouseup': 'dragEnd'
      };

      Viewport.prototype.dragStart = function(e) {
        var _this = this;
        console.log(e.offsetX);
        this.startingPoint = e.offsetX;
        return this.$el.mousemove(function(e) {
          return console.log(e.offsetX - _this.startingPoint);
        });
      };

      Viewport.prototype.dragEnd = function(e) {
        console.log(e.offsetX);
        return this.$el.off('mousemove');
      };

      Viewport.prototype.animate = function() {
        var t;
        t = new Date().getTime();
        this.camera.position.x = Math.sin(t / 1000) * 300;
        this.camera.position.y = 150;
        this.camera.position.z = Math.cos(t / 1000) * 300;
        this.camera.lookAt(this.scene.position);
        this.renderer.render(this.scene, this.camera);
        return window.requestAnimationFrame(this.animate, this.renderer.domElement);
      };

      Viewport.prototype.initialize = function() {
        var cube;
        console.log('init viewport');
        this.renderer = new THREE.WebGLRenderer({
          antialias: true
        });
        this.camera = new THREE.PerspectiveCamera(45, $(window).width() / $(window).height(), 1, 10000);
        this.resize();
        this.$el.append(this.renderer.domElement);
        this.camera.position.z = 300;
        this.scene = new THREE.Scene();
        cube = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50), new THREE.MeshBasicMaterial({
          color: 0x000000
        }));
        this.scene.add(cube);
        this.camera.lookAt({
          x: 0,
          y: 0,
          z: 0
        });
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
        console.log(this.camera);
        return this.camera.aspect = this.width / this.height;
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
