# FTPloy

> A simple (CLI) tool to deploy stuff via FTP

[![Build Status](https://travis-ci.org/rasshofer/ftploy.svg)](https://travis-ci.org/rasshofer/ftploy)
[![Dependency Status](https://david-dm.org/rasshofer/ftploy/status.svg)](https://david-dm.org/rasshofer/ftploy)
[![Dependency Status](https://david-dm.org/rasshofer/ftploy/dev-status.svg)](https://david-dm.org/rasshofer/ftploy)

(Check out [sftploy](https://www.npmjs.com/package/sftploy) for SFTP deployments.)

## Usage

```shell
npm install --save-dev ftploy
```

```js
var ftploy = require('ftploy');

ftploy({
  username: 'john',
  password: 'abc123',
  host: 'example.com',
  port: 21,
  localRoot: './build',
  remoteRoot: '/www/example.com/'
  exclude: [
    '.git'
  ]
}).then(function () {
  console.log('Deployment successful.');
}).catch(function (error) {
  console.error('Deployment failed.', error);
});
```

## CLI

```shell
npm install -g ftploy
```

```shell
$ ftploy
```

The following options may be stored within a `ftploy.json` file in the root of your project or passed as parameters or environment variables (prefixed using `ftploy_`). For example, your username and password may be provided in the following three ways.

### `ftploy.json` file

```json
{
  "username": "john",
  "password": "abc123"
}
```

### Parameters

```shell
$ ftploy --username="john" --password="abc123"
```

### Environment variables

```shell
$ FTPLOY_USERNAME="john" FTPLOY_PASSWORD="abc123" ftploy
```

## Options

### `username`

The FTP username.

### `password`

The FTP password. In case no password is provided, the CLI will prompt you for it.

### `host`

The FTP host.

### `port`

The FTP port.

Default: `21`

### `files`

An array of files or a glob pattern to select files to upload.

Default: `**/*` (= glob pattern for all files and directories within the provided `localRoot`; see below)

### `localRoot`

The local directory whose contents FTPloy will upload.

Default: `process.cwd()` (= the directory you’re running the CLI in)

### `remoteRoot`

The remote directory where FTPloy will upload the contents to.

Default: `/`

### `exclude`

Certain files (matching the respective glob patterns) that shall be ignored by FTPloy. In most cases, you may want to exclude your `.git` directory or directories like `node_modules`.

If you’re using an array of files instead of an glob pattern within the `files` option, `exclude` will be ignored.

#### Examples

```shell
$ ftploy --exclude=*.jpg --exclude=*.png --exclude=node_modules/**/*
```

```json
{
  "exclude": [
    "*.jpg",
    "*.png"
  ]
}
```

## Changelog

* 0.0.4
  * Create remote root directory as well in case it does not exist yet
  * Update dependencies
* 0.0.3
  * Include dot files during deployments
* 0.0.2
  * Add shebang
  * Update dependencies
* 0.0.1
  * Initial version

## License

Copyright (c) 2016 [Thomas Rasshofer](http://thomasrasshofer.com/)  
Licensed under the MIT license.

See LICENSE for more info.
