const axios = require('axios');
const config = require('../config');

class SDK {
    constructor() {
    }
    getWordDefinitions(word) {
        let url = `${config.baseUrl}/word/${word}/definitions?api_key=${config.apiKey}`;
        return axios({
            method: 'get',
            url: url
        });
    }
    getRelatedWords(word) {
        let url = `${config.baseUrl}/word/${word}/relatedWords?api_key=${config.apiKey}`;
        return axios({
            method: 'get',
            url: url
        });
    }
    getRandomWord() {
        let url = `${config.baseUrl}/words/randomWord?api_key=${config.apiKey}`;
        return axios({
            method: 'get',
            headers:{
                "content-type" : "application/json"
            },
            url: url
        });
    }

    

    getWordExamples(word) {
        let url = `${config.baseUrl}/word/${word}/examples?api_key=${config.apiKey}`;
        return axios({
            method: 'get',
            url: url
        });
    }

   
}
module.exports = SDK;

