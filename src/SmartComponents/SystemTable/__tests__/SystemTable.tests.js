import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import SystemTable from '../SystemTable';

jest.mock('../hooks', () => {
  const systemsMock = [
    {
      display_name:
        'rhiqe.8d8fe668-c2ee-4034-b174-2af31020402c.email-38.alvarez.com',
      id: '1d2a2d8b-8bb1-48f3-a367-c8ba2f4d8fc3',
      os_version: 'RHEL 8.4',
      updated: '2022-04-20T12:49:29.389485Z',
      tags: [{ key: 'UZYyIQY', value: 'vMRGEY', namespace: 'kQQgFpq' }],
    },
    {
      display_name: 'rhiqe.laptop-44.sanchez-mann.biz',
      id: 'aa28f81c-e7f0-4ee4-af46-0352b0fb50f3',
      os_version: 'RHEL 8.4',
      tags: [
        { key: 'dMVLDZtE', value: 'EcuyHgqoa', namespace: 'SOxjI' },
        { key: 'pJASDVJ', value: 'QhfoGAgZO', namespace: 'TCPVO' },
        { key: 'KAWxWyCKH', value: 'RkZRaq', namespace: 'bzitQU' },
        { key: 'MGTHlDoYt', value: 'yGFpfHc', namespace: 'OJkHjnM' },
        { key: 'fcxDtpYt', value: 'PwOPRFiv', namespace: 'wWZCjhrp' },
      ],
      updated: '2022-05-04T07:08:37.176240Z',
    },
  ];
  return {
    useGetEntities: jest.fn(() => Promise.resolve(systemsMock)),
  };
});

describe('SystemTable', () => {
  let mockStore = configureStore();
  let props;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const store = mockStore(props);
    const { asFragment } = render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <SystemTable selectedIds={[]} />
        </Provider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
