require.config
    paths:
        jquery: 'lib/jquery-1.7.1.min'
        io: 'lib/socket.io.min.amd'
        three: 'lib/Three'
        underscore: 'lib/underscore-min.amd'
        backbone: 'lib/backbone-min.amd'
        hogan: 'lib/hogan-1.0.5.min.amd'
        
require ['jquery','io', 'three', 'underscore', 'backbone', 'hogan'], ($, io, THREE, _, Backbone, hogan) ->

    class Viewport extends Backbone.View
    
        el: $ '#viewport'

        events:
            'mousedown': 'dragStart'
            'mouseup': 'dragEnd'
            

        dragStart: (e) =>
            console.log e.offsetX
            @startingPoint = e.offsetX
            
            @$el.mousemove (e) =>
                console.log e.offsetX - @startingPoint
                #@startingPoint = e.offsetX
                # @camera.position.x = Math.sin(t/1000)*300;
            
        dragEnd: (e) ->
            console.log e.offsetX
            
            @$el.off 'mousemove'
            
        animate: =>
            t = new Date().getTime()
            @camera.position.x = Math.sin(t/1000)*300;
            @camera.position.y = 150;
            @camera.position.z = Math.cos(t/1000)*300;
            @camera.lookAt(@scene.position);
            @renderer.render(@scene, @camera);
            window.requestAnimationFrame(@animate, @renderer.domElement);

        initialize: ->
        
            console.log 'init viewport'
        
            @renderer = new THREE.WebGLRenderer
                antialias: true
            
            @camera = new THREE.PerspectiveCamera 45, $(window).width()/$(window).height(), 1, 10000
            
            @resize()
            
            
            @$el.append @renderer.domElement
            
            #@renderer.setClearColorHex(0xEEEEEE, 1.0)
            #@renderer.clear()
            
            @camera.position.z = 300;
            
            @scene = new THREE.Scene()
            cube = new THREE.Mesh(new THREE.CubeGeometry(50,50,50),
               new THREE.MeshBasicMaterial({color: 0x000000}))
            @scene.add cube
            
            @camera.lookAt
                x: 0
                y: 0
                z: 0
                
                
            @animate()
            
        render: ->
            @renderer.render @scene, @camera

        resize: ->
            console.log 'resize viewport'
            @width =  $(window).width()
            @height = $(window).height() - 5
            @renderer.setSize @width, @height
            
            console.log @camera
            
            @camera.aspect = 0.5 * @width/@height
			@camera.updateProjectionMatrix();

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
        
