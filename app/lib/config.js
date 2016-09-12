var fs = require("fs"),
    path = require("path"),
    os = require('os');

const config = {
  homePath() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  },
  configDir() {
    return path.resolve(this.homePath(), ".bstalk-gui");
  },
  configFile() {
    return path.resolve(this.configDir(), "config.json");
  },
  configExists() {
    return fs.existsSync(this.configFile());
  },
  checkAndGetConfigItem(configItem) {
   /* var value = nconf.get(configItem);
     if(!value){
     return false;
     }

     return value;*/
  },
  createConfigFile() {
    var dir = this.configDir();
    var file = this.configFile(dir);

    // Quit if already created
    if (this.configExists()){
     return false;
    }

    // Create directory if it does not exists
    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir, 0o700);
    }

    // Create file
    var template = {
      account: "",
      username: "",
      token: "",
    };

    fs.writeFileSync(file, JSON.stringify(template, null, 4));
    console.log("Blank configuration file saved to: " + file);
    console.log("Please replace required configuration items in this file.");
  },
  get() {
    var dir = this.configDir();
    var file = this.configFile(dir);

    // Check existance
    if (!this.configExists()){
      return false;
    }

    //nconf.file(file);

    return {
      account: this.checkAndGetConfigItem('account'),
      username: this.checkAndGetConfigItem('username'),
      token: this.checkAndGetConfigItem('token')
    };
  }

}

module.exports = config;
