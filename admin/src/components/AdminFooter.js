import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const AdminFooter = () => {
  return (
    <footer className="footer-admin mt-auto py-3">
      <Container>
        <Row>
          <Col className="text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Prime Drink Investment Admin Panel. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default AdminFooter;