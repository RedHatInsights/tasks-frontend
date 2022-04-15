import React from 'react';
import ReactDOM from 'react-dom';
import Tasks from './AppEntry';

const root = document.getElementById('root');

ReactDOM.render(<Tasks />, root, () =>
  root.setAttribute('data-ouia-safe', true)
);
