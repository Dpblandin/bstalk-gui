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

module.exports = beanstalk;
