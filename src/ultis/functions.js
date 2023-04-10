export const search = (list, query, feild) => {
  return list.filter((el) =>
    el[feild].normalize("NFC").toLowerCase().includes(query)
  );
};
