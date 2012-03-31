(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(['backbone', 'three'], function(Backbone, THREE) {
    var Collection, Model, Time, View;
    Time = (function() {

      function Time(date) {
        this.date = date != null ? date : new Date;
      }

      Time.prototype.julianCentury = function() {
        return (367 * this.date.getUTCFullYear() - Math.floor(7 * (this.date.getUTCFullYear() + Math.floor((this.date.getUTCMonth() + 10) / 12)) / 4) + Math.floor(275 * (this.date.getUTCMonth() + 1) / 9) + this.date.getUTCDate() - 730531.5 + this.date.getUTCHours() / 24 + this.date.getUTCMinutes() / 1440 + this.date.getUTCSeconds() / 86400) / 36525;
      };

      Time.prototype.julianDate = function() {
        var m, y;
        y = this.date.getUTCFullYear() + 4800 - Math.floor((13 - this.date.getUTCMonth()) / 12);
        m = this.date.getUTCMonth() + Math.floor((13 - this.date.getUTCMonth()) / 12) * 12 - 2;
        return this.date.getUTCDate() + Math.floor((m * 153 + 2) / 5) + y * 365 + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045 + (this.date.getUTCHours() - 12) / 24 + this.date.getUTCMinutes() / 1440 + this.date.getUTCSeconds() / 86400;
      };

      return Time;

    })();
    Model = (function(_super) {

      __extends(Model, _super);

      function Model() {
        Model.__super__.constructor.apply(this, arguments);
      }

      Model.prototype.initialize = function(elem) {
        this.elem = elem != null ? elem : [
          {
            a: 0,
            e: 0,
            i: 0,
            O: 0,
            o: 0,
            L: 0
          }, {
            a: 0,
            e: 0,
            i: 0,
            O: 0,
            o: 0,
            L: 0
          }
        ];
        return this.time = new Time;
      };

      Model.prototype.position = function(time) {
        var CY, E, E1, RAD, TAU, iter,
          _this = this;
        this.time = time != null ? time : this.time;
        CY = this.time.julianCentury();
        RAD = Math.PI / 180;
        TAU = Math.PI * 2;
        this.a = this.elem[0].a + this.elem[1].a * CY;
        this.e = this.elem[0].e + this.elem[1].e * CY;
        this.i = (this.elem[0].i + this.elem[1].i * CY) * RAD;
        this.O = (this.elem[0].O + this.elem[1].O * CY) * RAD;
        this.o = (this.elem[0].o + this.elem[1].o * CY) * RAD;
        this.L = ((this.elem[0].L + this.elem[1].L * CY) * RAD) % TAU;
        this.M = (this.L - this.o + TAU) % TAU;
        E = this.M + this.e * Math.sin(this.M) * (1 + this.e * Math.cos(this.M));
        E1 = 0;
        iter = function() {
          E1 = E;
          return E = E1 - (E1 - _this.e * Math.sin(E1) - _this.M) / (1 - _this.e * Math.cos(E1));
        };
        while (Math.abs(E - E1) > 0.000001) {
          iter();
        }
        this.V = ((Math.atan(Math.sqrt((1 + this.e) / (1 - this.e)) * (Math.sin(E / 2) / Math.cos(E / 2))) + Math.PI) % Math.PI) * 2;
        this.R = this.a * (1 - this.e * this.e) / (1 + this.e * Math.cos(this.V));
        this.x = this.R * (Math.cos(this.O) * Math.cos(this.V + this.o - this.O) - Math.sin(this.O) * Math.sin(this.V + this.o - this.O) * Math.cos(this.i));
        this.y = this.R * (Math.sin(this.O) * Math.cos(this.V + this.o - this.O) + Math.cos(this.O) * Math.sin(this.V + this.o - this.O) * Math.cos(this.i));
        return this.z = this.R * (Math.sin(this.V + this.o - this.O) * Math.sin(this.i));
      };

      Model.Sun = new Model([
        {
          a: 0,
          e: 0,
          i: 0,
          O: 0,
          o: 0,
          L: 0
        }, {
          a: 0,
          e: 0,
          i: 0,
          O: 0,
          o: 0,
          L: 0
        }
      ]);

      Model.Mercury = new Model([
        {
          a: 0.38709927,
          e: 0.20563593,
          i: 7.00497902,
          O: 48.33076593,
          o: 77.45779628,
          L: 252.25032350
        }, {
          a: 0.00000037,
          e: 0.00001906,
          i: -0.00594749,
          L: 149472.67411175,
          o: 0.16047689,
          O: -0.12534081
        }
      ]);

      Model.Venus = new Model([
        {
          a: 0.72333566,
          e: 0.00677672,
          i: 3.39467605,
          O: 76.67984255,
          o: 131.60246718,
          L: 181.97909950
        }, {
          a: 0.00000390,
          e: -0.00004107,
          i: -0.00078890,
          O: -0.27769418,
          o: 0.00268329,
          L: 58517.81538729
        }
      ]);

      Model.Earth = new Model([
        {
          a: 1.00000261,
          e: 0.01671123,
          i: -0.00001531,
          O: 0.0,
          o: 102.93768193,
          L: 100.46457166
        }, {
          a: 0.00000562,
          e: -0.00004392,
          i: -0.01294668,
          O: 0.0,
          o: 0.32327364,
          L: 35999.37244981
        }
      ]);

      Model.Mars = new Model([
        {
          a: 1.52371034,
          e: 0.09339410,
          i: 1.84969142,
          O: 49.55953891,
          o: -23.94362959,
          L: -4.55343205
        }, {
          a: 0.00001847,
          e: 0.00007882,
          i: -0.00813131,
          O: -0.29257343,
          o: 0.44441088,
          L: 19140.30268499
        }
      ]);

      Model.Jupiter = new Model([
        {
          a: 5.20288700,
          e: 0.04838624,
          i: 1.30439695,
          O: 100.47390909,
          o: 14.72847983,
          L: 34.39644051
        }, {
          a: -0.00011607,
          e: -0.00013253,
          i: -0.00183714,
          O: 0.20469106,
          o: 0.21252668,
          L: 3034.74612775
        }
      ]);

      Model.Saturn = new Model([
        {
          a: 9.53667594,
          e: 0.05386179,
          i: 2.48599187,
          O: 113.66242448,
          o: 92.59887831,
          L: 49.95424423
        }, {
          a: -0.00125060,
          e: -0.00050991,
          i: 0.00193609,
          O: -0.28867794,
          o: -0.41897216,
          L: 1222.49362201
        }
      ]);

      Model.Uranus = new Model([
        {
          a: 19.18916464,
          e: 0.04725744,
          i: 0.77263783,
          O: 74.01692503,
          o: 170.95427630,
          L: 313.23810451
        }, {
          a: -0.00196176,
          e: -0.00004397,
          i: -0.00242939,
          O: 0.04240589,
          o: 0.40805281,
          L: 428.48202785
        }
      ]);

      Model.Neptune = new Model([
        {
          a: 30.06992276,
          e: 0.00859048,
          i: 1.77004347,
          O: 131.78422574,
          o: 44.96476227,
          L: -55.12002969
        }, {
          a: 0.00026291,
          e: 0.00005105,
          i: 0.00035372,
          O: -0.00508664,
          o: -0.32241464,
          L: 218.45945325
        }
      ]);

      return Model;

    })(Backbone.Model);
    Collection = (function(_super) {

      __extends(Collection, _super);

      function Collection() {
        Collection.__super__.constructor.apply(this, arguments);
      }

      Collection.prototype.model = Model;

      return Collection;

    })(Backbone.Collection);
    View = (function(_super) {

      __extends(View, _super);

      function View() {
        View.__super__.constructor.apply(this, arguments);
      }

      View.prototype.model = Model;

      View.prototype.color = 0xFFFFFF;

      View.prototype.initialize = function(options) {
        this.color = options.color;
        this.size = options.size;
        return this.view = new THREE.Mesh(new THREE.SphereGeometry(this.size, 20, 20), new THREE.ParticleBasicMaterial({
          color: this.color
        }));
      };

      View.prototype.render = function(time) {
        this.model.position(time);
        this.view.position.x = this.model.x * -1000;
        this.view.position.y = this.model.z * 1000;
        return this.view.position.z = this.model.y * 1000;
      };

      return View;

    })(Backbone.View);
    return {
      Time: Time,
      Model: Model,
      View: View,
      Collection: Collection
    };
  });

}).call(this);
