const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendSignup = functions.https.onRequest(async (req, res) => {
  try {
    const data = req.body;

    const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "unknown";

    const db = admin.firestore();
    const today = new Date().toISOString().slice(0, 10);

    const phoneQuery = await db.collection("zgloszenia")
        .where("telefon", "==", data.telefon)
        .where("day", "==", today)
        .get();

    if (!phoneQuery.empty) {
      return res.status(429).send("Ten numer już wysłał zgłoszenie dziś");
    }

    const ipQuery = await db.collection("zgloszenia")
        .where("ip", "==", ip)
        .where("day", "==", today)
        .get();

    if (ipQuery.size >= 3) {
      return res.status(429).send("Za dużo zgłoszeń z tego IP");
    }

    await db.collection("zgloszenia").add({
      ...data,
      ip,
      day: today,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.send("OK");
  } catch (e) {
    console.log(e);
    return res.status(500).send("Błąd");
  }
});