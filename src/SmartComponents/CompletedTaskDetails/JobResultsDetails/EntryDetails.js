import React from 'react';
import propTypes from 'prop-types';
import { Grid, GridItem } from '@patternfly/react-core';
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
} from '@patternfly/react-icons';
import EntryRowLabel from './EntryRowLabel';

const EntryDetails = ({ entry }) => {
  const { detail, key, severity, summary, title } = entry;

  const getLabelType = () => {
    if (severity === 'info') {
      return <EntryRowLabel color="blue" icon={InfoCircleIcon} text="Info" />;
    } else if (severity === 'low') {
      return (
        <EntryRowLabel
          color="orange"
          icon={ExclamationTriangleIcon}
          text="Low risk"
        />
      );
    } else if (severity === 'high') {
      return (
        <EntryRowLabel
          color="red"
          icon={ExclamationCircleIcon}
          text="High risk"
        />
      );
    }
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
        <GridItem xl2={5} xl={5} l={6} m={7} sm={8}>
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
