(function() {

  define(function() {
    var Planet, Time;
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
    Planet = (function() {

      function Planet(elem) {
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
      }

      Planet.prototype.position = function(time) {
        var CY, E, E1, RAD, TAU, iter;
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
          return E = E1 - (E1 - this.e * Math.sin(E1) - this.M) / (1 - this.e * Math.cis(E1));
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

      Planet.Sun = new Planet([(Planet.prototype.a = 0, Planet.prototype.e = 0, Planet.prototype.i = 0, Planet.prototype.O = 0, Planet.prototype.o = 0, Planet.prototype.L = 0), (Planet.prototype.a = 0, Planet.prototype.e = 0, Planet.prototype.i = 0, Planet.prototype.O = 0, Planet.prototype.o = 0, Planet.prototype.L = 0)]);

      Planet.Mercury = new Planet([(Planet.prototype.a = 0.38709927, Planet.prototype.e = 0.20563593, Planet.prototype.i = 7.00497902, Planet.prototype.O = 48.33076593, Planet.prototype.o = 77.45779628, Planet.prototype.L = 252.25032350), (Planet.prototype.a = 0.00000037, Planet.prototype.e = 0.00001906, Planet.prototype.i = -0.00594749, Planet.prototype.L = 149472.67411175, Planet.prototype.o = 0.16047689, Planet.prototype.O = -0.12534081)]);

      Planet.Venus = new Planet([(Planet.prototype.a = 0.72333566, Planet.prototype.e = 0.00677672, Planet.prototype.i = 3.39467605, Planet.prototype.O = 76.67984255, Planet.prototype.o = 131.60246718, Planet.prototype.L = 181.97909950), (Planet.prototype.a = 0.00000390, Planet.prototype.e = -0.00004107, Planet.prototype.i = -0.00078890, Planet.prototype.O = -0.27769418, Planet.prototype.o = 0.00268329, Planet.prototype.L = 58517.81538729)]);

      Planet.Earth = new Planet([(Planet.prototype.a = 1.00000261, Planet.prototype.e = 0.01671123, Planet.prototype.i = -0.00001531, Planet.prototype.O = 0.0, Planet.prototype.o = 102.93768193, Planet.prototype.L = 100.46457166), (Planet.prototype.a = 0.00000562, Planet.prototype.e = -0.00004392, Planet.prototype.i = -0.01294668, Planet.prototype.O = 0.0, Planet.prototype.o = 0.32327364, Planet.prototype.L = 35999.37244981)]);

      Planet.Mars = new Planet([(Planet.prototype.a = 1.52371034, Planet.prototype.e = 0.09339410, Planet.prototype.i = 1.84969142, Planet.prototype.O = 49.55953891, Planet.prototype.o = -23.94362959, Planet.prototype.L = -4.55343205), (Planet.prototype.a = 0.00001847, Planet.prototype.e = 0.00007882, Planet.prototype.i = -0.00813131, Planet.prototype.O = -0.29257343, Planet.prototype.o = 0.44441088, Planet.prototype.L = 19140.30268499)]);

      Planet.Jupiter = new Planet([(Planet.prototype.a = 5.20288700, Planet.prototype.e = 0.04838624, Planet.prototype.i = 1.30439695, Planet.prototype.O = 100.47390909, Planet.prototype.o = 14.72847983, Planet.prototype.L = 34.39644051), (Planet.prototype.a = -0.00011607, Planet.prototype.e = -0.00013253, Planet.prototype.i = -0.00183714, Planet.prototype.O = 0.20469106, Planet.prototype.o = 0.21252668, Planet.prototype.L = 3034.74612775)]);

      Planet.Saturn = new Planet([(Planet.prototype.a = 9.53667594, Planet.prototype.e = 0.05386179, Planet.prototype.i = 2.48599187, Planet.prototype.O = 113.66242448, Planet.prototype.o = 92.59887831, Planet.prototype.L = 49.95424423), (Planet.prototype.a = -0.00125060, Planet.prototype.e = -0.00050991, Planet.prototype.i = 0.00193609, Planet.prototype.O = -0.28867794, Planet.prototype.o = -0.41897216, Planet.prototype.L = 1222.49362201)]);

      Planet.Uranus = new Planet([(Planet.prototype.a = 19.18916464, Planet.prototype.e = 0.04725744, Planet.prototype.i = 0.77263783, Planet.prototype.O = 74.01692503, Planet.prototype.o = 170.95427630, Planet.prototype.L = 313.23810451), (Planet.prototype.a = -0.00196176, Planet.prototype.e = -0.00004397, Planet.prototype.i = -0.00242939, Planet.prototype.O = 0.04240589, Planet.prototype.o = 0.40805281, Planet.prototype.L = 428.48202785)]);

      Planet.Neptune = new Planet([(Planet.prototype.a = 30.06992276, Planet.prototype.e = 0.00859048, Planet.prototype.i = 1.77004347, Planet.prototype.O = 131.78422574, Planet.prototype.o = 44.96476227, Planet.prototype.L = -55.12002969), (Planet.prototype.a = 0.00026291, Planet.prototype.e = 0.00005105, Planet.prototype.i = 0.00035372, Planet.prototype.O = -0.00508664, Planet.prototype.o = -0.32241464, Planet.prototype.L = 218.45945325)]);

      return Planet;

    })();
    return {
      Time: Time,
      Planet: Planet
    };
  });

}).call(this);
