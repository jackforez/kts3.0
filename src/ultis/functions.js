export const search = (list, query, feild) => {
  return list.filter((el) =>
    el[feild].normalize("NFC").toLowerCase().includes(query)
  );
};

export const toVND = (number) => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "VND",
  }).format(stringToCurency);
};
