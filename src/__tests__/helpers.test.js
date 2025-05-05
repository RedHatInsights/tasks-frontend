import React from 'react';
import { populateRHELAIColumn } from '../helpers';
import { Icon, Tooltip } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';

describe('populateRHELAIColumn', () => {
  it('should return "N/A" when not a bootc image or not a RHEL AI image"', () => {
    expect(populateRHELAIColumn({})).toEqual('N/A');
    expect(
      populateRHELAIColumn({
        bootc_status: { booted: { image: 'registry/image:latest' } },
      })
    ).toEqual('N/A');
  });

  it('should return "Unknown" when RHEL AI image version is not a known version', () => {
    expect(
      populateRHELAIColumn({
        bootc_status: { booted: { image: 'registry/rhelai1/image:version' } },
      })
    ).toEqual('Unknown');
  });

  it('should not display exclamation icon when RHEL AI version is the latest version', () => {
    const result = populateRHELAIColumn({
      bootc_status: { booted: { image: 'registry/rhelai1/image:1.5' } },
    });
    expect(result).toEqual(<span>1.5</span>);
  });

  it('should display tooltip/icon when RHEL AI version is not the latest', () => {
    const result = populateRHELAIColumn({
      bootc_status: {
        booted: { image: 'registry/rhelai1/image:1.1-1724974282' },
      },
    });
    expect(result).toEqual(
      <Tooltip
        position="top-start"
        content={
          <div>A later version of this system&#39;s image is available</div>
        }
      >
        <div>
          <Icon size="sm" status="warning">
            <ExclamationTriangleIcon />
          </Icon>
          <span style={{ marginLeft: '0.5rem' }}>1.1-1724974282</span>
        </div>
      </Tooltip>
    );
  });
});
