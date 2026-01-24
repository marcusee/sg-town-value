"use client"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useTownStore } from "../store/TownStore";

export function AvgMedianToggle() {
  
  const {setPriceMetric, priceMetric} = useTownStore()
  
  return (
    <ToggleGroup
      type="single"
      defaultValue="avg"
      className="bg-muted p-1 rounded-lg"
      onValueChange={(value) => {
        if (value !== "avg" && value !== "median") return
        setPriceMetric(value)
      }}
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