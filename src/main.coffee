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
        distance: 300
        alt: 0
        az: 0
        
        constructor: ->
        
            super 45, $(window).width()/$(window).height(), 1, 10000
            
                               
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
                    @az += (e.offsetX - startX) * 0.005
                    @alt += (e.offsetY - startY) * 0.005
                                        
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
                
                
                @distance = 5000 if @distance > 5000
                @distance = 100 if @distance < 100
                                       
                    
                console.log @distance
                @update()

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
            
            
            
            #@renderer.setClearColorHex(0xEEEEEE, 1.0)
            #@renderer.clear()
            
            
            @scene = new THREE.Scene()
            cube = new THREE.Mesh(new THREE.CubeGeometry(50,50,50),
               new THREE.MeshPhongMaterial({color: 0xFFFFFF}))
            @scene.add cube
            
            @light0 = new THREE.SpotLight();
            @light1 = new THREE.SpotLight();
            @light2 = new THREE.SpotLight();
            @light0.position.set 0, 200, 0
            @light1.position.set 50, 100, 50
            @light2.position.set -50, 100, -50
            @scene.add(@light0);
            @scene.add(@light1);
            @scene.add(@light2);
      
      
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
        
