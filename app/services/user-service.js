var express = require('express');
var Promise = require('bluebird');
var logger = require('tracer').console();
var queryService = require('./db/query-service');

var userService = (function() {
  return {
    /*
      Takes a cookie in the Json payload and returns the user_id if it exists
      Or returns a newly created one
    */
    getId: function(payload) {
    	logger.log(payload);
      return queryService.insertOnConflict('users', 'cookie', [payload.cookie], 'user_id')
      .then(function(result){
        logger.log(result);
        if (result.length > 0){
          return result;
        } else {
          return queryService.select('users', 'cookie', payload.cookie)
        }
      })
    },
    getFavouriteBuildings: function(payLoad) {
      /*
      Takes a user_id and returns a list of favourite buildings
      */

      logger.log(payLoad);
      return queryService.selectJoinGeneral('favourites', 'buildings', 'building_id', 'building_id', 'favourites.user_id', [payLoad.user_id], 'buildings.code')
      .then(function(result){
        logger.log(result);
        return result;
      })
      .then(undefined, function(err){
        throw new MyError(err.message, __line, 'user-service.js');
      })
    },
    addFavouriteBuilding: function(payLoad) {
      /*
      Takes a userId and buildingId and returns a list of favourite buildings
      */

      logger.log(payLoad);
      return queryService.insert('favourites', 'user_id,building_id', [payLoad.userId, payLoad.buildingId], 'fav_id')
      .then(function(result){
        logger.log(result);
        return result;
      })
      .then(undefined, function(err){
        throw new MyError(err.message, __line, 'user-service.js');
      })
    },
    deleteFavouriteBuilding: function(payLoad) {
      /*
      Takes a userId and buildingId and deletes from favourites
      */

      logger.log(payLoad);
      return queryService.delete('favourites', 'user_id', payLoad.userId, 'building_id', payLoad.buildingId)
      .then(function(result){
        logger.log(result);
        return result;
      })
      .then(undefined, function(err){
        throw new MyError(err.message, __line, 'user-service.js');
      })
    },
    createBooking: function(payLoad) {
      /*
      Takes tons of information and creates a booking
      */

      logger.log(payLoad);
      return this.getRoomId(payLoad)
      .then(function(result){
        logger.log(result)
        return queryService.insert('bookings', 'classroom_id,user_id,building_id,message,start_time,end_time,booking_date', [result, payLoad.userId, payLoad.buildingId, payLoad.comment, payLoad.start_time, payLoad.end_time, payLoad.date], 'booking_id')
      })
      .then(undefined, function(err){
        throw new MyError(err.message, __line, 'user-service.js');
      })
    },
    deleteBooking: function(payLoad) {
      /*
      Takes tons of information and creates a booking
      */

      logger.log(payLoad);
      return queryService.delete('bookings', 'user_id', payLoad.userId, 'booking_id', payLoad.bookingId)
      .then(undefined, function(err){
        throw new MyError(err.message, __line, 'user-service.js');
      })
    },
    getRoomId: function(payLoad){
      /*
      returns room id from room code and building id
      */
      logger.log(payLoad)
      return queryService.select('classrooms', 'code', payLoad.room_code)
      .then(function(result){
        logger.log(result);
        return result[0].room_id
      })
      .then(undefined, function(err){
        throw new MyError(err.message, __line, 'user-service.js');
      })
    },
    addComment: function(payLoad){
      /*
      Takes user_id and relevant info to create a comment
      */
      logger.log(payLoad)
      return queryService.insert('comments', 'building_id,title,message,user_id,date_and_time', [payLoad.building_id, payLoad.title, payLoad.message, payLoad.user_id, 'now()'], 'comment_id')
      .then(undefined, function(err){
        throw new MyError(err.message, __line, 'user-service.js');
      })
    }

  };
})();

module.exports = userService;

