import * as React from 'react';

export function useComboboxValue(initialValue = '') {
    const [value, setValue] = React.useState(initialValue);
    return [value, setValue];
}

export interface SelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    items: string[];
}

const Dropdown = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ items, ...props }, ref) => (
        <select
            className="bg-slate-700 hover:bg-slate-800 border dark:border-slate-700 rounded-lg p-2"
            ref={ref}
            {...props}
        >
            {items.map((item) => (
                <option key={item}>{item}</option>
            ))}
        </select>
    )
);
Dropdown.displayName = 'Dropdown';

export { Dropdown };
