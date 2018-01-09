var zmitiUtil = {

    init: function() {
        this.initWebgl();
        this.initWebRTC();
    },
    initWebgl: function() {
        var viewW = document.documentElement.clientWidth,
            viewH = document.documentElement.clientHeight;


        var scene = new THREE.Scene();


        var renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });

        renderer.setSize(viewW, viewH);
        renderer.setClearAlpha(0);

        var camera = new THREE.PerspectiveCamera(45, viewW / viewH, .1, 2000);

        camera.position.set(0, 0, 100);

        camera.lookAt(scene.position);

        scene.add(camera);

        var geometry = new THREE.Geometry();

        var sprite = new THREE.TextureLoader().load("./assets/images/disc.png");

        for (var i = 0; i < 40; i++) {
            var vertex = new THREE.Vector3();
            vertex.x = Math.random() * 200 - 100;
            vertex.y = Math.random() * 200 - 100;
            vertex.z = Math.random() * 200 - 100;


            geometry.vertices.push(vertex);
        }

        var pointColor = "#ffffff";
        var directionalLight = new THREE.DirectionalLight(pointColor);
        directionalLight.position.set(-40, 60, -10);
        directionalLight.castShadow = true;
        directionalLight.shadowCameraNear = 2;
        directionalLight.shadowCameraFar = 200;
        directionalLight.shadowCameraLeft = -50;
        directionalLight.shadowCameraRight = 50;
        directionalLight.shadowCameraTop = 50;
        directionalLight.shadowCameraBottom = -50;

        directionalLight.distance = 0;
        directionalLight.intensity = 0.5;
        directionalLight.shadowMapHeight = 1024;
        directionalLight.shadowMapWidth = 1024;


        scene.add(directionalLight);


        var manager = new THREE.LoadingManager();

        manager.onProgress = function(item, loaded, total) {
            console.log(item, loaded, total);
        }

        var loader = new THREE.OBJLoader(manager);

        var object = null;
        loader.load('./assets/data/snowman.obj', function(obj) {
            obj.traverse(function(child) {
                /*if ( child instanceof THREE.Mesh ) {
                  child.material.map = texture;
                }*/
            });
            obj.position.y = -60;
            obj.scale.set(.5, .5, .5)
            object = obj;
            scene.add(obj);
        });


        var clock = new THREE.Clock();

        var trackballControls = new THREE.TrackballControls(camera);

        trackballControls.rotateSpeed = 1.0;
        trackballControls.zoomSpeed = 1.0;
        trackballControls.panSpeed = 1.0;
        //        trackballControls.noZoom=false;
        //        trackballControls.noPan=false;
        trackballControls.staticMoving = true;



        var materails = [];
        geometry.vertices.forEach(function(param, i) {
            var size = Math.random() * 2 + .7;
            var particles = new THREE.Points(geometry, new THREE.PointsMaterial({
                size: size,
                map: sprite,
                transparent: true
            }));
            particles.speedY = (Math.random() + .1);
            particles.speedX = (Math.random()) * (Math.random() - .5 > 0 ? 1 : -1);
            particles.speedY = particles.speedY.toFixed(2)
            particles.speedX = particles.speedX.toFixed(2)
            scene.add(particles);
        })


        var pointLight = new THREE.PointLight(0xffffff, 1, 1000);
        scene.add(pointLight)

        var hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
        hemiLight.position.set(0, 500, 0);
        scene.add(hemiLight);

        document.body.appendChild(renderer.domElement);
        var i = 0;
        var render = function() {

            //camera.position.x += (  camera.position.x ) * 0.05;
            //camera.position.y += (  - camera.position.y ) * 0.05;
            //camera.lookAt( scene.position );

            trackballControls.update(clock.getDelta());
            object && (object.rotation.y += .01);
            pointLight.position.x = Math.sin(i * Math.PI / 180) * 300;
            pointLight.position.z = Math.cos(i * Math.PI / 180) * 300;
            // pointLight.position.y = Math.cos(i*Math.PI/180)*300;
            i += .2;
            scene.children.forEach(function(child, i) {
                if (child instanceof THREE.Points) {
                    if (child.position.y < -70) {
                        child.position.y = 70;
                    }
                    if (child.position.x < -30) {
                        child.position.x = 30;
                    }
                    child.position.y -= child.speedY;
                    child.position.x -= child.speedX;
                }
            })

            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }


        render();
    },
    initWebRTC: function() {
        ///var errorElement = document.querySelector('#errorMsg');
        var video = document.querySelector('video');

        if (navigator.getUserMedia) {
            navigator.mediaDevices.enumerateDevices().then(function(sourceInfos) {


                var constraints = window.constraints = {
                    audio: false,
                    video: {
                        facingMode: 'environment'
                    }
                };

                function handleSuccess(stream) {
                    var videoTracks = stream.getVideoTracks();
                    //console.log('Got stream with constraints:', constraints);
                    //console.log('Using video device: ' + videoTracks[0].label);
                    stream.oninactive = function() {
                        console.log('Stream inactive');
                    };
                    window.stream = stream; // make variable available to browser console
                    video.srcObject = stream;

                    alert('success')

                }

                function handleError(error) {
                    alert('error');
                    /* if (error.name === 'ConstraintNotSatisfiedError') {
                         errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
                             constraints.video.width.exact + ' px is not supported by your device.');
                     } else if (error.name === 'PermissionDeniedError') {
                         errorMsg('Permissions have not been granted to use your camera and ' +
                             'microphone, you need to allow the page access to your devices in ' +
                             'order for the demo to work.');
                     }
                     errorMsg('getUserMedia error: ' + error.name, error);*/
                }

                function errorMsg(msg, error) {
                    // errorElement.innerHTML += '<p>' + msg + '</p>';
                    if (typeof error !== 'undefined') {
                        console.error(error);
                    }
                }

                navigator.mediaDevices.getUserMedia(constraints).
                then(handleSuccess).catch(handleError);
            });
        }
    }

};

zmitiUtil.init();
