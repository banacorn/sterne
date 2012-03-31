require.config
    paths:
        jquery: 'lib/jquery-1.7.1.min'
        wheel: 'lib/jquery.mousewheel.min'
        io: 'lib/socket.io.min.amd'
        three: 'lib/Three'
        underscore: 'lib/underscore-min.amd'
        backbone: 'lib/backbone-min.amd'
        hogan: 'lib/hogan-1.0.5.min.amd'
        
require ['order!jquery', 'order!wheel', 'io', 'three', 'underscore', 'backbone', 'hogan'], ($, wheel, io, THREE, _, Backbone, hogan) ->
    


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
            ###    
            for i in [-10..10]
            lines.push @v(i*500, 0, -10000), @v(i*500, 0, 10000)
            ###    
            console.log lines
            
            
            
            
            lineGeo.vertices = lines
            lineMat = new THREE.LineBasicMaterial
                color: 0x222222
                lineWidth: 1
            line = new THREE.Line lineGeo, lineMat
            line.type = THREE.Lines
            return line
            
            
        v: (x, y, z) -> 
            console.log THREE.Vertex
            new THREE.Vertex new THREE.Vector3 x, y, z
    

    class Viewport extends Backbone.View
    
        el: $ '#viewport'

        
        animate: =>
            t = new Date().getTime()
            @renderer.render(@scene, @camera);
            window.requestAnimationFrame(@animate, @renderer.domElement);

        rendererInit: ->        
            @renderer = new THREE.WebGLRenderer
                antialias: true
            @$el.append @renderer.domElement
        
        initialize: ->
        
        
            
            @camera = new Camera
        
            console.log 'init viewport'
        
            # init renderer & camera
            @rendererInit() 
            
            # init size
            @resize()
            
            
            
            @renderer.setClearColorHex(0x000000, 1.0)
            #@renderer.clear()
            
            
            @scene = new THREE.Scene()
            cube = new THREE.Mesh(new THREE.SphereGeometry(50, 20, 20),
               new THREE.ParticleBasicMaterial({color: 0xFFD700}))
            @scene.add cube
            
            @coordLines = new CoordLines
            @scene.add @coordLines
            
            
            
            
            
            
            ###
            @light0 = new THREE.AmbientLight(50, 500, 50);
            @light0.position.set 0, 10000, 0
            @scene.add @light0
            ###
      
            @animate()
            
        render: ->
            @renderer.render @scene, @camera

        resize: ->
            console.log 'resize viewport'
            
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
        
