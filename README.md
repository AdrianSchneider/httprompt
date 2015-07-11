# HTTPrompt

[![Build Status](https://travis-ci.org/AdrianSchneider/httprompt.svg?branch=master)](https://travis-ci.org/AdrianSchneider/httprompt) [![Coverage Status](https://coveralls.io/repos/AdrianSchneider/httprompt/badge.svg?branch=master)](https://coveralls.io/r/AdrianSchneider/httprompt?branch=master)

httprompt is an interactive command-line API client.

## Installation

Either fork and run manually, or install via npm:

    npm install -g httprompt

This installs `httprompt` to your bin path.

## Usage

Run `httprompt` to open the prompt. Common commands:

- `GET <url>`
- `POST <url> <payload>`
- `PUT <url> <payload>`
- `DELETE <url>`
- type `help` to see more	

Currently only JSON payloads are supported. `<payload>` can either be:

### Embedded JSON

`POST /register { "username": "admin", "password": "letmein" }`

### Key/Value Pairs

`POST /register username=admin password=letmein` 

`POST /comments message="some message with spaces"`

### External Viewers


By default, each command will just dump output to the screen, which may be hard to read. By running the `open` command, httprompt open the last response in your external. viewer. Alternatively, `open <command>` to always open a command externally.

## Configuration

You can manage config in the app with `config set <key> <value>`, or you can run `config edit` to open the config file in your `$EDITOR`.

Options:

- `external` sets the default external viewer. defaults to `less`
- `external.json` sets the default external json viewer. defaults to `less`. [jsonfui](https://github.com/adrianschneider/jsonfui) is recommended as a better alternative
- `vim` sets vim keys (hjkl to move around, modes, etc)

### Profiles

Edit the `profiles` config option to add new profiles.

The `default` profile is loaded by default, or optionally specify another with `httprompt -p <profileName>`

- `baseUrl`: sets the base URL (prepend to all URLs). Example: `http://yoursite.com` or `http://localhost:8888`
- `vars`: set arbitrary variables here that you can use in commands. For example, if you set `username` and `password`, you could use `$(vars.username)` and `$(vars.password)` in commands and they would be expanded.
- `startupTasks`: defines an array of tasks to run when opening a profile for the first time
- `actions`: defines custom commands made up of existing commands. For example, you could define login:

```
  "baseUrl": "http://localhost:8888",
  "actions": {
    "login <username> <password>": [
      "POST /login username=$(input.username) password=$(input.password)"
    ]
  }
```

then you could log in, and run `login admin letmein` and it would post to that URL.
