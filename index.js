const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");

const writeFileAsync = util.promisify(fs.writeFile);
var profile_info = [];

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
          name: "TOC",
          message: "What is the table of contents?"
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
          name: "license",
          message: "What is the license?"
        },
        {
          type: "input",
          name: "contributing",
          message: "Who are the contributors?"
        },
        {
          type: "input",
          name: "tests",
          message: "Tests?"
        },
        {
          type: "input",
          name: "questions",
          message: "Questions?"
        }
    ])
}
async function grab_GitHub_Profile(username){
    //queries GitHub api for email and profile image
    const queryUrl = `https://api.github.com/users/${username}`;
    console.log(queryUrl);

    axios.get(queryUrl).then(function(response) {
      //console.log(response.data);
      profile_info.push(response.data.avatar_url);
      console.log("check here " + response.data.avatar_url)
      profile_info.push(response.data.email);
    });
}

  function generate_ReadMe(data) {

    return `
    # ${data.project_title}

    UserName: ${data.username}
    
    ## Description 
    ${data.description}

    ## TOC
    ${data.TOC}

    ## Installation:
    ${data.installation}

    ## Usage
    ${data.usage}

    ## License
    ${data.license}

    ## Contributing
    ${data.contributing}

    ## Tests
    ${data.tests}

    ## Questions
    ${data.questions}

    ${profile_info[0]}

    ${profile_info[1]}
    `;
  }
  
  prompt_user()
  .then(function(data){
      grab_GitHub_Profile(data.username);
      
      const read_text = generate_ReadMe(data); //prepares the ReadMe text

      return writeFileAsync("README.md", read_text); //writes the ReadMe to an extrenal file
  })
  .then(function() {
      console.log("Successfully wrote to ReadMe"); //confirms that everything worked correctly
  })
  .catch(function(err) {
      console.log(err); //indicates if something went wrong
  });