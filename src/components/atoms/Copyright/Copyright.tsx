import React from 'react';
import './Copyright.css';

const Copyright: React.FC = () => (
  <footer className="copyright-footer">
    <div className="footer-content">
      <div className="footer-left">
        © {new Date().getFullYear()} <span className="copyright-brand">Wise Track</span>. All
        rights reserved.
      </div>
      <div className="footer-links">
        <a href="/privacy" className="footer-link">
          About
        </a>
        <a href="/privacy" className="footer-link">
          Newsletter
        </a>
        <a href="mailto:support@wisetrack.com" className="footer-link">
          Contact
        </a>
      </div>
      <div className="footer-right">Made with ❤️ by Wise Track Team</div>
    </div>
  </footer>
);

export default Copyright;
