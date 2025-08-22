import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3">
      <Container>
        <Row>
          <Col className="text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Prime Drink Investment. All rights reserved.
            </p>
            <p className="mb-0">
              <a 
                href="https://t.me/primedrink" 
                target="_blank" 
                rel="noopener noreferrer"
                className="telegram-link"
              >
                Join our Telegram Channel
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;