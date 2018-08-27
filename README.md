# dou-cli

A simple cli for creating and setting up projects in a modular way.
Using this tool will provide you with a quick and easy way to settup and
initialize any of the [Digital On Us](http://www.digitalonus.com) existing base projects.


## Installation

    npm install -g dou-cli


## Usage

### Create

    dou-cli create


`dou-cli create` commmand will create an app, auth, and server folders
in the current directory with the default configurations for each of
these.

#### Options

`app`, `auth`, `server`, and `--view` options can be passed to the
`create` command.

`app`, `auth`, and `server` options are passed to notify the cli if you
just want to setup a specific folder.

`app` option will create an app folder in the current directory and
clone the base project for the selected framework(if existing).

`auth` option will mount a [Keycloak](https://www.keycloak.com) server on your local through a docker
container.

`server` option currently will only create a server folder on the
current directory.

`--view` or `-v` flag is passed to the cli to specify the desired
view(front end) framework to be used. If no view option is passed the
cli will use the default one being `react`.
Current available frameworks are `vue` and `react`.

## Additional Requirements

[Docker](https://www.docker.com) is required if you desire to use the
auth service creation. Download [here](https://www.docker.com/get-docker).
Be sure to be running docker when using the cli.

## Examples

    dou-cli create app

This would setup the app folder with the react base project.

    dou-cli create auth

This command would initialize the auth services and prompt you a series
of questions as desired port to be exposed on and admin user. After that
the cli will mount the docker containers for keycloal.

    dou-cli create --view vue

This would setup auth, server and app folder with the base vue project
for the app folder and default options for auth and server.


    dou-cli create auth app --view react

This would setup the auth and app folder with the react base project for
the app folder.
