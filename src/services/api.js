import request from 'superagent';

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
    if (err.response.error.text) {
      console.log('Beanstalk error : ', JSON.parse(err.response.error.text).errors);
    }

    console.log('Beanstalk error  - ' + err);
  },

  getRepositories(cb) {
    this.api('repositories').end(function (err, res) {
      cb(err, res.body);
    });
  },

  getEnvironments(repoName, cb) {
    this.api(repoName + '/server_environments').end(function (err, res) {
      if (err) {
        this.reportError(err);
      }

      cb(err,
          res.body.map(({server_environment}) => server_environment),
      );
    });
  },
  environment(repoName, serverEnvironmentId, cb) {
    this.api(repoName + '/server_enironments/' + serverEnvironmentId).end(function (err, res) {
      cb(err, res.body);
    });
  },
  release(repoId, releaseId, cb) {
    this.api(repoId + '/releases/' + releaseId).end(function (err, res) {
      cb(err, res.body.release);
    });
  },

  deploy(repoId, serverEnvironmentId, revision, comment, cb) {
    var release = {
      revision: revision
    };

    if (comment) {
      release.comment = comment;
    }

    this.api(repoId + '/releases.json?environment_id=' + serverEnvironmentId, 'POST')
      .send({ release: release })
      .end(function (err, res) {
        cb(err, res.body.release);
      });
  },
  
  changeSet(revisionHash, repoId, cb) {
    this.api('changesets/' + revisionHash + '.json?repository_id=' + repoId).end(function(err, res) {
      cb(err, res.body)
    })
  },
  
  changeSetDiffs(revisionHash, repoId, cb) {
    this.api('changesets/' + revisionHash + '/differences.json?repository_id=' + repoId).end(function(err, res) {
      cb(err, res.body)
    })
  }
}

export default beanstalk
