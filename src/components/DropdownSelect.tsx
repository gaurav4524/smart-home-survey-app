
import React, { useState, useEffect, useRef } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";

type Option = {
  value: string;
  label: string;
  icon?: React.ComponentType<any> | React.ReactNode;
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

  const dropdownVariants = {
    hidden: { opacity: 0, y: -5, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        damping: 20,
        stiffness: 300
      } 
    },
    exit: { 
      opacity: 0, 
      y: -5, 
      scale: 0.95,
      transition: { duration: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: custom * 0.05 }
    }),
    hover: { x: 5 }
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <div
        className="flex items-center justify-between p-3 border rounded-md bg-background cursor-pointer hover:border-primary/50 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={cn(
          value ? "text-foreground" : "text-muted-foreground",
          "transition-all duration-200"
        )}>
          {getSelectedLabels()}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDownIcon className="h-4 w-4" />
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute z-50 w-full mt-1 bg-background/95 backdrop-blur-sm border rounded-md shadow-lg max-h-60 overflow-auto"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {options.map((option, index) => (
              <motion.div
                key={option.value}
                className={cn(
                  "flex items-center justify-between p-3 cursor-pointer",
                  isSelected(option.value) 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-secondary",
                  "transition-colors duration-200"
                )}
                onClick={() => handleSelect(option.value)}
                variants={itemVariants}
                custom={index}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <div className="flex items-center gap-2">
                  {option.icon && (
                    <span className="text-primary">
                      {React.isValidElement(option.icon) 
                        ? option.icon 
                        : option.icon && typeof option.icon === 'function'
                          ? React.createElement(option.icon as React.ComponentType<{size?: number}>, { size: 18 })
                          : null}
                    </span>
                  )}
                  <span>{option.label}</span>
                </div>
                {isSelected(option.value) && (
                  <CheckIcon className="h-4 w-4 text-primary animate-pulse-gentle" />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownSelect;
