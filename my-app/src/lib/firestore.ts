import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import type { CarSale } from "@/types/car";

const COLLECTION_NAME = "car_sales";

export async function fetchCarSales(): Promise<CarSale[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();

    return {
      id: docSnap.id,
      year: data.year ?? null,
      make: data.make ?? "",
      makeName: data.makeName ?? "",
      model: data.model ?? "",
      trim: data.trim ?? "",
      body: data.body ?? "",
      bodyType: data.bodyType ?? "",
      transmission: data.transmission ?? "",
      vin: data.vin ?? "",
      state: data.state ?? "",
      stateName: data.stateName ?? "",
      condition: data.condition ?? null,
      odometer: data.odometer ?? null,
      color: data.color ?? "",
      interior: data.interior ?? "",
      seller: data.seller ?? "",
      mmr: data.mmr ?? null,
      sellingprice: data.sellingprice ?? null,
      saledate: data.saledate ?? null,
    } satisfies CarSale;
  });
}
