import fs from 'fs';
import path from 'path';

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
  uiFile() {
    return path.resolve(this.configDir(), "ui.json");
  },
  reposFile() {
    return path.resolve(this.configDir(), "repositories.json");
  },
  configExists() {
    return fs.existsSync(this.configFile());
  },
  uiExists() {
    return fs.existsSync(this.uiFile());
  },
  createConfigFile() {
    const dir = this.configDir();
    const file = this.configFile();

    // Quit if already created
    if (this.configExists()){
     return false;
    }

    // Create directory if it does not exists
    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir, 0o700);
    }

    // Create file
    const template = {
      account: "",
      username: "",
      token: ""
    };

    fs.writeFileSync(file, JSON.stringify(template, null, 4));

  },
  
  createUiFile() {
    const dir = this.configDir();
    const file = this.uiFile();

    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir, 0o700);
    }
    
    const template = {
      theme: 'light'
    }

    fs.writeFileSync(file, JSON.stringify(template, null, 4));
  },

  createReposFile(repos) {
    const dir = this.configDir();
    const file = this.reposFile();

    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir, 0o700);
    }

    fs.writeFileSync(file, JSON.stringify(repos, null, 4));
  },
  
  loadReposFile(cb) {
    const file = this.reposFile();
    if(fs.existsSync(file)) {
      fs.readFile(file, 'utf-8', (err, data) => {
        cb(err, data)
      })
    }
    else {
      cb(null, false)
    }
  },

  removeReposFile(cb) {
    const file = this.reposFile();
    if(fs.existsSync(file)) {
      fs.unlink(file, (err) => {
        cb(err)
      })
    }
    else {
      cb(true)
    }
  },
  
  updateConfigFile(config, cb) {
    const dir = this.configDir();
    const file = this.configFile(dir);

    fs.writeFile(file, JSON.stringify(config, null, 4), () => {
      cb()
    })
  },
  
  updateUiFile(ui, cb) {
    const dir = this.configDir();
    const file = this.uiFile(dir);

    fs.writeFile(file, JSON.stringify(ui, null, 4), () => {
      cb()
    })
  }

}

export default config
