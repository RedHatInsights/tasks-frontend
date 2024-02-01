import React from 'react';
import { createRoot } from 'react-dom/client';
import Tasks from './AppEntry';

const container = document.getElementById('root');
const root = createRoot(container);

render(<Tasks />, root, () => root.setAttribute('data-ouia-safe', true));
