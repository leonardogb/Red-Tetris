const params = {
  server: {
    host: "0.0.0.0",
    port: process.env.PORT || 3004,
    get url() {
      return "https://" + this.host + ":" + this.port;
    },
  },
};

module.exports = params;
