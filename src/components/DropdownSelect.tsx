
import { useState, useEffect, useRef } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
};

type DropdownSelectProps = {
  options: Option[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  className?: string;
};

const DropdownSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  multiple = false,
  className,
}: DropdownSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const values = value as string[];
      if (values.includes(optionValue)) {
        onChange(values.filter((v) => v !== optionValue));
      } else {
        onChange([...values, optionValue]);
      }
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const getSelectedLabels = () => {
    if (multiple) {
      const values = value as string[];
      if (values.length === 0) return placeholder;
      
      return options
        .filter((option) => values.includes(option.value))
        .map((option) => option.label)
        .join(", ");
    } else {
      const option = options.find((option) => option.value === value);
      return option ? option.label : placeholder;
    }
  };

  const isSelected = (optionValue: string) => {
    if (multiple) {
      return (value as string[]).includes(optionValue);
    } else {
      return value === optionValue;
    }
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <div
        className="flex items-center justify-between p-3 border rounded-md bg-background cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {getSelectedLabels()}
        </span>
        <ChevronDownIcon
          className={cn("h-4 w-4 transition-transform", isOpen && "transform rotate-180")}
        />
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                "flex items-center justify-between p-3 cursor-pointer hover:bg-secondary",
                isSelected(option.value) && "bg-secondary"
              )}
              onClick={() => handleSelect(option.value)}
            >
              <span>{option.label}</span>
              {isSelected(option.value) && <CheckIcon className="h-4 w-4 text-smart-primary" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownSelect;
