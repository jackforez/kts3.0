import Button from "./components/Button";
import { pencil, trash } from "./ultis/svgs";
const handleClick = (e) => {
  e.preventDefault();
  console.log("click");
};
function App() {
  return (
    <div>
      <Button
        type="success"
        title="nuts"
        size="1/2"
        icon={pencil}
        iconSize={"4"}
        callback={handleClick}
      >
        abc
      </Button>
    </div>
  );
}

export default App;
