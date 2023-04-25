import Input from "./Input";
import { search } from "../ultis/functions";
import { useState } from "react";
const Selector = ({
  placehoder,
  size,
  data,
  field,
  toShow = "ktscorp.vn",
  output,
}) => {
  const [query, setQuery] = useState("");
  const [openDataTable, setOpenDataTable] = useState(false);
  const [selected, setSelected] = useState(placehoder);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const sz =
    size === "xs" ? "py-0.5 text-xs" : size === "sm" ? "py-1 text-sm" : "py-2";

  return (
    <div
      className={`w-full border bg-white ${
        openDataTable && "border-primary-500"
      } rounded px-2 relative`}
    >
      <div
        className={`${sz} flex justify-between cursor-pointer`}
        onClick={() => setOpenDataTable(!openDataTable)}
      >
        <span className="truncate">{selected}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-4 h-4 ${openDataTable && "rotate-180"} duration-500`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>

      <div
        className={`absolute bg-white w-full right-0 top-[110%] ${
          openDataTable && "border border-primary-500"
        } rounded`}
      >
        <input
          type="text"
          placeholder="Tìm kiếm"
          className={`w-full ${sz} focus:outline-none rounded px-2 ${
            !openDataTable && "hidden"
          }`}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
        />
        <div
          className={`${
            openDataTable ? "max-h-36" : "h-0"
          } overflow-y-auto duration-100`}
        >
          {search(data, query, field).length > 0 ? (
            search(data, query, field).map((el, i) => {
              return (
                <div
                  key={i}
                  className={`cursor-pointer hover:bg-green-500 truncate px-2 ${sz} ${
                    i === selectedIndex ? "bg-green-500" : ""
                  }`}
                  onClick={(e) => {
                    setSelected(e.target.textContent);
                    output(e.target.textContent);
                    setSelectedIndex(i);
                    setOpenDataTable(false);
                  }}
                >
                  {el[toShow]}
                </div>
              );
            })
          ) : (
            <div className="p-2">Không có dữ liệu phù hợp</div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Selector;
