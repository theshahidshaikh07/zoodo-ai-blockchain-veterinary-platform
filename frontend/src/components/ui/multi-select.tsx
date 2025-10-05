'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, X, ChevronsUpDown, Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const multiSelectVariants = cva(
  'm-1 border-foreground/20',
  {
    variants: {
      variant: {
        default:
          'border-2 border-white bg-transparent hover:bg-primary/10 text-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        inverted:
          'inverted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

interface MultiSelectProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof multiSelectVariants> {
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  onValueChange: (value: string[]) => void;
  defaultValue: string[];
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  asChild?: boolean;
  className?: string;
  allowOther?: boolean;
  otherValue?: string;
  onOtherValueChange?: (value: string) => void;
  allowCustom?: boolean;
  customPlaceholder?: string;
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>((
  {
    options,
    onValueChange,
    variant,
    defaultValue = [],
    placeholder = 'Select options',
    animation = 0,
    maxCount = 5,
    asChild = false,
    className,
    allowOther = false,
    otherValue = '',
    onOtherValueChange,
    allowCustom = false,
    customPlaceholder = 'Add custom option...',
    ...props
  },
  ref,
) => {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [customInputValue, setCustomInputValue] = React.useState('');

  React.useEffect(() => {
    setSelectedValues(defaultValue);
  }, [defaultValue]);

  const handleSelect = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    setSelectedValues(newSelectedValues);
    onValueChange(newSelectedValues);
  };

  const handleRemove = (valueToRemove: string) => {
    console.log('handleRemove called with:', valueToRemove); // Debug log
    console.log('Current selectedValues:', selectedValues); // Debug log
    const newSelectedValues = selectedValues.filter((v) => v !== valueToRemove);
    console.log('New selectedValues:', newSelectedValues); // Debug log
    setSelectedValues(newSelectedValues);
    onValueChange(newSelectedValues);
  };

  const handleCustomAdd = () => {
    if (customInputValue.trim() && !selectedValues.includes(customInputValue.trim())) {
      let newSelectedValues = [...selectedValues];
      
      // If "Other" is selected, replace it with the custom value
      if (newSelectedValues.includes('Other')) {
        newSelectedValues = newSelectedValues.filter(v => v !== 'Other');
      }
      
      newSelectedValues.push(customInputValue.trim());
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
      setCustomInputValue('');
    }
  };

  const handleCustomInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomAdd();
    }
  };

  const handleOtherInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && otherValue.trim()) {
      e.preventDefault();
      // Replace "Other" with the custom value
      const newSelectedValues = selectedValues.filter(v => v !== 'Other');
      newSelectedValues.push(otherValue.trim());
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
      onOtherValueChange?.('');
    }
  };

  const togglePopover = () => {
    setIsPopoverOpen((prev) => !prev);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          {...props}
          onClick={togglePopover}
          variant="outline"
          className={cn(
            'flex w-full p-2 rounded-lg bg-background border border-input min-h-[44px] hover:bg-background hover:text-foreground',
            className,
          )}
        >
          {selectedValues.length > 0 ? (
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-wrap items-center gap-1">
                {selectedValues.slice(0, maxCount).map((value) => {
                  const option = options.find((o) => o.value === value);
                  return (
                    <div key={value} className="relative inline-flex items-center">
                      <Badge
                        className={cn(multiSelectVariants({ variant }))}
                      >
                        {option?.label || value}
                      </Badge>
                      <div
                        className="ml-1 h-4 w-4 cursor-pointer hover:text-destructive z-10 relative flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          console.log('X clicked for:', value); // Debug log
                          handleRemove(value);
                        }}
                        style={{ pointerEvents: 'auto' }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleRemove(value);
                          }
                        }}
                      >
                        <X className="h-3 w-3" />
                      </div>
                    </div>
                  );
                })}
                {selectedValues.length > maxCount && (
                  <span className="text-xs text-muted-foreground ml-2">
                    +{selectedValues.length - maxCount} more
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full text-muted-foreground">
              <span>{placeholder}</span>
              <ChevronsUpDown className="h-4 w-4" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>
            {allowCustom ? (
              <div className="p-2">
                <div className="text-sm text-muted-foreground mb-2">No options found. Add a custom option:</div>
                <div className="flex gap-2">
                  <Input
                    placeholder={customPlaceholder}
                    value={customInputValue}
                    onChange={(e) => setCustomInputValue(e.target.value)}
                    onKeyDown={handleCustomInputKeyDown}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={handleCustomAdd}
                    disabled={!customInputValue.trim()}
                    className="px-3"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              "No options found."
            )}
          </CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => handleSelect(option.value)}
                style={{ pointerEvents: 'auto', opacity: 1 }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedValues.includes(option.value) ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
          {allowCustom && !allowOther && (
            <div className="p-2 border-t">
              <div className="text-sm text-muted-foreground mb-2">Add custom option:</div>
              <div className="flex gap-2">
                <Input
                  placeholder={customPlaceholder}
                  value={customInputValue}
                  onChange={(e) => setCustomInputValue(e.target.value)}
                  onKeyDown={handleCustomInputKeyDown}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={handleCustomAdd}
                  disabled={!customInputValue.trim()}
                  className="px-3"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          {allowOther && selectedValues.includes('Other') && (
            <div className="p-2 border-t">
              <div className="text-sm text-muted-foreground mb-2">Specify other:</div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your custom option..."
                  value={otherValue}
                  onChange={(e) => onOtherValueChange?.(e.target.value)}
                  onKeyDown={handleOtherInputKeyDown}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (otherValue.trim()) {
                      const newSelectedValues = selectedValues.filter(v => v !== 'Other');
                      newSelectedValues.push(otherValue.trim());
                      setSelectedValues(newSelectedValues);
                      onValueChange(newSelectedValues);
                      onOtherValueChange?.('');
                    }
                  }}
                  disabled={!otherValue.trim()}
                  className="px-3"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
});

MultiSelect.displayName = 'MultiSelect';

export { MultiSelect };
