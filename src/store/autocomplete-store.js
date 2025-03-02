// store.js
import { create } from "zustand";

const useAutocompleteStore = create((set) => ({
    inputValue: "",
    filteredSuggestions: [],
    selectedTags: [],
    result: "0.0",

    setInputValue: (value) => set({ inputValue: value }),
    setFilteredSuggestions: (suggestions) => set({ filteredSuggestions: suggestions }),
    setSelectedTags: (tags) => set({ selectedTags: tags }),
    setResult: (result) => set({ result }),

    // Helper function to add a tag
    addTag: (tag) =>
        set((state) => ({
            selectedTags: [...state.selectedTags, { ...tag, id: Date.now() }],
        })),

    // Helper function to remove a tag
    removeTag: (tagId) =>
        set((state) => ({
            selectedTags: state.selectedTags.filter((t) => t.id !== tagId),
        })),
}));

export default useAutocompleteStore;
