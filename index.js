/*import TweetService from './services/user_tweets.js'

const tw = new TweetService();
(async () => await tw.getUserTweets())();*/
import TelegramSendMessage  from "./services/telegram-send-message.js";
const telegramSendMessage = new TelegramSendMessage();

import Tweet from './services/filtered_stream.js';
const token = 'AAAAAAAAAAAAAAAAAAAAAC7IOQEAAAAABel%2FEv4Rm4pmHDqDFxcnkL8Hh7c%3DgnGwiMfAmCrZcqCbKD3USNCnOrmSTPkN3nhyEIuoj8P3firvr5';
const rules = [
  { "value": "from:902926941413453824" },
  { "value": "from:877807935493033984" },
  { "value": "from:2280911444" },
  { "value": "from:44196397" },
  { "value": "from:720487892670410753" },
  { "value": "from:886832413" },
];
let xnxx = new Tweet(token, rules)

xnxx.streamConnect(5, (data) => {
  console.log(data)
  telegramSendMessage.send(data.data.text)
})
