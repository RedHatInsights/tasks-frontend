import React from 'react';
import propTypes from 'prop-types';
import { Grid, GridItem } from '@patternfly/react-core';
import EntryRowLabel from './EntryRowLabel';
import severityMap from '../TaskEntries';

const EntryDetails = ({ entry, taskConstantMapper }) => {
  const { detail, key, severity, summary, title } = entry;

  const getLabelType = () => {
    return (
      <EntryRowLabel
        color={
          severityMap[taskConstantMapper][severity.toLowerCase()][
            'severityColor'
          ]
        }
        icon={severityMap[taskConstantMapper][severity.toLowerCase()]['icon']}
        text={severityMap[taskConstantMapper][severity.toLowerCase()]['text']}
      />
    );
  };

  const renderDiagnosisDetails = () => {
    return (
      <div>
        <span>{detail.diagnosis.context}</span>
      </div>
    );
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
        <GridItem
          xl2={5}
          xl={5}
          l={6}
          m={7}
          sm={8}
          style={{ whiteSpace: 'pre-line' }}
        >
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
        {detail?.diagnosis?.context
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
  taskConstantMapper: propTypes.string,
};

export default EntryDetails;
