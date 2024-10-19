import React from 'react';

const SearchBar = ({ value, onChange, placeholder }) => {
    return (
        <div className="mb-4">
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="border border-gray-300 rounded p-2 w-full"
            />
        </div>
    );
};

export default SearchBar;
