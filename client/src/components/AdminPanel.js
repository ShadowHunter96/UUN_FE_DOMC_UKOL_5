import React, { useState, useEffect } from "react";
import { Table, Button, Form, Card, InputGroup } from "react-bootstrap";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const translations = {
  en: {
    adminPanel: "Admin Panel",
    itemList: "Item List",
    members: "Members",
    number: "Number",
    item: "Item",
    completed: "Completed",
    actions: "Actions",
    addItem: "Add Item",
    addUser: "Add User",
    delete: "Delete",
    loading: "Loading data...",
    error: "Failed to load data from mock server",
    itemPlaceholder: "Enter item name",
    userPlaceholder: "Enter member name",
    listNotFound: "List not found.",
  },
  cz: {
    adminPanel: "Administrátorský panel",
    itemList: "Seznam položek",
    members: "Členové seznamu",
    number: "Číslo",
    item: "Položka",
    completed: "Dokončeno",
    actions: "Akce",
    addItem: "Přidat položku",
    addUser: "Přidat člena",
    delete: "Smazat",
    loading: "Načítání dat...",
    error: "Nepodařilo se načíst data z mock serveru",
    itemPlaceholder: "Zadejte název položky",
    userPlaceholder: "Zadejte jméno člena",
    listNotFound: "Seznam nebyl nalezen.",
  },
};

const AdminPanel = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();

  const t = translations[language]; // Access translations based on language

  const [currentList, setCurrentList] = useState(null);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from mock server
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [listsRes, usersRes] = await Promise.all([
          fetch("http://localhost:3001/lists"),
          fetch("http://localhost:3001/users"),
        ]);

        if (!listsRes.ok || !usersRes.ok) {
          throw new Error(t.error);
        }

        const listsData = await listsRes.json();
        const usersData = await usersRes.json();

        const selectedList = listsData.find((list) => list.id === 1);
        if (selectedList) {
          setCurrentList(selectedList);
          setItems(selectedList.items);

          const associatedUsers = usersData.filter((user) =>
            selectedList.users.includes(user.id)
          );
          setUsers(associatedUsers);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t.error]);

  const handleAddItem = () => {
    if (newItemName.trim() === "") return;
    setItems((prevItems) => [
      ...prevItems,
      { id: Date.now(), name: newItemName, completed: false },
    ]);
    setNewItemName("");
  };

  const handleDeleteItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleToggleCompleted = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleAddUser = () => {
    if (newUserName.trim() === "") return;
    const userExists = users.find((user) => user.name === newUserName);
    if (!userExists) {
      const newUser = { id: Date.now(), name: newUserName };
      setUsers((prevUsers) => [...prevUsers, newUser]);
    }
    setNewUserName("");
  };

  const handleDeleteUser = (id) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  if (loading) return <p>{t.loading}</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div
      className="p-3"
      style={{
        backgroundColor: theme === "light" ? "#ffffff" : "#121212",
        color: theme === "light" ? "#000000" : "#ffffff",
        minHeight: "100vh",
      }}
    >
      <h1 className="text-center mb-4">{t.adminPanel}</h1>
      {currentList ? (
        <>
          <Card
            className="my-3"
            style={{
              backgroundColor: theme === "light" ? "#f9f9f9" : "#1e1e1e",
              color: theme === "light" ? "#000000" : "#ffffff",
            }}
          >
            <Card.Body>
              <h4>{t.itemList}</h4>
              <Table
                bordered
                hover
                style={{
                  backgroundColor: theme === "light" ? "#ffffff" : "#2c2c2c",
                  color: theme === "light" ? "#000000" : "#ffffff",
                }}
              >
                <thead>
                  <tr>
                    <th>{t.number}</th>
                    <th>{t.item}</th>
                    <th>{t.completed}</th>
                    <th>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td
                        style={{
                          textDecoration: item.completed
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {item.name}
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => handleToggleCompleted(item.id)}
                        />
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          {t.delete}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <InputGroup className="mt-3">
                <Form.Control
                  type="text"
                  placeholder={t.itemPlaceholder}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                <Button variant="success" onClick={handleAddItem}>
                  {t.addItem}
                </Button>
              </InputGroup>
            </Card.Body>
          </Card>

          <Card
            className="my-3"
            style={{
              backgroundColor: theme === "light" ? "#f9f9f9" : "#1e1e1e",
              color: theme === "light" ? "#000000" : "#ffffff",
            }}
          >
            <Card.Body>
              <h4>{t.members}</h4>
              <ul>
                {users.map((user) => (
                  <li
                    key={user.id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    {user.name}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      {t.delete}
                    </Button>
                  </li>
                ))}
              </ul>
              <InputGroup className="mt-3">
                <Form.Control
                  type="text"
                  placeholder={t.userPlaceholder}
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
                <Button variant="success" onClick={handleAddUser}>
                  {t.addUser}
                </Button>
              </InputGroup>
            </Card.Body>
          </Card>
        </>
      ) : (
        <p>{t.listNotFound}</p>
      )}
    </div>
  );
};

export default AdminPanel;
