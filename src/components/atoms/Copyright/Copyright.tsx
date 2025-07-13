import React from 'react';
import './Copyright.css';

const Copyright: React.FC = () => (
  <footer className="copyright-footer">
    © {new Date().getFullYear()} <span className="copyright-brand">Wise Track</span>. All rights reserved.
  </footer>
);

export default Copyright; 