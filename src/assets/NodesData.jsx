export const nodesData = [
    {
      id: 1,
      name: "Alice",
      monetaryValue: 500,
      position: [-2, 2, 0],
      color: "#204090",
      connections: [2, 3, 5], // references other nodes by their id
      // profileImage: `profile/${id}.webp`,
    },
    {
      id: 2,
      name: "Bob",
      monetaryValue: 300,
      position: [2, -3, 0],
      color: "#904020",
      connections: [1, 4],
      profileImage: "profile/bob-profile.webp",
    },
    {
      id: 3,
      name: "Charlie",
      monetaryValue: 200,
      position: [-0.25, 0, 0],
      color: "#209040",
      connections: [],
      profileImage: "profile/charlie-profile.webp",
    },
    {
      id: 4,
      name: "David",
      monetaryValue: 450,
      position: [0.5, -0.75, 0],
      color: "#204090",
      connections: [2],
      profileImage: "profile/david-profile.webp",
    },
    {
      id: 5,
      name: "Eve",
      monetaryValue: 350,
      position: [-0.5, -1, 0],
      color: "#204090",
      connections: [1],
      profileImage: "profile/eve-profile.webp",
    },
  ];
  