# filecoin-contributors

> Script to generate a list of the contributors to Filecoin since a given date

![Screenshot](https://raw.githubusercontent.com/filecoin-project/filecoin-contributors/master/screenshot.png)

## Install

Install dependences:

* [Node.js](https://nodejs.org/en/)

Then:

```sh
npm install -g filecoin-contributors
```

Or, install from source:

```sh
# Clone the repo
git clone https://github.com/filecoin-project/filecoin-contributors.git
cd filecoin-contributors

# Install project dependencies
npm install
```

## Usage

Simply run the tool by typing the following at the command line:

```sh
filecoin-contributors
```

Or, if you've installed from source:

```sh
npm start
```
Then follow the prompts. You will need a [Github personal access token](https://github.com/settings/tokens/) with the following scopes:
* public_repo
* read_user

Note: It may take a long time! Please be patient!

## License

The Filecoin Project is dual-licensed under Apache 2.0 and MIT terms:

- Apache License, Version 2.0, ([LICENSE-APACHE](https://github.com/filecoin-project/go-filecoin/blob/master/LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT license ([LICENSE-MIT](https://github.com/filecoin-project/go-filecoin/blob/master/LICENSE-MIT) or http://opensource.org/licenses/MIT)
