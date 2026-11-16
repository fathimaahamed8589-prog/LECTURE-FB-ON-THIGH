# Student Feedback: Posterior Thigh & Popliteal Fossa

Web form for collecting student feedback on the lecture covering the posterior compartment of the thigh and the popliteal fossa.

## Run
```bash
ADMIN_KEY=yourpass node server.js     # default key "anatomy", port 3000
```
Share `http://<your-ip>:3000` with students. Responses are saved to `responses.json`.
Open the **Teacher dashboard** tab and enter the admin key to see averages, comments and a CSV download.

No server? Open `public/index.html` directly. Responses are then saved only in that browser.

## Contents
- 6 lecture ratings and 6 topic-understanding ratings (1 to 5)
- 5-question self-check quiz with an instant score
- Open comments: most helpful, improvements, still unclear
