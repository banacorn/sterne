require.config
    paths:
        jquery: 'lib/jquery-1.7.1.min'
        wheel: 'lib/jquery.mousewheel.min'
        io: 'lib/socket.io.min.amd'
        three: 'lib/Three'
        underscore: 'lib/underscore-min.amd'
        backbone: 'lib/backbone-min.amd'
        sterne: 'sterne'
        
require ['order!jquery', 'order!wheel', 'io', 'three', 'underscore', 'backbone', 'sterne'], ($, wheel, io, THREE, _, Backbone, Sterne) ->
    


    class Camera extends THREE.PerspectiveCamera
        
        el: $('#viewport')
        distance: 2000
        alt: Math.PI/8
        az: Math.PI/8
        
        constructor: ->        
            super 45, $(window).width()/$(window).height(), 1, 100000                               
            @update()
            @onDrag()
            
        update: ->
            @position.x = (@distance * Math.cos @az) * Math.cos @alt
            @position.z = (@distance * Math.sin @az) * Math.cos @alt
            @position.y = @distance * Math.sin @alt            
            @lookAt
                x: 0
                y: 0
                z: 0 
                
        onDrag: ->
        
            @el.mousedown (e) =>                        
                startX = e.offsetX
                startY = e.offsetY  
                              
                @el.mousemove (e) =>                
                    @az += (e.offsetX - startX) * 0.002
                    @alt += (e.offsetY - startY) * 0.002                                        
                    @alt = Math.PI/2 if @alt > Math.PI/2
                    @alt = -Math.PI/2 if @alt < -Math.PI/2                    
                    @update()                    
                    startX = e.offsetX
                    startY = e.offsetY
                                
            @el.mouseup (e) =>
                @el.off 'mousemove'
                
            @el.mousewheel (e, delta) =>            
                @distance *= 0.8 if delta > 0
                @distance *= 1.25 if delta < 0    
                @distance = 10000 if @distance > 10000
                @distance = 100 if @distance < 100                                       
                @update()

    class CoordLines
    
        constructor: ->
            lineGeo = new THREE.Geometry()            
            lines = []            
            
            for i in [-10..10]
                lines.push @v(-10000, 0, i*1000), @v(10000, 0, i*1000)
                lines.push @v(i*1000, 0, -10000), @v(i*1000, 0, 10000)
            
            lineGeo.vertices = lines
            lineMat = new THREE.LineBasicMaterial
                color: 0x222222
                lineWidth: 1
            line = new THREE.Line lineGeo, lineMat
            line.type = THREE.Lines
            return line
            
            
        v: (x, y, z) -> 
            new THREE.Vertex new THREE.Vector3 x, y, z
    
            

    class Renderer extends THREE.WebGLRenderer
        constructor: ->
        
            super antialias: true
                
            $('#viewport').append @domElement
            
            @setClearColorHex(0x000000, 1.0)
            @clear()

            
    class Viewport extends Backbone.View
    
        el: $ '#viewport'

            
        initialize: ->
        
            @time = new Sterne.Time
        
            @camera = new Camera        
            @renderer = new Renderer
            @scene = new THREE.Scene            
            @resize()
            
            @coordLines = new CoordLines
            
            @planets = {}
            @planets.Sun = new Sterne.PlanetView
                size: 100
                color: 0xE95202
                model: Sterne.Planet.Sun
            @planets.Mercury = new Sterne.PlanetView
                size: 10
                color: 0x999999
                model: Sterne.Planet.Mercury
            @planets.Venus = new Sterne.PlanetView
                size: 20
                color: 0xE0DCD9
                model: Sterne.Planet.Venus
            @planets.Earth = new Sterne.PlanetView
                size: 20
                color: 0x2E3A52
                model: Sterne.Planet.Earth
            @planets.Mars = new Sterne.PlanetView
                size: 10
                color: 0xBE8E60
                model: Sterne.Planet.Mars
            @planets.Jupiter = new Sterne.PlanetView
                size: 60
                color: 0xB38667
                model: Sterne.Planet.Jupiter
            @planets.Saturn = new Sterne.PlanetView
                size: 55
                color: 0xCEB193
                model: Sterne.Planet.Saturn
            @planets.Uranus = new Sterne.PlanetView
                size: 35
                color: 0xC0E5EB
                model: Sterne.Planet.Uranus
            @planets.Neptune = new Sterne.PlanetView
                size: 35
                color: 0x6199F0
                model: Sterne.Planet.Neptune
            
            
            for key, planet of @planets
                @scene.add planet.view
                
            @scene.add @coordLines
            @animate()
            
        
            setInterval =>
                time = @time.date.getTime()
                time += 86400000
                @time.date.setTime time
            , 40
        
        render: =>
            @renderer.render @scene, @camera
            
                        
            for key, planet of @planets
                planet.render @time
        
        animate: =>
            @render()
            window.requestAnimationFrame(@animate, @renderer.domElement);
            
            
        resize: ->            
            @width = $(window).width()
            @height = $(window).height() - 5            
            @renderer.setSize @width, @height
            @camera.aspect = @width/@height
            @camera.updateProjectionMatrix()
            

    class App extends Backbone.View
        
        el: $ window
        
            
        initialize: ->
            @viewport = new Viewport
        
        events:
            'resize': 'resize'
            

        resize: ->
            @viewport.resize()
               

    $ ->
        app = new App
        
