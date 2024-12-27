import React, { useState, useEffect } from "react";
import { Table, Button, Form, Card } from "react-bootstrap";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const translations = {
  en: {
    userPanel: "User Panel",
    itemList: "Item List",
    members: "Members",
    number: "Number",
    item: "Item",
    completed: "Completed",
    actions: "Actions",
    delete: "Delete",
    leaveList: "Leave List",
    leaveListMessage: "Are you sure you want to leave the list?",
    loading: "Loading data...",
    error: "Failed to load data from mock server",
    listNotFound: "List not found.",
  },
  cz: {
    userPanel: "Uživatelský panel",
    itemList: "Seznam položek",
    members: "Členové seznamu",
    number: "Číslo",
    item: "Položka",
    completed: "Dokončeno",
    actions: "Akce",
    delete: "Smazat",
    leaveList: "Odejít ze seznamu",
    leaveListMessage: "Opravdu chcete opustit seznam?",
    loading: "Načítání dat...",
    error: "Nepodařilo se načíst data z mock serveru",
    listNotFound: "Seznam nebyl nalezen.",
  },
};

const UserPanel = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();

  const t = translations[language]; // Access translations based on language

  const [currentList, setCurrentList] = useState(null);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleToggleCompleted = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDeleteItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleLeaveList = () => {
    alert(t.leaveListMessage);
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
      <h1 className="text-center mb-4">{t.userPanel}</h1>
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
            </Card.Body>
          </Card>

          <Card
            style={{
              backgroundColor: theme === "light" ? "#f9f9f9" : "#1e1e1e",
              color: theme === "light" ? "#000000" : "#ffffff",
            }}
          >
            <Card.Body>
              <h4>{t.members}</h4>
              <ul>
                {users.map((user) => (
                  <li key={user.id}>
                    {user.name} ({user.email})
                  </li>
                ))}
              </ul>
              <Button variant="danger" onClick={handleLeaveList}>
                {t.leaveList}
              </Button>
            </Card.Body>
          </Card>
        </>
      ) : (
        <p>{t.listNotFound}</p>
      )}
    </div>
  );
};

export default UserPanel;
