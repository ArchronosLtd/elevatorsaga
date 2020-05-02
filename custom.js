var solution = {
    init: function(elevators, floors) {

        elevators.forEach(function (elevator, currentElevatorIndex) {
        var buttonsPressedOnElevator= []
        elevator.on("idle", function(){
            // if at least one request pending for btn pressed inside elevator 
            if(buttonsPressedOnElevator.length > 0 ) {
            console.log("buttonsPressedOnElevator ", buttonsPressedOnElevator)        
            let indexOfFloorWithMinDistanceToTravel = -1
            let lowestDistanceElevatorToTravel = 10000
            buttonsPressedOnElevator.forEach((btnPressedOnElevator, index) => {
                let distanceToBtnPressedFloor = Math.abs(btnPressedOnElevator - elevator.currentFloor());
                        if(distanceToBtnPressedFloor < lowestDistanceElevatorToTravel) {
                            lowestDistanceElevatorToTravel = distanceToBtnPressedFloor;
                            indexOfFloorWithMinDistanceToTravel = index;
                        }
                    })
                    elevator.goToFloor((buttonsPressedOnElevator.splice(indexOfFloorWithMinDistanceToTravel, 1))[0]);
                }
                // Else Elevator is Empty and will serve request from other floors waiting for elevator to be picked
                else { 
                    console.log("floorsAwaitingForElevatorStatus ", floorsAwaitingForElevatorStatus)        

                    let lowestDistanceElevatorToTravel = 10000
                    let indexOfFloorWithMinDistanceToTravel = currentElevatorIndex
                    floorsAwaitingForElevatorStatus.forEach((floorAwaitingForElevatorStatus, floorNumIndex) => {
                        if(floorAwaitingForElevatorStatus) {
                            let distanceToAwaitingFloor = Math.abs(floorNumIndex - elevator.currentFloor());
                            if(distanceToAwaitingFloor < lowestDistanceElevatorToTravel) {
                                lowestDistanceElevatorToTravel = distanceToAwaitingFloor;
                                indexOfFloorWithMinDistanceToTravel = floorNumIndex;
                            }
                        }
                    })
                    elevator.goToFloor(indexOfFloorWithMinDistanceToTravel);
                }
            })
            elevator.on("floor_button_pressed", function(floorNum) {
                buttonsPressedOnElevator.push(floorNum)
            });
            elevator.on("stopped_at_floor", function(floorNum){
                floorsAwaitingForElevatorStatus[floorNum] = false;
            })
        })

        var floorsAwaitingForElevatorStatus = []
        floors.forEach(floor => {
            floorsAwaitingForElevatorStatus.push(false);

            floor.on("up_button_pressed", function() {
                floorsAwaitingForElevatorStatus[floor.floorNum()] = true
            });
            floor.on("down_button_pressed", function() {
                floorsAwaitingForElevatorStatus[floor.floorNum()] = true
            })        
         });
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
        }
    }
