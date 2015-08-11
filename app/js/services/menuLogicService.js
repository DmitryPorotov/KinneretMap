/**
 * Created by Dmitry on 25/07/2015.
 */
mapApp.service("menuLogicService", [ '$q', 'dataService', function ($q, dataService) {

    var buildingsData = {
        rooms: null,
        buildings: null,
        floors: null,
        cubicles: null
    },
        staffData = {
            departments: null,
            staff: null
        },
        possiblyAvailableRooms = null,
        possiblyAvailableBuildings = null;

    function getBuildingsObject(){
        return $q(function(resolve, reject){
            function handleAllBuildingsData(){
                if(buildingsData.rooms && buildingsData.floors && buildingsData.buildings && buildingsData.cubicles){
                    resolve(buildPlacesObject(buildingsData.buildings,buildingsData.rooms,buildingsData.floors,buildingsData.cubicles))
                }
            }

            dataService.getBuildings().then(function (data){
                buildingsData.buildings = data.data;
            },function(e){
                reject(e);
            }).then(handleAllBuildingsData);

            dataService.getRooms().then(function (data){
                buildingsData.rooms = data.data;
            },function(e){
                reject(e);
            }).then(handleAllBuildingsData);

            dataService.getFloors().then(function (data){
                buildingsData.floors = data.data;
            },function(e){
                reject(e);
            }).then(handleAllBuildingsData);

            dataService.getCubicles().then(function (data){
                buildingsData.cubicles = data.data;
            },function(e){
                reject(e);
            }).then(handleAllBuildingsData);
        });
    }

    function buildPlacesObject(buildings,rooms,floors,cubicles) {
        rooms.forEach(function(r) { r.nodeType = "room"; });
        floors.forEach(function(f) { f.nodeType = "floor"; f.imgSuffix = ""});

        var rootTreeNodes = _.filter(buildings,function(b){
            return b.nodeType !== "noFloors" && b.nodeType !== "oneFloor";
        });

        rootTreeNodes.forEach(function(b){
            switch (b.nodeType) {
                case "building":{
                    b.children =_.filter(floors,function(f) {
                        return f.buildingId === b.id;
                    });
                    b.children.forEach(function(f){
                        f.building = b; //link floors to buildings
                        f.children = _.filter(rooms,function(r){
                            return r.buildingId === f.buildingId && r.floorNum === f.number;
                        });
                        f.children.forEach(function(r){ //link rooms to floors
                            r.floor = f;
                        });

                        f.cubicles = _.filter(cubicles,function(c){
                            return c.floorNum === f.number && c.buildingId === f.buildingId;
                        });
                        f.cubicles.forEach(function(c){
                            c.floor = f;
                            c.parent = c.room = _.find(f.children,function(r){return r.id === c.roomId;})
                        });
                    });
                    b.children.sort(function(a,b){
                        return a.number - b.number;
                    });
                    break;
                }
                case "groupOther":
                case "groupBuildings": {
                    b.children = _.filter(buildings, function(r) {
                        return r.buildingId === b.id;
                    });
                    b.children.forEach(function (b2){
                        b2.building = b;
                        b2.floor = _.find(floors,function(f){
                            return f.buildingId === b2.id;
                        });
                        if(b2.floor) {
                            b2.floor.building = b2;
                            b2.floor.cubicles = _.filter(cubicles, function (c) {
                                return c.floorNum === b2.floor.number && c.buildingId === b2.floor.buildingId;
                            });
                            b2.floor.cubicles.forEach(function(c){
                                c.parent = c.floor = b2.floor;
                            });
                        }
                    });
                    break;
                }
            }
        });
        return rootTreeNodes;
    }

    function getStaffObject(){
        //TODO rewrite to use another action
        return $q(function(resolve, reject){
            dataService.getStaff().then(function(data){
                staffData.staff = data.data;
                resolve(data.data);
            },function(e){
                reject(e);
            });

        });
    }

    function getBuildingsData(){
       return buildingsData;
    }

    function comparatorLoose_(i) {
        return (
            (i.engName && i.engName.indexOf(this.term) > -1) ||
            (i.hebName && i.hebName.indexOf(this.term) > -1) ||
            (i.hebOnMapName && i.hebOnMapName.indexOf(this.term) > -1) ||
            (i.engOnMapName && i.engOnMapName.indexOf(this.term) > -1) ||
            (i.hebFullName && i.hebFullName.indexOf(this.term) > -1) ||
            (i.engFullName && i.engFullName.indexOf(this.term) > -1) ||
            i.engTags.indexOf(this.term) > -1 ||
            i.hebTags.indexOf(this.term) > -1
        );
    }

    function comparatorStrict_(i){
        return i.hebName === this.term || i.engName === this.term;
    }

    function findBuildings(term,isStrict) {
        return _.filter(buildingsData.buildings, (isStrict ? comparatorStrict_ : comparatorLoose_),{term:term});
    }

    function findRooms(term,isStrict){
        return _.filter(buildingsData.rooms,(isStrict ? comparatorStrict_ : comparatorLoose_),{term:term});
    }

    function findPersons(term){
        return _.filter(staffData.staff,function(i){
            return (
                (i.hebFirstName && i.hebFirstName == term) ||
                (i.hebLastName && i.hebLastName == term) ||
                (i.engFirstName && i.engFirstName == term) ||
                (i.engLastName && i.engLastName == term) ||
                (i.hebPosition && i.hebPosition.indexOf(term) > -1) ||
                (i.engPosition && i.engPosition.indexOf(term) > -1)
            );
        });
    }

    function findLocation(term) {
        var arr = term.split("-");
        var rooms = findRooms(arr[0], true);
        var buildings = findBuildings(arr[0], true);
        if (rooms.length + buildings.length === 1) {
            var room = rooms[0];
            var building = buildings[0];
            if (room && arr.length > 1) {
                var cubicle = _.find(buildingsData.cubicles, function (c) {
                    return c.onMapNumber == arr[1] && c.roomId == room.id;
                });
            }
            if (building && building.nodeType === 'oneFloor' && arr.length > 1) {
                cubicle = _.find(buildingsData.cubicles, function (c) {
                    return c.onMapNumber == arr[1] && c.buildingId == building.id;
                });
            }
        }
        return {buildings: buildings, rooms: rooms, room:room, building:building, cubicle: cubicle}
    }

    function filterRoomsByAvailability(startTime, endTime, date, types){
        if(!possiblyAvailableRooms){
            possiblyAvailableRooms = _.filter(buildingsData.rooms, function(i){
                return i.externalId;
            });
        }
        if(!possiblyAvailableBuildings){
            possiblyAvailableBuildings = _.filter(buildingsData.buildings, function(i){
                return i.externalId;
            });
        }
        var availableRooms = _.filter(possiblyAvailableRooms, function(i){
            return types.indexOf(i.type) > -1;
        });
        var availableBuildings = _.filter(possiblyAvailableBuildings, function(i){
            return types.indexOf(i.type) > -1;
        });
        function comparator_(i){
            var roomsLessons = _.filter(this.data, function(j){
                return j.roomId == i.externalId;
            });
            var numOfIntersections = 0;
            roomsLessons.forEach(function(l){
                if(doSegmentsIntersect(startTime,endTime,new Date (l.startTime),new Date(l.endTime))) numOfIntersections ++;
            });
            return !numOfIntersections;
        }
        return $q(function(resolve, reject){
            dataService.getLessons(date).then(function(d){
                 availableRooms = _.filter(availableRooms,comparator_,{data: d.data});
                availableBuildings = _.filter(availableBuildings,comparator_,{data: d.data})
                resolve({rooms:availableRooms,buildings:availableBuildings});
            },function(e){
                reject(e);
            })
        })
    }

    function doSegmentsIntersect(x1,x2,y1,y2){
        return x2 >= y1 && y2 >= x1;
    }

    return {
        getBuildingsObject:getBuildingsObject,
        getStaffObject:getStaffObject,
        getBuildingsData:getBuildingsData,
        findRooms:findRooms,
        findBuildings:findBuildings,
        findLocation:findLocation,
        findPersons:findPersons,
        filterRoomsByAvailability:filterRoomsByAvailability
    };

}]).service("menuCache",function(){return {isInit:false};});