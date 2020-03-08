const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");

const writeFileAsync = util.promisify(fs.writeFile);

var profile_info = [];

const license_MIT = `MIT License

Copyright (c) 2020 Robert Filkin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`

function prompt_user(){
    //asks user for info
    return inquirer.prompt([
        {
            type: "input",
            name: "username",
            message: "What is your GitHub username?"
        },
        {
          type: "input",
          name: "project_title",
          message: "What is the project title?"
        },
        {
          type: "input",
          name: "description",
          message: "What is the description?"
        },
        {
          type: "input",
          name: "installation",
          message: "What are the installation instructions?"
        },
        {
          type: "input",
          name: "usage",
          message: "What are the usage directions?"
        },
        {
          type: "input",
          name: "contributing",
          message: "What should contributors know?"
        },
        {
          type: "input",
          name: "tests",
          message: "Which tests should be run?"
        }
    ])
}
async function grab_GitHub_Profile(username){
    //queries GitHub api for email and profile image
    const queryUrl = `https://api.github.com/users/${username}`;
    console.log(queryUrl);

    await axios.get(queryUrl).then(function(response) {
      //console.log(response.data);
      profile_info.push(response.data.avatar_url);
      console.log("check here " + response.data.avatar_url)
      profile_info.push(response.data.email);
    });
}

  function generate_ReadMe(data) {

    return `# ${data.project_title}

## Description 
![version](https://img.shields.io/badge/version-1.0.0-green)
${data.description}

## Table of Contents
1. Installation
2. Usage
3. License
4. Contributing
5. Tests
6. Questions

## Installation:
${data.installation}

## Usage
${data.usage}

## License
${license_MIT}

## Contributing
${data.contributing}

## Tests
${data.tests}

## Questions
If you have any questions please contact me, Robert Filkin, at the email below:

![Profile photo](${profile_info[0]})

Email: rfilkin17@gmail.com`;
  }
  
  // prompt_user()
  // .then(function(data){
  //     grab_GitHub_Profile(data.username);

  //     const read_text = generate_ReadMe(data); //prepares the ReadMe text

  //     return writeFileAsync("README.md", read_text); //writes the ReadMe to an extrenal file
  // })
  // .then(function() {
  //     console.log("Successfully wrote to ReadMe"); //confirms that everything worked correctly
  // })
  // .catch(function(err) {
  //     console.log(err); //indicates if something went wrong
  // });

  async function init(){
    const data = await prompt_user();
    console.log("done");
    console.log(data);

    await grab_GitHub_Profile(data.username);

    const read_text = generate_ReadMe(data); //prepares the ReadMe text

    return writeFileAsync("README.md", read_text); //writes the ReadMe to an extrenal file
  };

  init();