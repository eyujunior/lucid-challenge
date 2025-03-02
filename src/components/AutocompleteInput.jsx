import React, { useEffect, useState, useRef } from "react";
import useAutocompleteStore from "../store/autocomplete-store"; // Import the Zustand store

const AutocompleteInput = ({ data }) => {
    const {
        inputValue,
        filteredSuggestions,
        selectedTags,
        result,
        setInputValue,
        setFilteredSuggestions,
        setSelectedTags,
        setResult,
        addTag,
    } = useAutocompleteStore();

    const [isInputFocused, setIsInputFocused] = useState(false); // Track input focus state
    const suggestionListRef = useRef(null); // Ref for the suggestion list

    const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
    };

    useEffect(() => {
        if (inputValue.length === 0) {
            setFilteredSuggestions([]);
            return;
        }

        const lastChar = inputValue[inputValue.length - 1];
        if (/[\+\-\*\/\^\(\)]/.test(lastChar)) {
            setFilteredSuggestions(data);
            return;
        }

        const filtered = data?.filter((item) => item.name.toLowerCase().includes(inputValue.toLowerCase()));
        setFilteredSuggestions(filtered);
    }, [inputValue, data, setFilteredSuggestions]);

    const handleSuggestionClick = (suggestion) => {
        // Add the selected suggestion
        addTag(suggestion);
        setInputValue("");
        setFilteredSuggestions([]);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Backspace" && inputValue === "") {
            setSelectedTags(selectedTags.slice(0, -1));
        } else if (/[\+\-\*\/\^\(\)]/.test(e.key)) {
            e.preventDefault(); // Prevent the operand from being added to the input

            // Add the current input value (if it's a number) to selectedTags
            if (inputValue && !isNaN(inputValue)) {
                addTag({ name: inputValue, value: inputValue });
            }
            // Add the operand
            addTag({ name: e.key, value: e.key });
            setInputValue("");
        }
    };

    const isValidExpression = (expression) => {
        // Check if the expression ends with an operand or is incomplete
        if (/[\+\-\*\/\^\(\)]/.test(expression[expression.length - 1])) {
            return false;
        }
        return true;
    };

    const hasConsecutiveNumbersOrVariables = (tags) => {
        for (let i = 0; i < tags.length - 1; i++) {
            const currentTag = tags[i];
            const nextTag = tags[i + 1];

            // Check if both current and next tags are numbers or variables (not operands)
            if (!/[\+\-\*\/\^\(\)]/.test(currentTag.value) && !/[\+\-\*\/\^\(\)]/.test(nextTag.value)) {
                return true; // Consecutive numbers or variables found
            }
        }
        return false; // No consecutive numbers or variables
    };

    const calculateResult = () => {
        // Construct the expression from selectedTags and inputValue
        const expression = selectedTags
            .map((tag) => tag.value)
            .join("")
            .concat(inputValue);

        // Validate the expression before evaluating
        if (!isValidExpression(expression)) {
            setResult("Invalid expression");
            return;
        }

        // Check for consecutive numbers or variables
        if (hasConsecutiveNumbersOrVariables(selectedTags)) {
            setResult("Error: Missing operator");
            return;
        }

        try {
            // eslint-disable-next-line no-eval
            setResult(eval(expression));
        } catch (error) {
            setResult("Error");
        }
    };

    const handleClear = () => {
        setInputValue("");
        setSelectedTags([]);
        setResult("");
    };

    useEffect(() => {
        calculateResult();
    }, [selectedTags, inputValue, setResult]);

    const handleInputFocus = () => {
        setIsInputFocused(true);
    };

    const handleInputBlur = () => {
        // Delay hiding the suggestions to allow click events to process
        setTimeout(() => {
            if (!suggestionListRef.current?.contains(document.activeElement)) {
                setIsInputFocused(false);
            }
        }, 1000);
    };

    return (
        <div className="relative flex flex-col gap-4 p-6 bg-gray-50 rounded-lg shadow-lg max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Autocomplete Formula Input</h3>
            <div className="flex items-center justify-center w-full border border-gray-300 rounded-lg p-2 bg-white relative">
                {selectedTags?.map((tag, index) => (
                    <span
                        key={tag.id + index}
                        className={`whitespace-nowrap capitalize flex items-center justify-center rounded-full px-2 py-1 mr-2 text-sm font-semibold ${
                            /[\+\-\*\/\^\(\)]/.test(tag.name)
                                ? "bg-gray-100 text-gray-700" // Style for operands
                                : "border border-blue-300 bg-blue-50 text-blue-600" // Style for tags and numbers
                        }`}>
                        {tag.name}
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="w-full focus:outline-none"
                    placeholder="Enter formula"
                />
                {isInputFocused &&
                    filteredSuggestions?.length > 0 && ( // Only show suggestions when input is focused
                        <ul
                            ref={suggestionListRef}
                            className="absolute top-full left-0 z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-[10rem] overflow-y-auto shadow-md">
                            {filteredSuggestions?.map((suggestion, index) => (
                                <li
                                    key={suggestion.id + index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="p-2 text-sm hover:bg-gray-100 hover:text-blue-500 cursor-pointer capitalize">
                                    {suggestion.name}
                                </li>
                            ))}
                        </ul>
                    )}
            </div>
            <div className="flex items-center justify-between">
                <input
                    type="text"
                    value={result}
                    readOnly
                    className="w-full focus:outline-none border border-gray-300 p-2.5 text-sm rounded-lg bg-white"
                    placeholder="0.0"
                />
                <button
                    onClick={handleClear}
                    className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    Clear
                </button>
            </div>
        </div>
    );
};

export default AutocompleteInput;
