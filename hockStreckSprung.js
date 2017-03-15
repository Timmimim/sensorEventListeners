/**
 * Created by timmimim on 14.03.17.
 * For this motion capture function to work, insert your smart device in the front pocket of your pants,
 * or alternatively place it ON your thigh, and have on of the short sides (up or down) face the floor.
 *
 * The device's tilt and acceleration in certain directions is used to recognize movements.
 */

// instantiating global helper variables

var measure = "#Measurement, Acceleration X, Acceleration Y, Acceleration Z, Rotation Alpha, Rotation Beta, Rotation Gamma, Orientation Alpha, Orientation Beta, Orientation Gamma \r\n";

var freshlyTriggered = false;
var timeoutToStart = 3000;

var startNeigungBeta = 0;
var diffBetaNeigung = 0;
var repCount = 0;
var diffBetaNeigungMax;

var measure_count = 0;
var deviceOrientation = [0,0,0];
var z_acceleration = 0;
var y_acceleration = 0;

var countBeschlGroesserEins = 0;

/**
 * triggered through pressing the GO Button, this function adds SensorEventListeners to the DOM;
 * each listener is passed a function, which handles the sensor data that is passed with every Sensor Event.
 * Then, the down() Function is called. This function is the first of three recursive functions calling each other and processing data.
 * The next function in line will only be called upon completion of one part of the exercise,
 * which is specified through thresholds in specific motion data.
 */
function go() {
	// check if the current device has Motion and Orientation sensors and API capabilities, only then add listeners
	if ( ( 'DeviceMotionEvent' in window )  &&  ( 'DeviceOrientationEvent' in window ) ) {
		// after accepting this alert-message, a function is called with a preceding timeout of "timeoutToStart" milliseconds
		alert('Device motion ready to go in ' + (timeoutToStart / 1000) + ' seconds!');
		// set Timeout, after which Sensor Event Listeners and the motion capture functions are called
		setTimeout(function () {
			window.addEventListener('devicemotion', deviceMotionHandler, false);
			window.addEventListener('deviceorientation', deviceOrientationHandler, false);

			setTimeout( function () {
				freshlyTriggered = true;
				down();
			}, 50);
		}, timeoutToStart);
	} else {
		// if device does not support sensor API or lacks sensors, warn the player
		alert('Device motion not supported.\n We are sorry, but your device is not compatible with OriGamis SportyTasks');
	}
}

/**
 * Function handling data from SensorEventListener for Motion data, such as Acceleration (with and without gravity included) and Rotation (Gyroscope)
 * @param eventData   Sensor data passed from SensorEventListener motion
 */
