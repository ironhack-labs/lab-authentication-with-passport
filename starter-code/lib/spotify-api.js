let https = require("follow-redirects").https;

const spotifyEndpoint = (token, cb) => {
  let options = {
    method: "GET",
    hostname: "api.spotify.com",
    path: "/v1/me/top/artists",
    headers: {
      Authorization: "Bearer " + token
    },
    maxRedirects: 20
  };

  let req = https.request(options, function(res) {
    let chunks = [];

    res.on("data", function(chunk) {
      chunks.push(chunk);
    });

    res.on("end", function(chunk) {
      let body = Buffer.concat(chunks);
      let artists = JSON.parse(body.toString());
      cb(artists.items);
    });

    res.on("error", function(error) {
      console.error(error);
    });
  });

  req.end();
};

module.exports = spotifyEndpoint;
