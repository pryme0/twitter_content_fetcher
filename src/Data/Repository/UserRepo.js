/**
 * @file Manages all database queries related to the User document(table)
 * @author Joseph <obochi2@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 *  Everytime you make changes to this file ensure to change the name, date and time
 * Last Modified: Joseph <obochi2@gmail.com> <16/09/2020 11:10pm>
 */

const UserModel = require('../Model/User');
const { findOneAndUpdate } = require('../Model/User');
const {NotFoundResponse} = require('../../utilities/ApiResponse');
const { indexOf } = require('lodash');

/**
 * @class UserRepo
 * @classdesc  a class with static database query methods, this class will contain all the queries for our User model.
 */
class userRepo {
    /**
     * @description A static method to create a new user.
     * @param userData - The user credentials
     * @returns {Promise<UserModel>}
     */
    static async create(userData) {
        const user = await UserModel.create(userData);
        return user;
    }

    /**
     * @description A static method to find user by thier emails
     * @param userEmail -the user email
     * @returns {Promise<UserModel>}
     */

    static async findUserByEmail(email) {
        return UserModel.findOne({ email }).exec()
    }

    /**
     * @description A static method to find user by thier twitterId
     * @param twitterId-the user twitter media id
     * @returns {Promise<UserModel>}
     */

    static async findUserByTwitterId(profileId) {
        return UserModel.findOne({ twitter: profileId })
    }


    /**
     * @description A static method to find user by thier id
     * @param ID-userId
     * @returns {Promise<UserModel>}
     */

    static async findUserById(profileId) {
        return UserModel.findById(profileId)
    }




    /**
     * @description A static method to find user by thier socialmedia id
     * @param ID-the user social media id
     * @returns {Promise<UserModel>}
     */

    static async updateOneById(profileId, data) {
        return UserModel.findOneAndUpdate({ _id: profileId }, data, { new: true })
    }

     /**
     * @description A static method to find user by thier socialmedia id
     * @param ID-the user social media id
     * @returns {Promise<UserModel>}
     */

    static async deleteInterstById(profileId, data) {
        let user = await UserModel.findById(profileId)
        if(!user) return new NotFoundResponse('user info not found')
        let sta = user.interests.pull()
         let interests =  user.interests
         interests.forEach((dat)=>{
             if(dat === data){
                 let index1 =  interests.indexOf(dat)
                 interests.splice(index1,1)
                 console.log(interests)
             }
         })
         user.interests = interests
         let newUser = await user.save() 
       return newUser.interests
    }




}

module.exports = userRepo