function deviceMotionHandler(eventData) {
	var info, xyz = "[X, Y, Z]";

	// Update the provided HTML file to give visual feedback (optional, nice to have during development)

	// Grab the acceleration from the results
	var acceleration = eventData.acceleration;
	info = xyz.replace("X", acceleration.x && acceleration.x.toFixed(3));
	info = info.replace("Y", acceleration.y && acceleration.y.toFixed(3));
	info = info.replace("Z", acceleration.z && acceleration.z.toFixed(3));
	document.getElementById("moAccel").innerHTML = info;

	// these variables are set on EVERY new data set arrival, and are used in the bellow motion capture functions
	z_acceleration = parseFloat(acceleration.z);
	y_acceleration = parseFloat(acceleration.y);

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

/**
 * Function handling data from SensorEventListener for Orientation data; upon recieving orientation data from the sensor, this function processes that
 * @param eventData   Sensor data passed from SensorEventListener orientation
 */
function deviceOrientationHandler (eventData) {
	var info, xyz = "[X, Y, Z]";

	// Update the provided HTML file to give visual feedback (optional, nice to have during development)

	// Grab the acceleration from the results
	info = xyz.replace("X", eventData.alpha && eventData.alpha.toFixed(3));
	info = info.replace("Y", eventData.beta && eventData.beta.toFixed(3));
	info = info.replace("Z", eventData.gamma && eventData.gamma.toFixed(3));
	document.getElementById("devOrientation").innerHTML = info;

	// this variable will be set on every orientation data set arrival and is used in the motion capture functions bellow;
	// ATTENTION: Values are not floats, and NEED to be parsed as such for the motion capture functions to work;
	// in this example, this parsing is done INSIDE the motion capture functions....
	// could've had this the easy way, but did not see my error in time.
	deviceOrientation = [eventData.alpha, eventData.beta, eventData.gamma];

}

/**
 * function, called from stop-button;
 * removes SensorEventListeners from DOM,
 * can optionally save a String created in the Listener-Handler-Functions above to a .csv file by posting it to the express()-server
 */
function stop() {
	/**
	 * optional, e.g. for analysis:
	 * post the String created along the lines ("measure", not in this file) to the server, and save as .csv file
	 */
	/**if (measure != "#Measurement, Acceleration X, Acceleration Y, Acceleration Z, Rotation Alpha, Rotation Beta, Rotation Gamma, Orientation Alpha, Orientation Beta, Orientation Gamma \r\n") {
            $.ajax(
                {
                    type: "POST",
                    url: "/sensordata",
                    dataType: "String",
                    data: {
                        sensData: measure
                    },
                    statusCode: {
                        200: function () {
                            alert("Measurement saved successfully!");
                        },
                        400: function () {
                            alert("Saving did not work.")
                        }
                    }
                }
            );
        }*/
	//remove listeners, thus ending measurements
	window.removeEventListener('devicemotion', deviceMotionHandler, false);
	window.removeEventListener('deviceorientation', deviceOrientationHandler, false);
}

/**
 * recursive function to process motion data during the first part of the physical exercise repetition;
 * this function determines whether the downward motion of the squad is executed properly;
 * only then, the up() function is called, until then, down() calls itself
 */
function downSHJ() {
	setTimeout( function () {

		// only really run the function after first Orientation Measurement --> when moving;
		// AND: if triggered from the outside (i.e. freshlyTriggered == true)
		if ((deviceOrientation[1] != 0) && freshlyTriggered) {
			// reset helper vars, set start value for device tilt in 'Beta' dimension
			// reset tilt difference recorded in prior motion parts (i.e. jump-motion)
			diffBetaNeigungMax = 0;
			freshlyTriggered = false;
			startNeigungBeta = parseFloat(deviceOrientation[1]) + 180;
		}

		// calculate the absolut tilt difference between start position of movement part and current position
		diffBetaNeigung = Math.abs(startNeigungBeta - (parseFloat(deviceOrientation[1]) + 180));

		// calculate an overall Maximum of differences, so one wrong measurement or another inaccuracy in measurements // postprocessing cannot 'stop' the motion
		diffBetaNeigungMax = Math.max(diffBetaNeigung, parseFloat(diffBetaNeigungMax));

		// if the acceleration in 'z' direction (see documentation) is between thresholds, and y-acceleration (caused by cheating, rotating phone in hand/arm) is low,
		// increase counter for measurements of acceptable movement speed during exercise;
		// it IS sports afterall, but motions are to be executed in a controlled fashion, too
		if (Math.abs(z_acceleration) >= 1 && Math.abs(z_acceleration) <= 11  && y_acceleration < 2 && y_acceleration > -2) {
			++countBeschlGroesserEins;
		}

		// if tilt difference is big enough (i.e. movement was performed appropriately) and enough measurements of proper motion speed were made (==sports!),
		// this part of the repetition is done: the person has squadded down.
		// call the up() function to watch the motion back up, and reset some variables
		if (diffBetaNeigungMax >= 70 && countBeschlGroesserEins >= 7) {
			// set freshlyTriggered = true, so up()-function knows that it is called from outside, as opposed to recursively!
			freshlyTriggered = true;
			countBeschlGroesserEins = 0;
			console.log('into UP()');
			up();
		}
		else {
			// if motion is yet unfinished
			// console.log(countBeschlGroesserEins);
			// console.log('recursive into down');
			down();
		}
	}, 2);
}

/**
 * recursive function to process motion data during the second part of the physical exercise repetition;
 * this function determines whether the upward motion of the squad is executed properly;
 * only then, the jump() function is called, until then, up() calls itself
 */
function upSHJ() {
	setTimeout( function () {

		// if triggered from the outside (i.e. freshlyTriggered == true)
		if (freshlyTriggered) {
			console.log('got to UP()');
			// reset preceding tilt difference recording, deactivate "triggered from outside" bool, and set start value
			diffBetaNeigungMax = 0;
			freshlyTriggered = false;
			startNeigungBeta = parseFloat(deviceOrientation[1]) + 180;
		}

		// calculate the absolut tilt difference between start position of movement part and current position
		diffBetaNeigung = Math.abs(startNeigungBeta - (parseFloat(deviceOrientation[1]) + 180));

		// calculate an overall Maximum of differences, so one wrong measurement or another inaccuracy in measurements // postprocessing cannot 'stop' the motion
		diffBetaNeigungMax = Math.max(diffBetaNeigung, parseFloat(diffBetaNeigungMax));

		// if the acceleration in 'z' direction (see documentation) is between thresholds,
		// increase counter for measurements of acceptable movement speed during exercise;
		// it IS sports afterall, plus here, the person is going to make a jumping movement, so he may move faster
		if (Math.abs(z_acceleration) >= 1  && Math.abs(z_acceleration) <= 13) {
			++countBeschlGroesserEins;
		}

		// if tilt difference is big enough (i.e. movement was performed appropriately) and enough measurements of proper motion speed were made (==sports!),
		// this part of the repetition is done: the person has moved out of the squadding position, now ready to jump!
		// call the jump() function to watch the jumping motion, and reset some variables
		if (diffBetaNeigungMax >= 70 && countBeschlGroesserEins >= 7 ) {

			// set freshlyTriggered = true, so jump()-function knows that it is called from outside, as opposed to recursively!
			freshlyTriggered = true;
			countBeschlGroesserEins = 0;
			console.log('into Jump()');
			jump();
		}
		else {
			// if motion is yet unfinished
			// console.log('recursive into up');
			up();
		}
	}, 2);
}

/**
 * recursive function to process motion data during the final part of the physical exercise repetition;
 * this function determines whether the jumping motion of the exercise (concluding the same) is executed properly;
 * only then, the down() function is called again, and the repetition counter variable is incremented;
 * until then, down() calls itself
 */
function jumpSHJ() {
	setTimeout( function () {

		// if triggered from the outside (i.e. freshlyTriggered == true)
		if (freshlyTriggered) {
			console.log('got to JUMP()');
			freshlyTriggered = false;
		}

		// if the acceleration in 'y' direction (see documentation) is above thresholds, i.e. fast enough to jump,
		// increase counter for measurements of acceptable movement speed during exercise;
		// it IS sports afterall, plus here, the person is going to make a jumping movement, so he must move fast
		if ( Math.abs( y_acceleration ) >= 10) {
			++countBeschlGroesserEins;
		}

		// if the person moved fast enough in more then seven measurements (threshold, may be altered),
		// he is assumed to have jumped;
		// this concludes the repetition of this excercise, so the down() function is called again, and from the outside,
		// so again freshlyTriggered = true;
		// also, increasy repCount, as one repetition is DONE;  reset a couple variables, and call down()
		if ( countBeschlGroesserEins >= 7 ) {
			freshlyTriggered = true;
			countBeschlGroesserEins = 0;
			repCount = repCount + 1;
			document.getElementById('squad-jump_reps').innerHTML = repCount;
			console.log('into DOWN(), rep #' + repCount);
			down();
		}
		else {

			// if motion is yet unfinished, recursive call jump() again
			console.log('recursive into jump');
			jump();
		}
	}, 2);
}