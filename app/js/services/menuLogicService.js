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
        };

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
                            c.floor = r;
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
                        }
                    });
                    break;
                }
            }
        });
        return rootTreeNodes;
    }

    function getStaffObject(){
        return $q(function(resolve, reject){
            function handleAllStaffData(){
                if(staffData.staff && staffData.departments){
                    resolve(buildStaffObject(staffData.staff, staffData.departments));
                }
            }

            dataService.getStaff().then(function(data){
                staffData.staff = data.data;
            },function(e){
                reject(e);
            }).then(handleAllStaffData);

            dataService.getDepartments().then(function(data){
                staffData.departments = data.data;
            },function(e){
                reject(e);
            }).then(handleAllStaffData);
        });
    }

    function buildStaffObject(staff, departments){
        departments.forEach(function(dep){
            staff.forEach(function(s){
                s.hebName = s.hebHonorific + " " + s.hebFirstName + " " + s.hebLastName;
                s.engName = s.engHonorific + " " + s.engFirstName + " " + s.engLastName;
            });
            dep.children = _.filter(staff,function(s){
                return s.department_id === dep.id;
            });
        });
        return departments.sort(function(a,b){return (a.order - b.order);})
    }

    function getBuildingsData(){
       return buildingsData;
    }

    function comparator_(i) {
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

    function findLocations(term) {
        var resultsBuildings = _.filter(buildingsData.buildings, comparator_,{term:term});
        var resultsRooms = _.filter(buildingsData.rooms, comparator_,{term:term});
        return [resultsBuildings,resultsRooms];
    }

    function findPersons(term){
        var results = _.filter(staffData.staff,function(i){
            return (
                (i.hebFirstName && i.hebFirstName == term) ||
                (i.hebLastName && i.hebLastName == term) ||
                (i.engFirstName && i.engFirstName == term) ||
                (i.engLastName && i.engLastName == term) ||
                (i.hebPosition && i.hebPosition.indexOf(term) > -1) ||
                (i.engPosition && i.engPosition.indexOf(term) > -1)
            );
        })
        return results;
    }

    return {
        getBuildingsObject:getBuildingsObject,
        getStaffObject:getStaffObject,
        getBuildingsData:getBuildingsData,
        findLocations:findLocations,
        findPersons:findPersons
    };

}]).service("menuCache",function(){return {isInit:false};});