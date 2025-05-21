
import React, { useState, useEffect, useRef } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

  // Close dropdown when touch outside (for mobile)
  useEffect(() => {
    const handleTouchOutside = (event: TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("touchend", handleTouchOutside);
    return () => {
      document.removeEventListener("touchend", handleTouchOutside);
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
      <motion.div
        className="flex items-center justify-between p-4 border rounded-md bg-background cursor-pointer hover:border-primary/50 transition-colors duration-200 active:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.98 }}
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
          <ChevronDownIcon className="h-5 w-5" />
        </motion.div>
      </motion.div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute z-50 w-full mt-1 bg-background shadow-lg border rounded-md max-h-64 overflow-auto"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ backdropFilter: "blur(8px)" }}
          >
            {options.map((option, index) => (
              <motion.div
                key={option.value}
                className={cn(
                  "flex items-center justify-between p-4 cursor-pointer",
                  isSelected(option.value) 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-secondary active:bg-secondary/80",
                  "transition-colors duration-200"
                )}
                onClick={() => handleSelect(option.value)}
                variants={itemVariants}
                custom={index}
                initial="hidden"
                animate="visible"
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  {option.icon && (
                    <span className="text-primary">
                      {React.isValidElement(option.icon) 
                        ? option.icon 
                        : option.icon && typeof option.icon === 'function'
                          ? React.createElement(option.icon as React.ComponentType<{size?: number}>, { size: 20 })
                          : null}
                    </span>
                  )}
                  <span className="text-base">{option.label}</span>
                </div>
                {isSelected(option.value) && (
                  <CheckIcon className="h-5 w-5 text-primary" />
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
