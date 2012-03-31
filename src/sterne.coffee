define ['backbone', 'three'], (Backbone, THREE) ->
    class Time
    
        constructor: (@date = new Date) ->
        
        julianCentury: -> (367 * @date.getUTCFullYear() - Math.floor(7 * (@date.getUTCFullYear() + Math.floor((@date.getUTCMonth() + 10) / 12)) / 4) + Math.floor(275 * (@date.getUTCMonth() + 1) / 9) + @date.getUTCDate() - 730531.5 + @date.getUTCHours() / 24 + @date.getUTCMinutes() / 1440 + @date.getUTCSeconds() / 86400) / 36525;   
        
        
        julianDate: ->
            y = @date.getUTCFullYear() + 4800 - Math.floor((13 - @date.getUTCMonth()) / 12)            
            m = @date.getUTCMonth() + Math.floor((13 - @date.getUTCMonth()) / 12) * 12 - 2;             
            @date.getUTCDate() + Math.floor((m * 153 + 2) / 5) + y * 365 + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045 + (@date.getUTCHours() - 12) / 24 + @date.getUTCMinutes() / 1440 + @date.getUTCSeconds() / 86400;     
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
    class Model extends Backbone.Model
        
        defaults:
            elem: [
                { a: 0, e: 0, i: 0, O: 0, o: 0, L: 0 }
                { a: 0, e: 0, i: 0, O: 0, o: 0, L: 0 }
            ]
            name: 'planet'
            color: 0xAAAAAA
            radius: 10
    
        initialize: (options) ->
            @elem = options.elem
            @name = options.name
            @radius = options.radius
            @color = options.color            
            @time = new Time
            @view = new THREE.Mesh new THREE.SphereGeometry(@radius, 20, 20), new THREE.ParticleBasicMaterial color: @color
        
        
        position: (@time = @time) ->
        
            CY = @time.julianCentury();
            RAD = Math.PI / 180
            TAU = Math.PI * 2
        
            @a = @elem[0].a + @elem[1].a * CY
            @e = @elem[0].e + @elem[1].e * CY
            @i = (@elem[0].i + @elem[1].i * CY) * RAD
            @O = (@elem[0].O + @elem[1].O * CY) * RAD
            @o = (@elem[0].o + @elem[1].o * CY) * RAD
            @L = ((@elem[0].L + @elem[1].L * CY) * RAD) % TAU
            
            @M = (@L - @o + TAU) % TAU
            
            E = @M + @e * Math.sin(@M) * (1 + @e * Math.cos(@M));
            E1 = 0
            
            iter = =>
                E1 = E
                E = E1 - (E1 - @e * Math.sin(E1) - @M) / (1 - @e * Math.cos(E1))            
                
            iter() while Math.abs(E - E1) > 0.000001
            
            
            @V = ((Math.atan(Math.sqrt((1 + @e) / (1 - @e)) * (Math.sin(E / 2) / Math.cos(E / 2))) + Math.PI) % Math.PI)*2
            @R = @a * (1 - @e * @e) / (1 + @e * Math.cos(@V))
            
            @x = @R * (Math.cos(@O) * Math.cos(@V + @o - @O) - Math.sin(@O) * Math.sin(@V + @o - @O) * Math.cos(@i));
            @y = @R * (Math.sin(@O) * Math.cos(@V + @o - @O) +  Math.cos(@O) * Math.sin(@V + @o - @O) * Math.cos(@i));
            @z = @R * (Math.sin(@V + @o - @O) * Math.sin(@i));
        
        @Sun: new Model 
            elem: [
                { a: 0, e: 0, i: 0, O: 0, o: 0, L: 0 }
                { a: 0, e: 0, i: 0, O: 0, o: 0, L: 0 }
            ]
            name: 'Sun'
            radius: 100
            color: 0xE95202
        @Mercury: new Model 
            elem: [
                { a: 0.38709927, e: 0.20563593, i: 7.00497902, O: 48.33076593, o: 77.45779628, L: 252.25032350 }
                { a: 0.00000037, e: 0.00001906, i: -0.00594749, L: 149472.67411175, o: 0.16047689, O: -0.12534081 }
            ]
            name: 'Mercury'
            radius: 10
            color: 0x999999
        @Venus = new Model
            elem: [
                { a: 0.72333566, e: 0.00677672, i: 3.39467605, O: 76.67984255, o: 131.60246718, L: 181.97909950 }
                { a: 0.00000390, e: -0.00004107, i: -0.00078890, O: -0.27769418, o: 0.00268329, L: 58517.81538729 }
            ]
            name: 'Venus'
            radius: 15
            color: 0xE0DCD9
        @Earth = new Model
            elem: [       
                { a: 1.00000261, e: 0.01671123, i: -0.00001531, O: 0.0, o: 102.93768193, L: 100.46457166 }
                { a: 0.00000562, e: -0.00004392, i: -0.01294668, O: 0.0, o: 0.32327364, L: 35999.37244981 }
            ]
            name: 'Earth'
            radius: 20
            color: 0x2E3A52
        @Mars = new Model
            elem: [
                { a: 1.52371034, e: 0.09339410, i: 1.84969142, O: 49.55953891, o: -23.94362959, L: -4.55343205 }
                { a: 0.00001847, e: 0.00007882, i: -0.00813131, O: -0.29257343, o: 0.44441088, L: 19140.30268499 }
            ]
            name: 'Mars'
            radius: 10
            color: 0xBE8E60
        @Jupiter = new Model
            elem: [
                { a: 5.20288700, e: 0.04838624, i: 1.30439695, O: 100.47390909, o: 14.72847983, L: 34.39644051 }
                { a: -0.00011607, e: -0.00013253, i: -0.00183714, O: 0.20469106, o: 0.21252668, L: 3034.74612775 }
            ]
            name: 'Jupiter'
            radius: 60
            color: 0xB38667
        @Saturn = new Model
            elem: [
                { a: 9.53667594, e: 0.05386179, i: 2.48599187, O: 113.66242448, o: 92.59887831, L: 49.95424423 }
                { a: -0.00125060, e: -0.00050991, i: 0.00193609, O: -0.28867794, o: -0.41897216, L: 1222.49362201 }
            ]
            name: 'Saturn'
            radius: 55
            color: 0xCEB193
        @Uranus = new Model
            elem: [
                { a: 19.18916464, e: 0.04725744, i: 0.77263783, O: 74.01692503, o: 170.95427630, L: 313.23810451 }
                { a: -0.00196176, e: -0.00004397, i: -0.00242939, O: 0.04240589, o: 0.40805281, L: 428.48202785 }
            ]
            name: 'Uranus'
            radius: 35
            color: 0xC0E5EB
        @Neptune = new Model
            elem: [
                { a: 30.06992276, e: 0.00859048, i: 1.77004347, O: 131.78422574, o: 44.96476227, L: -55.12002969 }
                { a: 0.00026291, e: 0.00005105, i: 0.00035372, O: -0.00508664, o: -0.32241464, L: 218.45945325 }
            ]
            name: 'Neptune'
            radius: 35
            color: 0x6199F0
           
    class Collection extends Backbone.Collection
        model: Model
        
        render: (@time) =>
            for planet in @models
                planet.position(@time)
                planet.view.position.x = planet.x * -1000
                planet.view.position.y = planet.z * 1000
                planet.view.position.z = planet.y * 1000 
    
            
    return (
        Time: Time
        Model: Model
        Collection: Collection
    )
