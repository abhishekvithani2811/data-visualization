import { initializeApp } from "firebase/app";
import { getFirestore, collection, writeBatch, doc } from "firebase/firestore";
import { createReadStream } from "fs";
import { parse } from "csv-parse";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const firebaseConfig = {
  apiKey: "AIzaSyC2vRDZ2pbLk-4xaN2NleYSeM-YtRTb5VE",
  authDomain: "vehicle-analytics-dashboard.firebaseapp.com",
  projectId: "vehicle-analytics-dashboard",
  storageBucket: "vehicle-analytics-dashboard.firebasestorage.app",
  messagingSenderId: "662063605608",
  appId: "1:662063605608:web:d6fd5432cda8de55c098dd",
  measurementId: "G-FQZ2G6D1FQ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function parseDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

async function uploadCSV() {
  const csvPath = join(__dirname, "../car_prices_clean.csv");
  const records = [];

  await new Promise((resolve, reject) => {
    createReadStream(csvPath)
      .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }))
      .on("data", (row) => {
        const record = {
          year: parseInt(row.year) || null,
          make: row.make?.trim().toLowerCase() || "",
          model: row.model?.trim().toLowerCase() || "",
          trim: row.trim?.trim() || "",
          body: row.body?.trim().toLowerCase() || "",
          transmission: row.transmission?.trim().toLowerCase() || "",
          vin: row.vin?.trim().toLowerCase() || "",
          state: row.state?.trim().toLowerCase() || "",
          condition: parseFloat(row.condition) || null,
          odometer: parseInt(row.odometer) || null,
          color: row.color?.trim().toLowerCase() || "",
          interior: row.interior?.trim().toLowerCase() || "",
          seller: row.seller?.trim().toLowerCase() || "",
          mmr: parseFloat(row.mmr) || null,
          sellingprice: parseFloat(row.sellingprice) || null,
          saledate: parseDate(row.saledate),
          // Extra fields for easy filtering
          makeName: row.make?.trim() || "",
          stateName: row.state?.trim().toUpperCase() || "",
          bodyType: row.body?.trim() || "",
        };
        records.push(record);
      })
      .on("end", resolve)
      .on("error", reject);
  });

  console.log(`Total records to upload: ${records.length}`);

  // Firestore writeBatch supports max 500 docs per batch
  const BATCH_SIZE = 499;
  let batchCount = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const chunk = records.slice(i, i + BATCH_SIZE);

    chunk.forEach((record) => {
      const docRef = doc(collection(db, "car_sales"));
      batch.set(docRef, record);
    });

    await batch.commit();
    batchCount++;
    console.log(
      `Batch ${batchCount} committed — uploaded ${Math.min(i + BATCH_SIZE, records.length)} / ${records.length} records`
    );
  }

  console.log(`\n✅ Upload complete! Total ${records.length} records uploaded to Firestore collection "car_sales".`);
  process.exit(0);
}

uploadCSV().catch((err) => {
  console.error("❌ Upload failed:", err);
  process.exit(1);
});
