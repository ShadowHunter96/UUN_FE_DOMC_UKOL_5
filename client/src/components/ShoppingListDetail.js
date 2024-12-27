import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Container, Row, Col, Spinner, Alert } from "react-bootstrap";

const ShoppingListDetail = () => {
  const { id } = useParams(); // Získání ID seznamu z URL
  const [list, setList] = useState(null);
  const [owner, setOwner] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dat pro konkrétní seznam
  useEffect(() => {
    const fetchListDetail = async () => {
      try {
        setLoading(true);

        // Načtení detailu seznamu
        const listResponse = await fetch(`http://localhost:3001/lists/${id}`);
        if (!listResponse.ok) throw new Error("Nepodařilo se načíst seznam");
        const listData = await listResponse.json();
        setList(listData);

        // Načtení všech uživatelů (potřebujeme najít vlastníka a členy)
        const usersResponse = await fetch(`http://localhost:3001/users`);
        if (!usersResponse.ok) throw new Error("Nepodařilo se načíst uživatele");
        const usersData = await usersResponse.json();

        // Určení vlastníka a členů
        const listOwner = usersData.find((user) => user.id === listData.users[0]);
        setOwner(listOwner || { name: "Neznámý vlastník" });

        const listMembers = usersData.filter(
          (user) => listData.users.includes(user.id) && user.id !== listData.users[0]
        );
        setMembers(listMembers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListDetail();
  }, [id]);

  // Zobrazení stavu načítání nebo chyby
  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!list) return <div>Seznam nenalezen</div>;

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">{list.name}</h1>

      {/* Vlastník */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h4 className="mb-3">Vlastník</h4>
          <p className="mb-0">
            <strong>{owner.name}</strong>
          </p>
        </Card.Body>
      </Card>

      {/* Členové */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h4 className="mb-3">Členové</h4>
          {members.length > 0 ? (
            <ul className="list-unstyled mb-0">
              {members.map((member) => (
                <li key={member.id} className="mb-2">
                  <strong>{member.name}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p>Žádní členové</p>
          )}
        </Card.Body>
      </Card>

      {/* Položky seznamu */}
      <Card className="shadow-sm">
        <Card.Body>
          <h4 className="mb-3">Položky</h4>
          {list.items.length > 0 ? (
            <ul className="list-group">
              {list.items.map((item) => (
                <li
                  key={item.id}
                  className={`list-group-item d-flex justify-content-between align-items-center ${
                    item.completed ? "list-group-item-success" : ""
                  }`}
                >
                  {item.name}
                  <span>
                    {item.completed ? "✔️ Dokončeno" : "⏳ Nedokončeno"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Žádné položky</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ShoppingListDetail;
