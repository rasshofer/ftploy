var fs = require('fs');
var path = require('path');
var glob = require('glob');
var JSFtp = require('jsftp');
var merge = require('lodash.merge');
var isArray = require('lodash.isarray');
var Promise = require('bluebird');

module.exports = function (opts) {

  var options = merge({
    port: 21,
    files: '**/*',
    localRoot: process.cwd(),
    remoteRoot: '/',
  }, opts);

  var ftp;

  function startConnection () {
    return new Promise(function (resolve, reject) {
      ftp = new JSFtp({
        host: options.host,
        port: options.port
      });
      ftp.auth(options.username, options.password, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(ftp);
        }
      });
    });
  }

  function getFiles () {
    return new Promise(function (resolve, reject) {
      if (isArray(options.files)) {
        resolve(options.files);
      } else {
        glob(options.files, {
          cwd: options.localRoot,
          ignore: options.exclude,
          dot: true
        }, function (err, files) {
          if (err) {
            reject(err);
          } else {
            resolve(files);
          }
        });
      }
    });
  }

  function getDirectoriesForCreation () {
    return getFiles().then(function (files) {
      return new Promise(function (resolve) {
        resolve(files.filter(function (file) {
          var localPath = path.resolve(process.cwd(), options.localRoot, file);
          var stats = fs.statSync(localPath);
          return stats && stats.isDirectory();
        }));
      });
    });
  }

  function createRemoteDirectories (directories) {
    return Promise.each([''].concat(directories), function (directory) {
      return new Promise(function (resolve, reject) {
        var remotePath = path.resolve(options.remoteRoot, directory);
        ftp.raw('cwd', remotePath, function (err) {
          if (err) {
            ftp.raw('mkd', remotePath, function (err) {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          } else {
            resolve();
          }
        });
      });
    });
  }

  function getFilesForUpload () {
    return getFiles().then(function (files) {
      return new Promise(function (resolve) {
        resolve(files.filter(function (file) {
          var localPath = path.resolve(process.cwd(), options.localRoot, file);
          var stats = fs.statSync(localPath);
          return stats && !stats.isDirectory();
        }));
      });
    });
  }

  function uploadFiles (files) {
    return Promise.each(files, function (file) {
      return new Promise(function (resolve, reject) {
        var localPath = path.resolve(process.cwd(), options.localRoot, file);
        var remotePath = path.resolve(options.remoteRoot, file);
        ftp.put(localPath, remotePath, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(remotePath);
          }
        });
      });
    });
  }

  function quitConnection () {
    return new Promise(function (resolve, reject) {
      ftp.raw('quit', function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  return startConnection().then(getDirectoriesForCreation).then(createRemoteDirectories).then(getFilesForUpload).then(uploadFiles).then(quitConnection);

};
