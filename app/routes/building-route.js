var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var logger = require('tracer').console();
//var userService  = require('../services/building-service.js');
var queryService = require('../services/db/query-service.js');
var buildingService = require('../services/building-service.js');

router.get('/api/v1/building/get_nearby_buildings', function(req, res) {
	/*
		Takes a geo-location (lat and lon), and distance, and returns all buildings
		within that proximity

		Input (headers): None
		Input (body): N/A
		Input (query): lat, lon
		Output: Ordered list of buildings by location
	*/
  var payLoad = req.query;
  logger.log(payLoad)
	return buildingService.getNearbyBuildings(payLoad)
	.then(function(result){
    logger.log(result);
		res.status(200).json({status: "Success", response: result});
		res.end()
	})
  	.then(undefined, function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

router.get('/api/v1/building/get_all_buildings', function(req, res) {
	/*
		Returns an ordered list of all buildings

		Input (headers): None
		Input (body): N/A
		Input (query): None
		Output: Ordered list of buildings
	*/

	return buildingService.getAllBuildings()
	.then(function(result){
    logger.log(result);
		console.log(result);
		res.status(200).json({status: "Success", response: result});
	})
	.then(undefined, function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

router.post('/api/v1/building/create_building', function(req, res) {
	/*
		Returns a building id if added else 0

		Input (headers): None
		Input (body): name, address, num_classrooms, closing_time, lat, lon
		Input (query): None
		Output: building id on success
	*/

	var payLoad = req.body;
  logger.log(payLoad);
	return buildingService.createBuilding(payLoad)
	.then(function(result){
    logger.log(result);
		res.status(200).json({status: "Success", "building_id": result.rows[0].building_id});
	})
	.then(undefined, function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

router.post('/api/v1/building/add_room', function(req, res) {
	/*
		Returns a room id if added else 0

		Input (headers): None
		Input (body): building_id, code, occupancy, is_lab
		Input (query): None
		Output: rooo id on success
	*/

	var payLoad = req.body;
  logger.log(payLoad);
	return buildingService.createRoom(payLoad)
	.then(function(result){
    logger.log(result);
		res.status(200).json({status: "Success", "room_id": result.rows[0].room_id});
	})
	.then(undefined, function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

router.get('/api/v1/building/get_building_hours', function(req, res) {
	/*
		Returns all hours for this building

		Input (headers): None
		Input (body): None
		Input (query): building_id
		Output: Unordered json {day: start_time, end_time}
	*/

	var payLoad = req.query;

  logger.log(payLoad);
  return buildingService.getBuildingHours(payLoad)
	.then(function(schedule){
    logger.log(schedule);
		res.status(200).json({schedule});
	})
	.then(undefined, function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

router.get('/api/v1/building/get_room_schedule', function(req, res) {
	/*
		Returns all activities going on in this room on this date

		Input (headers): None
		Input (body): None
		Input (query): building_id, room_id, date (YYYY-MM-DD)
		Output: Ordered by time list [{booking_id, activity, start_time, end_time}]
	*/

	var payLoad = {
		"buildingId": parseInt(req.query.building_id),
		"roomId": parseInt(req.query.room_id),
		"date": req.query.date
	}

  logger.log(payLoad);
  return buildingService.getRoomSchedule(payLoad)
	.then(function(result){
    logger.log(result);
		res.status(200).json({status: "Success", response: result});
	})
	.then(undefined, function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

router.get('/api/v1/building/get_building_schedule', function(req, res) {
	/*
		Returns all activities going on in this room on this date

		Input (headers): None
		Input (body): None
		Input (query): building_id, date (YYYY-MM-DD)
		Output: Ordered by time list [{booking_id, activity, start_time, end_time}]
	*/

	var payLoad = {
		"buildingId": parseInt(req.query.building_id),
		"date": req.query.date
	}

  logger.log(payLoad);
  return buildingService.getBuildingSchedule(payLoad)
	.then(function(result){
    logger.log(result);
		res.status(200).json({status: "Success", response: result});
	})
	.then(undefined, function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

router.get('/api/v1/building/get_building_info', function(req, res) {

  	/*
  	- get_building_info()
	GET
	Input (headers): None 
	Input (body): N/A
	Input (query): building_id
	Output: {Available/Available Soon/Unavailable: room_id, code}, comments, bookings, hours

	*/
  	
  var payLoad = req.query;

	return buildingService.getBuildingInfo(payLoad)
	.then(function(result){
    logger.log(result);
		res.status(200).json({status: "Success", response: result});
	})
  .then(undefined, function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

router.get('/api/v1/building/get_room_info', function(req, res) {

	/*
	- get_room_info()
	GET
	Input (headers): None
	Input (body): N/A
	Input (query): room_id
	Output: {Bookings: [], Comments: []}

	*/

  var payLoad = {
  	"roomId": req.query.room_id
  }
  
	return buildingService.getRoomInfo(payLoad)
	.then(function(result){
    logger.log(result);
		res.status(200).json({status: "Success", result});
	})
  .then(undefined, function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

router.get('/api/v1/building/get_building_comments', function(req, res) {

	/*
		Returns all comments for this building

		Input (headers): None
		Input (body): None
		Input (query): building_id
		Output: {Comment: user_id, comment_id, title, message}
	*/

  var payLoad = req.query;
  
	return buildingService.getBuildingComments(payLoad)
	.then(function(comments){
    logger.log(comments);
		res.status(200).json({status: "Success", comments});
	})
  .then(undefined, function(err){
		res.status(500).json({status: "Failure", response: err});
	})
});

module.exports = router;