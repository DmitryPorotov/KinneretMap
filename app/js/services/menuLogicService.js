/**
 * Created by Dmitry on 25/07/2015.
 */
mapApp.service("menuLogicService", [ '$q', 'dataService', function ($q, dataService) {

    var buildingsData = {
        rooms: null,
        buildings: null,
        floors: null
    },
        staffData = {
            departments: null,
            staff: null
        },
        possiblyAvailableRooms = null;

    function getBuildingsObject(){
        return $q(function(resolve, reject){
            function handleAllBuildingsData(){
                if(buildingsData.rooms && buildingsData.floors && buildingsData.buildings){
                    resolve(buildPlacesObject(buildingsData.buildings,buildingsData.rooms,buildingsData.floors))
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
        });
    }

    function buildPlacesObject(buildings,rooms,floors) {
        rooms.forEach(function(r) { if(!r.insideOfRoomId) r.nodeType = "room"; });
        floors.forEach(function(f) { f.nodeType = "floor"; });

        var rootTreeNodes = _.filter(buildings,function(b){
            return b.nodeType === "building" || b.nodeType === "groupOther" || b.nodeType === "groupBuildings";
        });

        rootTreeNodes.forEach(function(b){
            switch (b.nodeType) {
                case "building":{
                    b.children =_.filter(floors,function(f) {
                        return f.buildingId === b.id;
                    });
                    b.children.forEach(function(f) {
                        f.building = b; //link floors to buildings
                        f.children = _.filter(rooms,function(r){
                            return r.buildingId === f.buildingId && r.floorNum === f.number && !r.insideOfRoomId;
                        });
                        f.children.forEach(function(r){ //link rooms to floors
                            r.floor = f;
                        });

                        f.cubicles = _.filter(rooms,function(c){
                            return c.floorNum === f.number && c.buildingId === f.buildingId && c.insideOfRoomId;
                        });
                        f.cubicles.forEach(function(c){
                            c.floor = f;
                            c.parent = c.room = _.find(f.children,function(r){return r.id === c.insideOfRoomId;})
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
                        b2.floor = _.find(floors,function(f){//assuming groupBuildings contains single floor buildings only
                            return f.buildingId === b2.id;
                        });
                        if(b2.floor) {
                            b2.floor.building = b2;
                            b2.floor.cubicles = _.filter(rooms, function (c) {
                                return c.floorNum === b2.floor.number && c.buildingId === b2.floor.buildingId && c.insideOfRoomId;
                            });
                            b2.floor.cubicles.forEach(function(c){
                                c.parent = c.floor = b2.floor;
                            });
                            b2.floor.room = _.find(rooms, function (c) {//assuming groupBuildings contains single floor buildings only
                                return c.floorNum === b2.floor.number && c.buildingId === b2.floor.buildingId && !c.insideOfRoomId;
                            });
                            if(b2.floor.room){
                                b2.floor.room.floor = b2.floor;
                            }
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
        var term = this.term.toLowerCase();
        return (
            i.isSearchable && (
                (i.engName && i.engName.toLowerCase().indexOf(term) > -1) ||
                (i.hebName && i.hebName.toLowerCase().indexOf(term) > -1) ||
                (i.hebOnMapName && i.hebOnMapName.toLowerCase().indexOf(term) > -1) ||
                (i.engOnMapName && i.engOnMapName.toLowerCase().indexOf(term) > -1) ||
                (i.hebFullName && i.hebFullName.toLowerCase().indexOf(term) > -1) ||
                (i.engFullName && i.engFullName.toLowerCase().indexOf(term) > -1) ||
                i.engTags.indexOf(term) > -1 ||
                i.hebTags.indexOf(term) > -1 ||
                (i.roomType && (i.roomType.hebRoomType.toLowerCase().indexOf(term)  > -1 || i.roomType.engRoomType.toLowerCase().indexOf(term) > -1 ))
            )
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
        return dataService.getStaff(term);
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
        var availableRooms = _.filter(possiblyAvailableRooms, function(i){
            return types.indexOf(i.type) > -1;
        });
        function comparator_(i){
            var roomsLessons = _.filter(this.data, function(j){
                return j.roomId == i.externalId;
            });
            var numOfIntersections = 0;
            roomsLessons.forEach(function(l){
                if(doSegmentsIntersect(startTime, endTime, new Date(l.startTime).getTime() + this.timeOffset, new Date(l.endTime).getTime() + this.timeOffset)) numOfIntersections ++;
            },this);
            return !numOfIntersections;
        }
        return $q(function(resolve, reject){
            dataService.getLessons(date).then(function(d){
                var timeOffset = 0;
                if(d.data && d.data.length){
                    timeOffset = calculateTimeOffset(d.data[0].startTime, new Date().getTimezoneOffset());
                }
                availableRooms = _.filter(availableRooms, comparator_, {data: d.data, timeOffset: timeOffset});
                resolve({rooms:availableRooms});
            },function(e){
                reject(e);
            })
        })
    }

    function calculateTimeOffset(dateString, localOffset){
        var _UTCOffsetString = dateString.substring(dateString.length -6);
        if(_UTCOffsetString[5].toLowerCase() === "z"){
            var _UTCOffset = 0;
        }
        else {
            var arr = _UTCOffsetString.split(':');
            _UTCOffset = parseInt(arr[0]) * 60 + parseInt(arr[1]);
        }
        return (_UTCOffset + localOffset) * 60000;
    }

    function doSegmentsIntersect(x1,x2,y1,y2){
        return x2 > y1 && y2 > x1;
    }

    function getRoomUsage(date, externalId){
        return $q(function(resolve, reject){
            dataService.getLessons(date).then(function(d){
                var classes = _.filter(d.data, function(c){
                    return c.roomId == externalId;
                });
                classes = _.map(classes,function(c){
                    var startArr = c.startTime.split('T');
                    startArr = startArr[1].split(':');
                    var endArr = c.endTime.split('T');
                    endArr = endArr[1].split(':');
                    return startArr[0] + ":" + startArr[1] + " - " + endArr[0] + ":" + endArr[1];
                });
                resolve(classes);
            },function(e){
                reject(e);
            })
        })
    }

    return {
        getBuildingsObject:getBuildingsObject,
        getStaffObject:getStaffObject,
        getBuildingsData:getBuildingsData,
        findRooms:findRooms,
        findBuildings:findBuildings,
        findLocation:findLocation,
        findPersons:findPersons,
        filterRoomsByAvailability:filterRoomsByAvailability,
        getRoomUsage:getRoomUsage
    };

}]).service("menuCache",function(){return {isInit:false};});