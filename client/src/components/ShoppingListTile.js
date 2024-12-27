import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const translations = {
  en: {
    owner: "Owner",
    deleteConfirmation: "Delete Confirmation",
    deletePrompt: "Are you sure you want to delete this list?",
    cancel: "Cancel",
    delete: "Delete",
    detail: "Detail",
  },
  cz: {
    owner: "Vlastník",
    deleteConfirmation: "Potvrzení mazání",
    deletePrompt: "Opravdu chcete tento seznam smazat?",
    cancel: "Zrušit",
    delete: "Smazat",
    detail: "Detail",
  },
};

const ShoppingListTile = ({ list, users, onDelete }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { theme } = useTheme(); // Access theme context
  const { language } = useLanguage(); // Access language context
  const t = translations[language]; // Get translations for current language

  const handleClose = () => setShowDeleteModal(false);
  const handleShow = () => setShowDeleteModal(true);

  const handleConfirmDelete = () => {
    onDelete(list.id);
    handleClose();
  };

  // Find the owner of the list
  const owner = users.find((user) => user.id === list.users[0]);

  return (
    <div
      className="p-3 shadow-sm rounded"
      style={{
        border: "1px solid #ddd",
        backgroundColor: theme === "dark" ? "#333" : "#f9f9f9",
        color: theme === "dark" ? "#fff" : "#000",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>{list.name}</h4>
        <div>
          <Button
            variant={theme === "dark" ? "outline-light" : "info"}
            size="sm"
            className="me-2"
            onClick={() => navigate(`/list/${list.id}`)}
          >
            {t.detail}
          </Button>
          <Button
            variant={theme === "dark" ? "outline-danger" : "danger"}
            size="sm"
            onClick={handleShow}
          >
            {t.delete}
          </Button>
        </div>
      </div>

      <div>
        <strong>{t.owner}:</strong> {owner ? owner.name : "Unknown"}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "10px",
          alignItems: "center",
        }}
      >
        {list.items.map((item) => (
          <div key={item.id} style={{ display: "contents" }}>
            <div
              style={{
                fontWeight: item.completed ? "bold" : "normal",
              }}
            >
              {item.name}
            </div>
            <Form.Check
              type="checkbox"
              defaultChecked={item.completed}
              style={{ justifySelf: "end" }}
            />
          </div>
        ))}
      </div>

      <Modal show={showDeleteModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t.deleteConfirmation}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t.deletePrompt}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t.cancel}
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            {t.delete}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ShoppingListTile;
