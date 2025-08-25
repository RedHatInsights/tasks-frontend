[![Build Status](https://img.shields.io/github/actions/workflow/status/RedhatInsights/tasks-frontend/test.yml?branch=master)](https://github.com/RedHatInsights/tasks-frontend/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/RedHatInsights/tasks-frontend/branch/master/graph/badge.svg)](https://codecov.io/gh/RedHatInsights/tasks-frontend)

## Initial etc/hosts setup

In order to access the https://[env].foo.redhat.com in your browser, you have to add entries to your `/etc/hosts` file. This is a **one-time** setup that has to be done only once (unless you modify hosts) on each machine.

To setup the hosts file run following command:
```bash
npm run patch:hosts
```

## Getting started

1. ```npm install```

2. ```npm run start:proxy```

3. Open browser in URL listed in the terminal output - make sure to use `https` instead of `http`

### Testing

`npm run verify` will run `npm run lint` (eslint) and `npm test` (Jest)