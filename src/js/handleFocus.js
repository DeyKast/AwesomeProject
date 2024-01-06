import { useState } from "react";

const useInputFocus = () => {
  const [focusedInput, setFocusedInput] = useState("");

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput("");
  };

  const isInputFocused = (inputName) => {
    return focusedInput === inputName;
  };

  return {
    handleFocus,
    handleBlur,
    isInputFocused,
  };
};

export default useInputFocus;
