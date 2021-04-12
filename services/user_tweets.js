// Get User Tweet timeline by user ID
// https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/quick-start

import axios from 'axios';
import constants from "../config/constants.js";
import TelegramSendMessage  from "./telegram-send-message.js";
const telegramSendMessage = new TelegramSendMessage();

// this is the ID for @TwitterDev
const userId = "902926941413453824";

// The code below sets the bearer token from your environment variables
// To set environment variables on macOS or Linux, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'

export default class TweetService {
  users = constants.users

  constructor(props) {
    this.bearerToken = process.env.BEARER_TOKEN;
  }

  async getTimeLine(userId) {
    try {
      let self = this;
      var config = {
        method: 'get',
        url: `https://api.twitter.com/2/users/${userId}/tweets`,
        headers: {
          'Authorization': `Bearer AAAAAAAAAAAAAAAAAAAAAC7IOQEAAAAAVEnIYwAyzizTxmGF6TfxPVRdLIg%3D6Zbu3iqBMDy7kyivahWmdrGAmjizxxxc3Ck0Ux17kR6IhsIsJx`,
        }
      };

      return axios(config)
        .then(function (response) {
          if (response.data) {
            if (self.users[userId].newest_id == response.data.data[0].id) return;
            self.users[userId].newest_id = response.data.data[0].id;
            console.log(response.data.data[0].text)
            telegramSendMessage.send(self.users[userId].name + '\n' + response.data.data[0].text)

          }
        })
        .catch(function (error) {
          console.log(error);
        });

    } catch (err) {
      throw new Error(`Request failed: ${err}`);
    }
  }

  async getUserTweets() {
    try {
      setInterval(async () => {
        for (const key of Object.keys(this.users)) {
          await this.getTimeLine(key);
        }
      }, 5000);


    } catch (e) {

    }

  }
}

