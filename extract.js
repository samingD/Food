import https from "https";
https.get("https://ibb.co/950DskN", (res) => {
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => {
    const match = data.match(/https:\/\/i\.ibb\.co\/[^"']+/g);
    console.log(match);
  });
});
