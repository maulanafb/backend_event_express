const axios = require('axios');

const sendWhatsAppMessage = async (no_tlp, message) => {
    const urlAPI = 'http://203.24.50.139:40001/send-message';
    const data = {
        sender: 'coba',
        number: no_tlp,
        message: message,
    };

    try {
        const response = await axios.post(urlAPI, data);
        console.log('Response:', response.data);
        console.log('mengirim');
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

module.exports = sendWhatsAppMessage;
