import React from 'react';
import { createRoot } from 'react-dom/client';
import TasksDev from './DevEntry';

const container = document.getElementById('root');
const root = createRoot(container);

render(<TasksDev />, root, () => root.setAttribute('data-ouia-safe', true));

export default TasksDev;
