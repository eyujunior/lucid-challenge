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
        <div className="pt-12 rounded-2xl flex items-center justify-center w-11/12 sm:w-4/5 md:w-1/2 xl:w-1/3 2xl:w-1/3 mx-auto max-w-xl">
            <div className="w-full">
                <AutocompleteInput label="Search" data={data} />
            </div>
        </div>
    );
};

export default Body;
