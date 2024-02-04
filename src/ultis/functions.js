export const search = (list, query, feild) => {
  return list.filter((el) =>
    feild.some((key) => el[key]?.normalize("NFC").toLowerCase().includes(query))
  );
  // return list.filter((item) =>
  //   feild.some((key) => item[key]?.toLowerCase().includes(query))
  // );
};

export const toVND = (stringToCurency) => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "VND",
  }).format(stringToCurency);
};

export const ktsCurrencyFomat = (stringToCurency = 200000, symbol = ".") => {
  return stringToCurency
    .toString()
    .split("")
    .reverse()
    .reduce((prev, next, index) => {
      return (index % 3 ? next : next + symbol) + prev;
    });
};

export const textAvatar = (text) => {
  let name = text.split(" ");
  if (name.length === 1) {
    return name[0].charAt().toUpperCase();
  } else {
    return (
      name[0].charAt(0).toUpperCase() +
      name[name.length - 1].charAt(0).toUpperCase()
    );
  }
};
export const testKey = (event, inputText) => {
  const regex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
  if (!regex.test(inputText)) {
    event.preventDefault();
    return false;
  }
};
