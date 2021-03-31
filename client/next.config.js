module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:page*",
        destination: "http://localhost:5000/api/:page*", // Matched parameters can be used in the destination
      },
    ];
  },
};
