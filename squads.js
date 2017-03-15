
    var freshlyTriggered = false;
    var deviceOrientation = [0,0,0];
    var z_acceleration = 0;
    var beschleunigungNegativ;
    var startNeigungBeta = 0;
    var countBeschlGroesserEins;
    var minBeschl, maxBeschl;
    var diffBetaNeigung = 0;
    var repCount = 0;
    var diffBetaNeigungMax;

    var maxBeschlDown = 0, maxBeschlUp = 0;

    var countBeschlGroesserEins = 0;

    var timeoutToStart = 3000;

    function go() {
        if ( ( 'DeviceMotionEvent' in window )  &&  ( 'DeviceOrientationEvent' in window ) ) {
            alert('Device motion ready to go in ' + (timeoutToStart / 1000) +' seconds!');
            setTimeout(function () {
                window.addEventListener('devicemotion', deviceMotionHandler, false);
                window.addEventListener('deviceorientation', deviceOrientationHandler, false);

                setTimeout( function () {
                    freshlyTriggered = true;
                    down();
                }, 50);
            }, timeoutToStart);
        } else {
            alert('Device motion not supported.\n We are sorry, but your device is not compatible with OriGamis SportyTasks');
        }
    }

    function deviceMotionHandler(eventData) {
            var info, xyz = "[X, Y, Z]";

            // Grab the acceleration from the results
            var acceleration = eventData.acceleration;
            info = xyz.replace("X", acceleration.x && acceleration.x.toFixed(3));
            info = info.replace("Y", acceleration.y && acceleration.y.toFixed(3));
            info = info.replace("Z", acceleration.z && acceleration.z.toFixed(3));
            document.getElementById("moAccel").innerHTML = info;
            z_acceleration = parseFloat(acceleration.z);

            // Grab the acceleration including gravity from the results
            acceleration = eventData.accelerationIncludingGravity;
            info = xyz.replace("X", acceleration.x && acceleration.x.toFixed(3));
            info = info.replace("Y", acceleration.y && acceleration.y.toFixed(3));
            info = info.replace("Z", acceleration.z && acceleration.z.toFixed(3));
            document.getElementById("moAccelGrav").innerHTML = info;

            // Grab the rotation rate from the results
            var rotation = eventData.rotationRate;
            info = xyz.replace("X", rotation.alpha && rotation.alpha.toFixed(3));
            info = info.replace("Y", rotation.beta && rotation.beta.toFixed(3));
            info = info.replace("Z", rotation.gamma && rotation.gamma.toFixed(3));
            document.getElementById("moRotation").innerHTML = info;

            // // Grab the refresh interval from the results
            info = eventData.interval;
            document.getElementById("moInterval").innerHTML = info;
            
    }
    function deviceOrientationHandler (eventData) {
            var info, xyz = "[X, Y, Z]";

            // Grab the acceleration from the results
            info = xyz.replace("X", eventData.alpha && eventData.alpha.toFixed(3));
            info = info.replace("Y", eventData.beta && eventData.beta.toFixed(3));
            info = info.replace("Z", eventData.gamma && eventData.gamma.toFixed(3));
            document.getElementById("devOrientation").innerHTML = info;

            deviceOrientation = [eventData.alpha, eventData.beta, eventData.gamma];

    }

    function stop() {
        
        window.removeEventListener('devicemotion', deviceMotionHandler, false);
        window.removeEventListener('deviceorientation', deviceOrientationHandler, false);
        measure = "#Measurement, Acceleration X, Acceleration Y, Acceleration Z, Rotation Alpha, Rotation Beta, Rotation Gamma, Orientation Alpha, Orientation Beta, Orientation Gamma \r\n";
        interval=1;
        measure_count = 0;
    }


    function down() {
        setTimeout( function () {

            if ((deviceOrientation[1] != 0) && freshlyTriggered) {

                diffBetaNeigungMax = 0;
                freshlyTriggered = false;
                startNeigungBeta = parseFloat(deviceOrientation[1]) + 180;
            }


            diffBetaNeigung = Math.abs(startNeigungBeta - (parseFloat(deviceOrientation[1]) + 180));

            diffBetaNeigungMax = Math.max(diffBetaNeigung, parseFloat(diffBetaNeigungMax));


             if (Math.abs(z_acceleration) > maxBeschlDown){
                maxBeschlDown = Math.abs(z_acceleration);
            }

            if (Math.abs(z_acceleration) >= 1  && Math.abs(z_acceleration) <= 4) {
                ++countBeschlGroesserEins;
            }

            if (diffBetaNeigungMax >= 50 && countBeschlGroesserEins >= 7) {

                freshlyTriggered = true;
                countBeschlGroesserEins = 0;
                maxBeschlUp = 0;
                console.log('into UP()');
                up();
            }
            else {
                    console.log(countBeschlGroesserEins);
                    console.log('recursive into down');
                    down();
            }
        }, 2);
    }

    function up() {
        setTimeout( function () {

            if (freshlyTriggered) {
                console.log('got to UP()');
                diffBetaNeigungMax = 0;
                freshlyTriggered = false;
                startNeigungBeta = parseFloat(deviceOrientation[1]) + 180;
            }

            diffBetaNeigung = Math.abs(startNeigungBeta - (parseFloat(deviceOrientation[1]) + 180));

            diffBetaNeigungMax = Math.max(diffBetaNeigung, parseFloat(diffBetaNeigungMax));

            if (Math.abs(z_acceleration) > maxBeschlUp){
                maxBeschlUp = Math.abs(z_acceleration);
            }

            if (Math.abs(z_acceleration) >= 1  && Math.abs(z_acceleration) <= 4) {
                ++countBeschlGroesserEins;
            }

            if (diffBetaNeigungMax >= 70 && countBeschlGroesserEins >= 7 ) {

                freshlyTriggered = true;
                countBeschlGroesserEins = 0;
                repCount = repCount+1;
                document.getElementById('squad_reps').innerHTML = repCount;
                console.log('into Down(), rep #' +repCount);
                down();
            }
            else {
                console.log('recursive into up');
                up();
            }
        }, 2);
    }