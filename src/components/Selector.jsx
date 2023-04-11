import Input from "./Input";
import { search } from "../ultis/functions";
import { useState } from "react";
const Selector = ({ placehoder, size, data, output }) => {
  const [query, setQuery] = useState("");
  const [openDataTable, setOpenDataTable] = useState(false);
  const [selected, setSelected] = useState(placehoder);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const sz =
    size === "xs" ? "py-0.5 text-xs" : size === "sm" ? "py-1 text-sm" : "py-2";

  return (
    <div className="w-full border border-green-500 rounded px-2">
      <div className={`${sz} flex justify-between`}>
        <span>{selected}</span>
        <button onClick={() => setOpenDataTable(!openDataTable)}>
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
        </button>
      </div>

      {openDataTable && (
        <div>
          <input
            type="text"
            placeholder="Nhập tên tỉnh thành để tìm kiếm"
            className={`w-full ${sz} focus:outline-none rounded`}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
          />
          <div
            className={`h-36 overflow-y-auto divide-green-500/10 divide-y duration-500`}
          >
            {data && search(data, query, "name_with_type").length > 0 ? (
              search(data, query, "name_with_type").map((el, i) => {
                return (
                  <div
                    key={i}
                    className={`cursor-pointer ${sz} ${
                      i === selectedIndex ? "bg-green-500" : ""
                    }`}
                    onClick={(e) => {
                      setSelected(e.target.textContent);
                      output(e.target.textContent);
                      setSelectedIndex(i);
                    }}
                  >
                    {el.name_with_type}
                  </div>
                );
              })
            ) : (
              <div className="p-2">Không có dữ liệu phù hợp</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Selector;
