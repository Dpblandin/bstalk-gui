var colors = [
  'white',
  'pink',
  'red',
  'red-orange',
  'orange',
  'yellow',
  'yellow-green',
  'aqua-green',
  'green',
  'green-blue',
  'sky-blue',
  'light-blue',
  'blue',
  'orchid',
  'violet',
  'brown',
  'black',
  'grey'
];

const request = require('superagent');
const _ = require('underscore');

const beanstalk = {

    config: {
      account: '',
      username: '',
      token: ''
    },

    setConfig(config) {
      this.config = config
    },

    api(endpoint, method) {
        const vmethod = typeof method === 'undefined' ? 'GET' : 'POST';
        const url = 'https://' + this.config.account + '.beanstalkapp.com/api/' + endpoint + '.json';
        const req = vmethod === 'GET' ? request.get(url) : request.post(url);

        return req
            .auth(this.config.username, this.config.token)
            .set('Content-Type', 'application/json');
    },

    reportError(err) {
        if(err.response.error.text){
            console.log('Beanstalk error : ', JSON.parse(err.response.error.text).errors);
        }

        console.log('Beanstalk error  - '+  err);
    },

    getRepositories(cb) {
        this.api('repositories').end(function(err, res){

            cb(err, res.body);
        });
    },

    getEnvironments(repoName, cb) {
        this.api(repoName + '/server_environments').end(function(err, res) {
            if (err) {
                this.reportError(err);
            }

            cb( err,
                _.indexBy(
                    _.map(res.body, function(item) {
                        return item.server_environment;
                    }),
                    'name'
                )
            );
        });
    },
    environment(repoName, serverEnvironmentId, cb) {
        this.api(repoName + '/server_enironments/' + serverEnvironmentId).end(function(err, res){
            if(err){
                this.reportError(err);
            }

            cb(res.body);
        });
    },
   release(repoId, releaseId, cb) {
     this.api(repoId + '/releases/' + releaseId).end(function (err, res) {
       if (err) {
         this.reportError(err);
       }

       cb(res.body.release);
     });
   },

  checkReleaseState(repoId, releaseId, delay, cb) {

    setTimeout(() => {

      this.release(repoId, releaseId, (release) => {
        switch (release.state) {

          case 'waiting':
            this.checkReleaseState(repoId, releaseId, 2000, cb);
            break;

          case 'pending':
            this.checkReleaseState(repoId, releaseId, 2000, cb);
            break;

          case 'skipped':
            cb.call('skipped');
            break;

          case 'failed':
            cb.call('failed');
            break;

          case 'success':
            cb.call('success');
            break;

          default:
            cb.call(release.state);
            break;
        }
      });

    }, delay || 0);
  },

deploy(repoId, serverEnvironmentId, revision, comment, cb) {
        var release = {
            revision: revision
        };

        if(comment){
            release.comment = comment;
        }

        this.api(repoId + '/releases.json?environment_id='+serverEnvironmentId, 'POST')
            .send({ release: release })
            .end(function(err, res){
                cb(err, res.body.release);
            });
    }
}


function repo(repoName, cb) {
  logger.log('Getting repo');

  api('repositories/' + repoName).end(function(err, res){
     if(err){
       reportError(err);
     }

     cb(res.body);
  });
}

function createRepo(repoName, color, cb) {
  var repository = {
    type_id: "git",
    name: repoName,
    title: repoName
  };

  if(color){
      repository.color_label = 'label-' + color;
  }

  logger.spin('working');

  api('repositories', 'POST')
    .send({ repository: repository })
    .end(function(err, res){
      logger.stopSpinner();

      if(err){
        reportError(err);
      }

      cb(res.body.repository);
    });
}

function branches(repoName, cb) {
  logger.log('Getting repo branches');

  api('repositories/' + repoName + '/branches').end(function(err, res){
     if(err){
       reportError(err);
     }

     cb(res.body);
  });
}

function getEnvironments(repoName, cb) {
  logger.log('Getting server environment');

  api(repoName + '/server_environments').end(function(err, res){
     if(err){
       reportError(err);
     }

     cb(
        _.indexBy(
            _.map(res.body, function(item){
              return item.server_environment;
            }),
            'name'
        )
      );
  });
}

function environment(repoName, serverEnvironmentId, cb) {
  logger.log('Getting server environments');

  api(repoName + '/server_enironments/' + serverEnvironmentId).end(function(err, res){
     if(err){
       reportError(err);
     }

     cb(res.body);
  });
}

function deploy(repoName, serverEnvironmentId, revision, comment, cb) {
  var release = {
      revision: revision
  };

  if(comment){
      release.comment = comment;
  }

  api(repoName + '/releases.json?environment_id='+serverEnvironmentId, 'POST')
    .send({ release: release })
    .end(function(err, res){
      if(err){
        reportError(err);
      }

      cb(res.body.release);
    });
}

function release(repoName, releaseId, cb) {
  api(repoName + '/releases/' + releaseId).end(function(err, res){
     if(err){
       reportError(err);
     }

     cb(res.body.release);
  });
}

function isValidColor(color) {
  return _.contains(colors, color);
}

function availableColors() {
  return colors;
}

module.exports = beanstalk;
