/**
 * @file Using the separation of concern principle, this file handles the business
 * logic of signing up and signing in a user with a twitter account
 * @author joseph <obochi2@gmail.com> <3/09/2020 11:07am>
 * @since 1.0.0
 * Last Modified: Joseph <obochi2@gmail.com> <10/08/2020 05:10am>
 */
const twitterApi = require("node-twitter-api");
const oAuth = require("oauth");
const userRepo = require("../Data/Repository/UserRepo");
const TwitApi = require("twit");
const _ = require("lodash");
const eventEmitter = require("../subscribers");
const config = require("../config/index");

const {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_CALL_BACK_URL,
} = config;

const { BadRequestError } = require("../utilities/ApiError");
const { BadRequestResponse } = require("../utilities/ApiResponse");
const twitter = new twitterApi({
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  callback: TWITTER_CALL_BACK_URL,
});

class TwitterService {
  static async url() {
    return new Promise((resolve, reject) => {
      twitter.getRequestToken(
        (error, requestToken, requestTokenSecret, results) => {
          if (error) {
            return reject(
              `Error getting OAuth request token : ${JSON.stringify(error)}`,
              500
            );
          } else {
            //set the request and request token secret as enviroment variables to be accessed later
            process.env["requestToken"] = requestToken;
            process.env["requestTokenSecret"] = requestTokenSecret;
            // assemble goodreads URL
            let url = `https://twitter.com/oauth/authorize?oauth_token=${requestToken}`;
            return resolve(url);
          }
        }
      );
    });
  }

  //static method to get user access tokens and user data
  static async getUserAccessTokens(userTokens) {
      console.log(userTokens)
    return new Promise((resolve, reject) => {
      twitter.getAccessToken(
        userTokens.oauth_token,
        process.env.requestTokenSecret,
        userTokens.oauth_verifier,
        (error, accessToken, accessTokenSecret, results) => {
          if (error)
            return reject(
              `error getting user acess tokens : ${JSON.stringify(error)}`,
              500
            );

          //if there is no error use access tokens to get and process user information
          process.env["accessToken"] = accessToken;
          process.env["accessTokenSecret"] = accessTokenSecret;
          return resolve(
            TwitterService.processUser({
              accessToken: accessToken,
              accessTokenSecret: accessTokenSecret,
            })
          );
        }
      );
    });
  }

  //process user
  static async processUser(userData) {
    return new Promise((resolve, reject) => {
      twitter.verifyCredentials(
        userData.accessToken,
        userData.accessTokenSecret,
        { include_email: true, skip_status: true },
        async (error, data, response) => {
            console.log(data)
          if (error)
            return reject(
              `error getting user credentials from twitter : ${JSON.stringify(
                error
              )}`,
              500
            );

          //get user data from the data object returnd sand save to database
          let user = await userRepo.findUserByEmail(data.email);
          if (user) {
            let updatedUser = await userRepo.updateOneById(user._id, {
              twitterTokens: {
                accessToken: process.env.accessToken,
                accessTokenSecret: process.env.accessTokenSecret,
              },
            });

            // extract only required fields
            updatedUser = _.pick(updatedUser, [
              "_id",
              "firstName",
              "lastName",
              "email",
              "updatedAt",
              "interests",
              "twitterTokens",
              "profileImage",
            ]);
            return resolve({ user: updatedUser, data: null });
          }

          const userData = {
            firstName: data.name.toLowerCase(),
            lastName: data.screen_name.toLowerCase(),
            email: data.email,
            twitter: data.id.toString(),
            twitterTokens: {
              accessToken: process.env.accessToken,
              accessTokenSecret: process.env.accessTokenSecret,
            },
            profileImage: data.profile_image_url,
          };

          //save user information in the database
          user = await userRepo.create(userData);
          //create token
          const token = user.createToken(); //TODO- decide if we'll generate
          //generate token verification url
          const url = `http://127.0.0.1:3000/confirm_email/${token}`;

          //emit event toi send welcome email
          eventEmitter.emit("sendWelcomeEmail", user, url);

          //return user data to frontend
          return resolve({ User: user, data: "User created sucessfully" });
        }
      );
    });
  }

  static async getInterest(email) {
      try{   const user = await userRepo.findUserByEmail(email);
        if (!user) return "User has no inyterests";
        let interests = user.interests;
        return interests;
    }
        catch(err){
            return err;
        }
 
  }

  static async getUserContent(user) {
    const TWI = new TwitApi({
      consumer_key: TWITTER_CONSUMER_KEY,
      consumer_secret: TWITTER_CONSUMER_SECRET,
      access_token: user.twitterTokens.accessToken,
      access_token_secret: user.twitterTokens.accessTokenSecret,
      timeout_ms: 60 * 1000,
    });

 
      return new Promise((resolve, reject) => {
        let interestArray = user.interests;
        let i = 1;
        let interest = interestArray[0];
        do {
          interest += ` OR ${interestArray[i]}`;
          i++;
        } while (i < interestArray.length);
        interest = interest.slice(0, -4);
        TWI.get(
          "search/tweets",
          { q: `${interest} since:2020-09-01`, count: 30 },
          function (err, data, response) {
            if (err) {
              console.log(err);
              return reject(err);
            } else {
              return resolve(data);
            }
          }
        );
      });
  }

  static async updateInterest(data, id) {
    try {
      const user = await userRepo.findUserById(id);
      if (!user) return "User data not updated";
      let poster = user.interests;
      //check user data
      data.forEach((dat) => {
        const findIndex = poster.indexOf(dat);
        findIndex == -1 ? user.interests.push(dat) : findIndex;
        //user.interests.push(dat)
      });
      await user.save();
      return "user interest updated";
    } catch (err) {
      console.log(err);
    }
  }

  static async deleteInterest(user, interest) {
    try {
      const newInterest = await userRepo.deleteInterstById(user, interest);
      return newInterest;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = TwitterService;
