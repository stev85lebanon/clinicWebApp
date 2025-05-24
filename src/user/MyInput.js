import React from 'react';

export default function MyInput({ type, placeholder, value, handleChange, classname, required, field }) {
    return (
        type === "checkbox" ? (
            <input
                type={type}
                placeholder={placeholder}
                checked={value}
                onChange={(e) => handleChange(field, e)}  // Pass both field and event to the handler
                // onChange={(e) => handleChange(field)(e)}  // Pass both field and event to the handler
                className={classname}
                required={required}
            />) : (
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => handleChange(field, e)}  // Pass both field and event to the handler
                // onChange={(e) => handleChange(field)(e)}  // Pass both field and event to the handler
                className={classname}
                required={required}
            />
        )

    );
}
