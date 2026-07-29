export interface CarSale {
  id: string;
  year: number | null;
  make: string;
  makeName: string;
  model: string;
  trim: string;
  body: string;
  bodyType: string;
  transmission: string;
  vin: string;
  state: string;
  stateName: string;
  condition: number | null;
  odometer: number | null;
  color: string;
  interior: string;
  seller: string;
  mmr: number | null;
  sellingprice: number | null;
  saledate: string | null;
}
