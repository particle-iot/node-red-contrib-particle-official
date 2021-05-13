# Node-RED Particle nodes

![](images/red-subscribe-publish.gif)

## Installation

```bash
$ cd ~/.node-red
$ npm install @particle/node-red-contrib-particle-official
```

## Version History

#### 0.1.7 (2021-05-13)

- Upgrade lodash from 4.17.19 to 4.17.21 for security vulnerability fix

#### 0.1.6 (2020-11-30)

- Fixed a bug where a subscribe node would keep using the same value it received on the first event, even if the value changed.
    "lodash": "^4.17.19",
    "lodash": "^4.17.21",