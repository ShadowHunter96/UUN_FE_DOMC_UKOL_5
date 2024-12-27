// Mockovaná data seznamů
const mockLists = [
  {
    id: 1,
    name: "Seznam 1",
    items: [
      { id: 1, name: "Položka 1", completed: false },
      { id: 2, name: "Položka 2", completed: true },
      { id: 3, name: "Položka 3", completed: false },
    ],
    users: [1, 2],
    archived: true,
  },
  {
    id: 2,
    name: "Seznam 2",
    items: [
      { id: 4, name: "Položka A", completed: false },
      { id: 5, name: "Položka B", completed: true },
    ],
    users: [2, 3],
    archived: true,
  },
  {
    id: 3,
    name: "Seznam 3",
    items: [
      { id: 6, name: "Položka X", completed: false },
      { id: 7, name: "Položka Y", completed: true },
      { id: 8, name: "Položka Z", completed: false },
    ],
    users: [1, 4],
    archived: false,
  },
  {
    id: 4,
    name: "Seznam 4",
    items: [
      { id: 9, name: "Položka AA", completed: true },
      { id: 10, name: "Položka BB", completed: false },
    ],
    users: [3, 4],
    archived: false,
  },
  {
    id: 5,
    name: "Seznam 5",
    items: [
      { id: 11, name: "Položka 11", completed: false },
      { id: 12, name: "Položka 12", completed: true },
      { id: 13, name: "Položka 13", completed: false },
    ],
    users: [1, 2, 3],
    archived: false,
  },
];

// Mockovaná data uživatelů
const mockUsers = [
  { id: 1, name: "Petr Novák", email: "petr.novak@example.com" },
  { id: 2, name: "Jana Svobodová", email: "jana.svobodova@example.com" },
  { id: 3, name: "Karel Dvořák", email: "karel.dvorak@example.com" },
  { id: 4, name: "Eva Novotná", email: "eva.novotna@example.com" },
];

// Statické kopie mock dat pro imunitu vůči změnám
const currentLists = Object.freeze(JSON.parse(JSON.stringify(mockLists)));
const currentUsers = Object.freeze(JSON.parse(JSON.stringify(mockUsers)));

// Funkce pro simulaci fetch
function mockFetch(url, options) {
  return new Promise((resolve, reject) => {
    console.log(`🚀 Mocked fetch called: ${url}`);
    console.log("Request options:", options);

    // GET /lists
    if (url.endsWith("/lists") && (!options || options.method === "GET")) {
      console.log("✅ Returning all lists:", currentLists);
      resolve(
        new Response(JSON.stringify(currentLists), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );

    // GET /lists/:id
    } else if (url.match(/\/lists\/\d+$/) && (!options || options.method === "GET")) {
      const id = parseInt(url.split("/").pop(), 10);
      const list = currentLists.find((item) => item.id === id);
      console.log(`🔍 Searching for list with ID: ${id}`);
      if (list) {
        console.log("✅ Found list:", list);
        resolve(
          new Response(JSON.stringify(list), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
        );
      } else {
        console.warn("⚠️ List not found:", id);
        resolve(new Response("List Not Found", { status: 404 }));
      }

    // GET /users
    } else if (url.endsWith("/users") && (!options || options.method === "GET")) {
      console.log("✅ Returning all users:", currentUsers);
      resolve(
        new Response(JSON.stringify(currentUsers), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );

    // Webpack hot-update bypass
    } else if (url.includes("hot-update.json")) {
      console.warn("⚠️ Ignoring Webpack hot-update request:", url);
      resolve(new Response(null, { status: 204 }));

    // Unknown endpoint
    } else {
      console.error(`❌ Unknown endpoint: ${url}`);
      reject(new Error(`Unknown endpoint: ${url}`));
    }
  });
}

// Funkce pro povolení mockování
export function enableMocking() {
  console.log("🚀 Mock server enabled with static data.");
  window.fetch = mockFetch;
}
