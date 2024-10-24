#!/bin/sh -ex

# Merge coverage reports from cypress and jest tests
mkdir -p reports
cp cypress-coverage/coverate-final.json reports/from-cypress.json