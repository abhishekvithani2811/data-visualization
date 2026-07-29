import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import type { CarSale } from "@/types/car";

function toRows(cars: CarSale[]) {
  return cars.map((car) => ({
    Year: car.year,
    Make: car.makeName || car.make,
    Model: car.model,
    Trim: car.trim,
    Body: car.bodyType || car.body,
    Transmission: car.transmission,
    VIN: car.vin,
    State: car.stateName || car.state,
    Condition: car.condition,
    Odometer: car.odometer,
    Color: car.color,
    Interior: car.interior,
    Seller: car.seller,
    MMR: car.mmr,
    SellingPrice: car.sellingprice,
    SaleDate: car.saledate,
  }));
}

export function exportCSV(cars: CarSale[]) {
  const rows = toRows(cars);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  saveAs(blob, `car-sales-${Date.now()}.csv`);
}

export function exportExcel(cars: CarSale[]) {
  const rows = toRows(cars);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Car Sales");
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `car-sales-${Date.now()}.xlsx`);
}

export function printDashboard() {
  window.print();
}
