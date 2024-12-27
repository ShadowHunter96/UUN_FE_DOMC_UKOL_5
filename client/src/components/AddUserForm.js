import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const AddUserForm = ({ onAddUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === '' || email.trim() === '') {
      alert('Vyplňte všechna pole!');
      return;
    }
    const newUser = {
      id: Math.random(),
      name,
      email,
    };
    onAddUser(newUser);
    setName('');
    setEmail('');
    alert('Uživatel přidán');
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <h3 className="text-center mb-4">Přidat nového uživatele</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Jméno</Form.Label>
              <Form.Control
                type="text"
                placeholder="Zadejte jméno"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Zadejte email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <div className="text-center">
              <Button variant="primary" type="submit">
                Přidat uživatele
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddUserForm;
