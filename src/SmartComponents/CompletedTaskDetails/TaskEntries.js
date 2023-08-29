import {ExclamationCircleIcon, ExclamationTriangleIcon, InfoCircleIcon} from "@patternfly/react-icons";
import React from 'react';


export const severity_map = {
      "Convert2RHEL": {
          "Error": {
              "text": "Inhibitor",
              "color": "red",
              "icon": <ExclamationCircleIcon color='red'/>,
              "level": 3000
          },
          "Overridable": {
              "text": "Overridable",
              "color": "red",
              "icon": <ExclamationCircleIcon color='red'/>,
              "level": 2500
          },
          "Skip": {
              "text": "Skipped",
              "color": "red",
              "icon": <ExclamationCircleIcon color='red'/>,
              "level": 2000
          },
          "Warning": {
              "text": "Warning",
              "color": "orange",
              "icon": <ExclamationTriangleIcon color='orange'/>,
              "level": 1500
          },
          "Info": {
              "text": "Info",
              "color": "blue",
              "icon": <InfoCircleIcon color='blue'/>,
              "level": 1000
          },
      },
      "Leapp": {
          "high": {
              "text": "High risk",
              "color": "red",
              "icon": <ExclamationCircleIcon/>,
              "level": 3000
          },
          "low": {
              "text": "Low risk",
              "color": "orange",
              "icon": <ExclamationTriangleIcon/>,
              "level": 1500
          },
          "info": {
              "text": "Info",
              "color": "blue",
              "icon": <InfoCircleIcon/>,
              "level": 1000
          }
      }
  }