import axios from 'axios';

export default class TelegramSendMessage {
  async send(message) {
    try {
      message = encodeURIComponent(JSON.stringify(message)).replace(/%22/g, '').replace(/%5Cn/g, "%0a");
      const url = `https://api.telegram.org/bot1714462207:AAEb4aNR4SPrhuIZNRgIIBZi9NX6cadLe4k/sendMessage?chat_id=@tinhle_tw&text=${message}`
      return axios.get(url)
    } catch (e) {
      console.log('send err', e)
    }
  }
}


