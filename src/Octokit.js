import Octokit from '@octokit/rest';
import * as storage from './storage';

export default {
  get () {
    const octokit = new Octokit();

    const GITHUB_TOKEN = storage.local.getItem('githubToken');
    if (GITHUB_TOKEN !== null) {
      octokit.authenticate({
        type: 'token',
        token: GITHUB_TOKEN
      });
      octokit.auth = true;
    } else {
      octokit.auth = false;
    }

    return octokit;
  }
};


