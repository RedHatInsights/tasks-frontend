import React from 'react';
import propTypes from 'prop-types';
import { Grid, GridItem } from '@patternfly/react-core';
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
} from '@patternfly/react-icons';
import EntryRowLabel from './EntryRowLabel';
// import {LeappEntryDetails, Convert2RHELEntryDetails} from '../TaskEntries';

const task_slug = "Convert2RHEL"

const EntryDetails = ({ entry, mapping }) => {
  const { detail, diagnosis, key, severity, summary, title } = entry;

// we have severities that need to be used somehow and need to be mapped here
  var severity_map = {
      "Convert2RHEL": {
          "high": {
              "text": "Inhibitor",
              "color": "red",
              "icon": "<ExclamationCircleIcon/>"
          },
          "low": {
              "text": "Warning",
              "color": "orange",
              "icon": "<ExclamationTriangleIcon/>"
          },
          "info": {
              "text": "Info",
              "color": "blue",
              "icon": "<InfoCircleIcon/>"
          },
          "skip": {
              "text": "Skipped",
              "color": "red",
              "icon": "<ExclamationCircleIcon/>"
          },
          "overridable": {
              "text": "Overridable",
              "color": "red",
              "icon": "<ExclamationcCircleIcon/>"
          }
      },
      "Leapp": {
          "high": {
              "text": "High risk",
              "color": "red",
              "icon": "<ExclamationCircleIcon/>"
          },
          "low": {
              "text": "Low risk",
              "color": "orange",
              "icon": "<ExclamationTriangleIcon/>"
          },
          "info": {
              "text": "Info",
              "color": "blue",
              "icon": "<InfoCircleIcon/>"
          }
      }
  }

  console.log(severity, "severity_value")
  console.log(severity_map["Convert2RHEL"][severity], "severity")

  const getLabelType = () => {


          return (
              <EntryRowLabel color={severity_map[task_slug][severity]["color"]} icon={severity_map[task_slug][severity]["icon"]} text={severity_map[task_slug][severity]["text"]}/>)


  };

  const renderDiagnosisDetails = () => {
    return detail.diagnosis.map((diagnosis, index) => {
      let diagnosisKey = `diagnosis-${index}`;
      return (
        <div key={diagnosisKey}>
          {index > 0 ? (
            <span>
              <br />
            </span>
          ) : null}
          <span style={{ fontFamily: 'overpass-mono' }}>
            {diagnosis.context}
          </span>
        </div>
      );
    });
  };


  const renderRemediationsDetails = () => {
    return detail.remediations.map((remediation, index) => {
      let remediationKey = `remediation-${index}`;
      return (
        <div key={remediationKey}>
          {index > 0 ? (
            <span>
              <br />
            </span>
          ) : null}
          <span style={{ fontFamily: 'overpass-mono' }}>
            [{remediation.type}] {remediation.context}
          </span>
        </div>
      );
    });
  };


  const createGrid = (itemOneContent, itemTwoContent) => {
    return (
      <Grid hasGutter className="entry-detail-title">
        <GridItem span={2} className="entry-detail-content">
          {itemOneContent}
        </GridItem>
        <GridItem xl2={5} xl={5} l={6} m={7} sm={8} style={{ whiteSpace: 'pre-line' }}>
          {typeof itemTwoContent === 'function'
            ? itemTwoContent()
            : itemTwoContent}
        </GridItem>
      </Grid>
    );
  };

  const renderDetails = () => {
    return (
      <React.Fragment>
        {createGrid('Summary', summary)}
        {detail?.diagnosis
          ? createGrid('Diagnosis', renderDiagnosisDetails)
          : null}
        {detail?.remediations
          ? createGrid('Remediation', renderRemediationsDetails)
          : null}
        {createGrid('Key', key)}
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <div>{getLabelType()}</div>
      <div className="entry-title">{title}</div>
      <div>{renderDetails()}</div>
    </React.Fragment>
  );
};


EntryDetails.propTypes = {
  entry: propTypes.object,
};

export default EntryDetails;
