import * as React from 'react';

export function useComboboxValue(initialValue = '') {
    const [value, setValue] = React.useState(initialValue);
    return [value, setValue];
}

interface ComboboxProps {
    items: string[];
    onChange: React.ChangeEventHandler<HTMLSelectElement>;
}

export function Dropdown({ items, onChange }: ComboboxProps) {
    return (
        <select
            className="bg-slate-700 hover:bg-slate-900 rounded-lg p-2"
            onChange={onChange}
        >
            {items.map((item) => (
                <option>{item}</option>
            ))}
        </select>
    );
}
