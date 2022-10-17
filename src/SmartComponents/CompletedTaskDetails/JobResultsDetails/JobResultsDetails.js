import React, { useState } from 'react';
import propTypes from 'prop-types';
import { TableComposable, Tbody, Tr, Td } from '@patternfly/react-table';
import { buildResultsRows } from './jobResultsDetailsHelpers';

const JobResultsDetails = ({ item }) => {
  const rowPairs = buildResultsRows(item.results.report_json.entries);
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

  return (
    <div>
      <TableComposable
        variant="compact"
        style={{
          marginBottom: '30px',
          '--pf-c-table__expandable-row--after--border-width--base': '0',
        }}
      >
        <Tbody>
          {rowPairs.map((row, pairIndex) => {
            return (
              <React.Fragment key={pairIndex}>
                {renderParentRow(row.parent, pairIndex)}
                {renderChildRow(row.child, pairIndex)}
              </React.Fragment>
            );
          })}
        </Tbody>
      </TableComposable>
    </div>
  );
};

JobResultsDetails.propTypes = {
  item: propTypes.object,
};

export default JobResultsDetails;
