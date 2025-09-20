'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, X, ChevronsUpDown } from 'lucide-react';

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
    ...props
  },
  ref,
) => {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

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
          className={cn(
            'flex w-full p-2 rounded-lg bg-background border border-input min-h-[44px]',
            className,
          )}
        >
          {selectedValues.length > 0 ? (
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-wrap items-center gap-1">
                {selectedValues.slice(0, maxCount).map((value) => {
                  const option = options.find((o) => o.value === value);
                  return (
                    <Badge
                      key={value}
                      className={cn(multiSelectVariants({ variant }))}
                    >
                      {option?.label}
                      <X
                        className="ml-2 h-4 w-4 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(value);
                        }}
                      />
                    </Badge>
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
          <CommandEmpty>No options found.</CommandEmpty>
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
          {allowOther && selectedValues.includes('Other') && (
            <div className="p-2">
              <Input
                placeholder="Specify other..."
                value={otherValue}
                onChange={(e) => onOtherValueChange?.(e.target.value)}
                className="w-full"
              />
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
});

MultiSelect.displayName = 'MultiSelect';

export { MultiSelect };
