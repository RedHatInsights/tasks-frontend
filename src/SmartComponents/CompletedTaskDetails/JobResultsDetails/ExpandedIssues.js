import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Tr, Td } from '@patternfly/react-table';
import { CodeBlock, CodeBlockCode } from '@patternfly/react-core';
import { c_code_block__header_BorderBottomColor } from '@patternfly/react-tokens';
import { global_palette_white } from '@patternfly/react-tokens';

const ExpandedIssues = ({ rowPairs, isReportJson }) => {
  let rowIndex = 0;

  const [expanded, setExpanded] = useState(
    Object.fromEntries(
      Object.entries(rowPairs).map(([k]) => [k, Boolean(false)])
    )
  );

  const handleExpansionToggle = (event, pairIndex) => {
    setExpanded({
      ...expanded,
      [pairIndex]: !expanded[pairIndex],
    });
  };

  const renderParentRow = (parent, pairIndex) => {
    let parentRow = (
      <Tr key={rowIndex}>
        <Td
          expand={{
            rowIndex: pairIndex,
            isExpanded: expanded[pairIndex],
            onToggle: handleExpansionToggle,
          }}
        />
        <Td>{parent}</Td>
      </Tr>
    );

    rowIndex += 1;
    return parentRow;
  };

  const renderChildRow = (child, pairIndex) => {
    let childRow = (
      <Tr
        className={expanded[pairIndex] === true ? 'pf-m-expanded' : null}
        key={rowIndex}
        isExpanded={expanded[pairIndex] === true}
      >
        <Td />
        <Td>{child}</Td>
      </Tr>
    );

    rowIndex += 1;
    return childRow;
  };

  const renderRows = () => {
    if (isReportJson) {
      return rowPairs.map((row, pairIndex) => {
        return (
          <React.Fragment key={pairIndex}>
            {renderParentRow(row.parent, pairIndex)}
            {renderChildRow(row.child, pairIndex)}
          </React.Fragment>
        );
      });
    } else
      return (
        <CodeBlock
          style={{
            [c_code_block__header_BorderBottomColor.name]: global_palette_white,
            backgroundColor: '#ffffff',
          }}
        >
          <CodeBlockCode>{rowPairs}</CodeBlockCode>
        </CodeBlock>
      );
  };

  return renderRows();
};

ExpandedIssues.propTypes = {
  isReportJson: propTypes.bool,
  rowPairs: propTypes.array,
};

export default ExpandedIssues;
