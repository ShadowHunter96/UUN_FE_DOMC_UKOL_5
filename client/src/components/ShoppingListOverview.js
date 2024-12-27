import React, { useEffect, useState } from "react";
import { Button, Row, Col, Modal, Form, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ShoppingListTile from "../components/ShoppingListTile";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const translations = {
  en: {
    shoppingLists: "Shopping Lists",
    addNewList: "Add New List",
    showActive: "Show Active Only",
    showAll: "Show All",
    userPanel: "User Panel",
    adminPanel: "Admin Panel",
    cancel: "Cancel",
    add: "Add",
    listName: "List Name",
    failedToLoad: "Failed to load data",
  },
  cz: {
    shoppingLists: "Nákupní Seznamy",
    addNewList: "Přidat nový seznam",
    showActive: "Zobrazit pouze aktivní",
    showAll: "Zobrazit vše",
    userPanel: "Uživatelský panel",
    adminPanel: "Admin panel",
    cancel: "Zrušit",
    add: "Přidat",
    listName: "Název seznamu",
    failedToLoad: "Nepodařilo se načíst data",
  },
};

const ShoppingListOverview = () => {
  const [showListModal, setShowListModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [lists, setLists] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const currentUserId = 1;

  const { theme } = useTheme(); // Access theme context
  const { language } = useLanguage(); // Access language context

  const t = translations[language]; // Get translations for current language

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [listsRes, usersRes] = await Promise.all([
          fetch("http://localhost:3001/lists"),
          fetch("http://localhost:3001/users"),
        ]);

        if (!listsRes.ok || !usersRes.ok) throw new Error(t.failedToLoad);

        const listsData = await listsRes.json();
        const usersData = await usersRes.json();

        setLists(listsData);
        setUsers(usersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t.failedToLoad]);

  const handleAddList = () => {
    const newList = {
      id: lists.length + 1,
      name: newListName,
      users: [currentUserId],
      archived: false,
      items: [],
    };
    setLists([...lists, newList]);
    setNewListName("");
    setShowListModal(false);
  };

  const handleDeleteList = (listId) => {
    const updatedLists = lists.filter((list) => list.id !== listId);
    setLists(updatedLists);
  };

  const filteredLists = lists.filter(
    (list) =>
      list.users.includes(currentUserId) && (showArchived || !list.archived)
  );

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div
      className="container"
      style={{
        backgroundColor: theme === "light" ? "#ffffff" : "#121212",
        color: theme === "light" ? "#000000" : "#ffffff",
        minHeight: "100vh", // Ensure the entire viewport is covered
        padding: "20px",
      }}
    >
      <h1 className="my-4">{t.shoppingLists}</h1>
      <div className="d-flex justify-content-between align-items-center">
        <Button variant="primary" onClick={() => setShowListModal(true)}>
          {t.addNewList}
        </Button>
        <Button
          variant={showArchived ? "secondary" : "primary"}
          onClick={() => setShowArchived(!showArchived)}
        >
          {showArchived ? t.showActive : t.showAll}
        </Button>
        <Button variant="success" onClick={() => navigate("/userPanel")}>
          {t.userPanel}
        </Button>
        <Button variant="warning" onClick={() => navigate("/adminPanel")}>
          {t.adminPanel}
        </Button>
      </div>

      <div className="mt-4">
        {filteredLists.map((list) => (
          <Row key={list.id}>
            <Col md={6} sm={12} className="mb-4">
              <ShoppingListTile
                list={list}
                users={users}
                onDelete={handleDeleteList}
              />
            </Col>
          </Row>
        ))}
      </div>

      <Modal
        show={showListModal}
        onHide={() => setShowListModal(false)}
        style={{
          backgroundColor: theme === "dark" ? "#121212" : "#ffffff",
          color: theme === "dark" ? "#ffffff" : "#000000",
        }}
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: theme === "dark" ? "#1e1e1e" : "#f9f9f9",
            color: theme === "dark" ? "#ffffff" : "#000000",
          }}
        >
          <Modal.Title>{t.addNewList}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: theme === "dark" ? "#1e1e1e" : "#f9f9f9",
            color: theme === "dark" ? "#ffffff" : "#000000",
          }}
        >
          <Form>
            <Form.Group controlId="newListName">
              <Form.Label>{t.listName}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t.listName}
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                style={{
                  backgroundColor: theme === "dark" ? "#2c2c2c" : "#ffffff",
                  color: theme === "dark" ? "#ffffff" : "#000000",
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: theme === "dark" ? "#1e1e1e" : "#f9f9f9",
            color: theme === "dark" ? "#ffffff" : "#000000",
          }}
        >
          <Button
            variant="secondary"
            onClick={() => setShowListModal(false)}
            style={{
              backgroundColor: theme === "dark" ? "#343a40" : "#f8f9fa",
              color: theme === "dark" ? "#ffffff" : "#000000",
            }}
          >
            {t.cancel}
          </Button>
          <Button
            variant="primary"
            onClick={handleAddList}
            style={{
              backgroundColor: theme === "dark" ? "#007bff" : "#007bff",
              color: theme === "dark" ? "#ffffff" : "#ffffff",
            }}
          >
            {t.add}
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default ShoppingListOverview;
