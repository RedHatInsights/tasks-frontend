#!/bin/bash
set -e
set -x

# map master branch to stage-beta environment
if [[ "${TRAVIS_BRANCH}" = "master" ]]; then
    echo "PUSHING stage-beta"
    rm -rf ./dist/.git
    BUILD_BETA=true npm run travis:build
    .travis/release.sh "stage-beta"
fi

if [[ "${TRAVIS_BRANCH}" = "prod-beta" ]]; then
    echo "PUSHING ${TRAVIS_BRANCH}"
    rm -rf ./build/.git
    BUILD_BETA=true npm run travis:build
    .travis/release.sh "${TRAVIS_BRANCH}"
fi

if [[ "${TRAVIS_BRANCH}" = "stage-stable" || "${TRAVIS_BRANCH}" = "prod-stable" ]]; then
    echo "PUSHING ${TRAVIS_BRANCH}"
    rm -rf ./build/.git
    BUILD_STABLE=true npm run travis:build
    .travis/release.sh "${TRAVIS_BRANCH}"
fi
