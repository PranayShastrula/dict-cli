'use strict';

const minimist = require('minimist');
const Logic = require('./sdk/logic');
const prompt = require('prompt');

async function getSyn(word) {
    let logic = new Logic();
    try {
        let response = await logic.getRelatedWords(word);
        if (response.data && response.data[0].relationshipType === "synonym") {
            return ('Synonyms', response.data[0].words);
        }
        else if (response.data[1].relationshipType === "synonym") {
            return ('Synonyms', response.data[1].words);
        }
        else {
            return ('Synonyms', 'None found');
        }
    } catch (error) {
        return;
    }

}

async function getAnt(word) {
    let logic = new Logic();
    try {
        let response = await logic.getRelatedWords(word);
        if (response.data && response.data[0].relationshipType === "antonym") {
            return ('Antonyms', response.data[0].words);
        }
        else {
            return ('Antonyms', 'None found');
        }
    } catch (error) {
        return;
    }

}

async function compareWord(word,randomWord,syn,ant,dfn) {
    if (String(word).toLowerCase() === String(randomWord).toLowerCase() || Array(syn).includes(String(word).toLowerCase())) {
        console.log('Well Played, Success!!');
        return 1;
    }
    else {
        console.log("Choose one option:\n 1 - try again\n 2 - get hints\n 3 - know the answer and Quit");
        prompt.start();

        prompt.get(['option'], function (err, result) {
            console.log('  Option: ' + result.option);
            
            tryagain(result.option,randomWord,syn,ant,dfn);
        });
    }
}

function tryagain(option,randomWord,syn,ant,dfn) {
    if(option==1){
        getWord(randomWord);
    }
    else if(option==2){
        let myArray = [2,3,4];   
        let rand = myArray[Math.floor(Math.random() * myArray.length)]; 
        console.log("Hints: \n");
        if(rand==2){
            console.log("Other synonym:",syn[Math.floor(Math.random() * Array(syn).length)]);
        }
        else if(rand==3){
            
            console.log("Other Antonym:",ant[Math.floor(Math.random() * Array(ant).length)]);
        }
        else{
            console.log("Other Defination:",dfn.data[Math.floor(Math.random() * Array(dfn.data).length)].text);
        }
        getWord(randomWord,syn,ant,dfn);
        
    }
    else if(option==3){
        console.log("word is",randomWord);
        console.log("Thanks for playing");
    }
}

function getWord(randomWord,syn,ant,dfn){
    let a=null;
    prompt.start();

    prompt.get(['word'], function (err, result) {
        if (err) { return onErr(err); }
        console.log('  Word: ' + result.word);
        a = compareWord(result.word,randomWord,syn,ant,dfn);
        return a;
    });

    function onErr(err) {
        console.log(err);
        return 1;
    }
}


async function play(randomWord) {

    let logic = new Logic();
    let responseJson = null;
    let defn = await logic.getWordDefinitions(randomWord);
    let synonyms = await getSyn(randomWord);
    let antonyms = await getAnt(randomWord);
    let ex = await logic.getWordExamples(randomWord);
    responseJson = {
        "definition": defn.data[0].text,
        "synonyms": synonyms[0],
        "antonyms": antonyms,
        "examples": ex.data.examples[0].text
    };
    console.log(responseJson);
    let res=getWord(randomWord,synonyms,antonyms,defn);

}
module.exports = async () => {

    const args = minimist(process.argv.slice(2));
    console.log(args);
    const cmd = args._[0];
    console.log('cmd', cmd);
    let word = null;
    if (args._[1]) {
        word = args._[1];
    }
    else {
        word = cmd;
    }
    console.log('word', word);

    let logic = new Logic();
    let response = null;
    if (cmd === 'defn') {
        response = await logic.getWordDefinitions(word);
        console.log('Definitions', response.data);
        return;
    }
    else if (cmd === "syn") {
        response = await getSyn(word);
        if (response == undefined) {
            response = "Not found";
        }
        console.log('Synonyms', response);
        return;
    }
    else if (cmd === "ant") {
        response = await getAnt(word);
        if (response == undefined) {
            response = "Not found";
        }
        console.log('Antonyms', response);
        return;
    }
    else if (cmd === "ex") {
        response = await logic.getWordExamples(word);
        console.log('Examples', response.data);
        return;
    }
    else if (cmd === "play") {
        let response = await logic.getRandomWord();
        let randomWord = response.data.word;
        await play(randomWord);
    }
    else if (cmd !== undefined) {
        let responseJson = null;
        let defn = await logic.getWordDefinitions(word);
        let syn = await logic.getRelatedWords(word);
        let ant = await logic.getRelatedWords(word);
        let ex = await logic.getWordExamples(word);
        responseJson = {
            "definitions": defn.data,
            "synonyms": syn.data[0].words,
            "antonyms": ant.data[0].words,
            "examples": ex.data.examples
        };
        console.log('result', responseJson);
        return;
    }
    else if (cmd === undefined) {
        let responseJson = null;
        let randomWord = await logic.getRandomWord().data.word;
        console.log('randomWord', randomWord);
        let defn = await logic.getWordDefinitions(randomWord);
        let syn = await logic.getRelatedWords(randomWord);
        let ant = await logic.getRelatedWords(randomWord);
        let ex = await logic.getWordExamples(randomWord);
        responseJson = {
            "definitions": defn.data,
            "synonyms": syn.data[0].words,
            "antonyms": ant.data[0].words,
            "examples": ex.data
        };
        console.log('result', responseJson);
        return;
    }
    else {

    }

};