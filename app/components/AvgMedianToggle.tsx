"use client"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export function AvgMedianToggle() {
  return (
    <ToggleGroup
      type="single"
      defaultValue="avg"
      className="bg-muted p-1 rounded-lg"
    >
      <ToggleGroupItem
        value="avg"
        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-md px-4"
      >
        AVG
      </ToggleGroupItem>
      <ToggleGroupItem
        value="median"
        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-md px-4"
      >
        MEDIAN
      </ToggleGroupItem>
    </ToggleGroup>
  )
}