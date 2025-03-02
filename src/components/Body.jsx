// Autocomplete.js
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AutocompleteInput from "./AutocompleteInput";

const Body = () => {
    const fetchData = async () => {
        const response = await axios.get("https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete");
        return response.data;
    };
    const { data, isLoading, isError } = useQuery({ queryKey: ["autocompleteData"], queryFn: fetchData });

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading data.</p>;

    return (
        <div className="p-16 pt-8 rounded-2xl flex items-center justify-center">
            <div className="w-full max-w-xl">
                <AutocompleteInput label="Search" data={data} />
            </div>
        </div>
    );
};

export default Body;
