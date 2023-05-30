import { MDBBtn, MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle } from 'mdbreact';
import React, { useState } from 'react';

const SELECT_AN_OPTION_TITLE = "Select Revision";

const CustomSearchableDropdown = ({ options, onSelect, onClear }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedText, setSelectedText] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredOptions = options.filter((option) =>
        option.text.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOptionSelect = (value, text) => {
        setSelectedText(text);
        onSelect(value);
        setSearchQuery('');
        setIsOpen(false);
    };

    const handleClear = () => {
        setSelectedText('');
        onClear();
    };

    return (
        <MDBDropdown dropright>
            <MDBBtn outline className='mx-2' color='info' onClick={() => {
                handleClear()
            }}>Clear</MDBBtn>
            <MDBDropdownToggle caret color="primary">
                {selectedText ? selectedText : SELECT_AN_OPTION_TITLE}
            </MDBDropdownToggle>
            <MDBDropdownMenu>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onClick={(e) => e.stopPropagation()}
                />
                {filteredOptions.map((option) => (
                    <MDBDropdownItem
                        key={option.value}
                        onClick={() => handleOptionSelect(option.value, option.text)}
                    >
                        {option.text}
                    </MDBDropdownItem>
                ))}
            </MDBDropdownMenu>
        </MDBDropdown>
    );
};

export default CustomSearchableDropdown;